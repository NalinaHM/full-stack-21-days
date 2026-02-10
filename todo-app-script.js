const STORAGE_KEY = "todo_app_items_v1";

/**
 * @typedef {Object} TodoItem
 * @property {string} id
 * @property {string} text
 * @property {boolean} completed
 */

/** @type {TodoItem[]} */
let todos = [];
let currentFilter = "all"; // 'all' | 'active' | 'completed'

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const listEl = document.getElementById("todo-list");
const filtersEl = document.getElementById("filters");
const clearCompletedButton = document.getElementById("clear-completed");
const itemsLeftEl = document.getElementById("items-left");

function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      todos = parsed.map((t) => ({
        id: String(t.id ?? crypto.randomUUID?.() ?? Date.now()),
        text: String(t.text ?? "").trim(),
        completed: Boolean(t.completed),
      }));
    }
  } catch (e) {
    console.error("Failed to load todos", e);
  }
}

function saveTodos() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (e) {
    console.error("Failed to save todos", e);
  }
}

function createTodo(text) {
  const trimmed = text.trim();
  if (!trimmed) return;

  const todo = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    text: trimmed,
    completed: false,
  };
  todos.unshift(todo);
  saveTodos();
  render();
}

function toggleTodo(id) {
  todos = todos.map((t) =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  saveTodos();
  render();
}

function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  saveTodos();
  render();
}

function updateTodoText(id, newText) {
  const trimmed = newText.trim();
  if (!trimmed) {
    deleteTodo(id);
    return;
  }
  todos = todos.map((t) => (t.id === id ? { ...t, text: trimmed } : t));
  saveTodos();
  render();
}

function setFilter(filter) {
  currentFilter = filter;
  render();
}

function clearCompleted() {
  todos = todos.filter((t) => !t.completed);
  saveTodos();
  render();
}

function getVisibleTodos() {
  switch (currentFilter) {
    case "active":
      return todos.filter((t) => !t.completed);
    case "completed":
      return todos.filter((t) => t.completed);
    default:
      return todos;
  }
}

function render() {
  listEl.innerHTML = "";
  const visible = getVisibleTodos();

  visible.forEach((todo) => {
    const li = document.createElement("li");
    li.className = "todo-item" + (todo.completed ? " completed" : "");
    li.dataset.id = todo.id;

    const checkbox = document.createElement("button");
    checkbox.className = "todo-checkbox";
    checkbox.setAttribute("aria-label", "Toggle completion");
    const checkboxInner = document.createElement("span");
    checkboxInner.className = "todo-checkbox-inner";
    checkbox.appendChild(checkboxInner);

    checkbox.addEventListener("click", () => toggleTodo(todo.id));

    const content = document.createElement("div");
    content.className = "todo-content";

    const textSpan = document.createElement("span");
    textSpan.className = "todo-text";
    textSpan.textContent = todo.text;

    // Double click to edit
    textSpan.addEventListener("dblclick", () => {
      enterEditMode(todo, li, textSpan);
    });

    content.appendChild(textSpan);

    const actions = document.createElement("div");
    actions.className = "todo-actions";

    const editBtn = document.createElement("button");
    editBtn.className = "icon-button edit";
    editBtn.setAttribute("aria-label", "Edit");
    editBtn.innerHTML = '<span class="icon">✏️</span>';
    editBtn.addEventListener("click", () => {
      enterEditMode(todo, li, textSpan);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "icon-button delete";
    deleteBtn.setAttribute("aria-label", "Delete");
    deleteBtn.innerHTML = '<span class="icon">✕</span>';
    deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(checkbox);
    li.appendChild(content);
    li.appendChild(actions);

    listEl.appendChild(li);
  });

  // Update footer
  const remaining = todos.filter((t) => !t.completed).length;
  itemsLeftEl.textContent =
    remaining === 1 ? "1 item left" : `${remaining} items left`;

  // Update filter buttons
  Array.from(filtersEl.querySelectorAll(".chip")).forEach((btn) => {
    const filter = btn.dataset.filter;
    btn.classList.toggle("active", filter === currentFilter);
  });
}

function enterEditMode(todo, li, textSpan) {
  const currentText = todo.text;

  const input = document.createElement("input");
  input.className = "todo-edit-input";
  input.type = "text";
  input.value = currentText;

  const content = li.querySelector(".todo-content");
  content.replaceChild(input, textSpan);
  input.focus();
  input.select();

  const commit = () => {
    updateTodoText(todo.id, input.value);
  };

  input.addEventListener("blur", commit);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      input.blur();
    } else if (e.key === "Escape") {
      render();
    }
  });
}

// Event wiring
form.addEventListener("submit", (e) => {
  e.preventDefault();
  createTodo(input.value);
  input.value = "";
  input.focus();
});

filtersEl.addEventListener("click", (e) => {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;
  const btn = target.closest("button");
  if (!btn) return;
  const filter = btn.dataset.filter;
  if (!filter) return;
  setFilter(filter);
});

clearCompletedButton.addEventListener("click", () => {
  clearCompleted();
});

// Initial load
loadTodos();
render();