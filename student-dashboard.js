(() => {
  const STORAGE_KEY = "studentDashboard:students";
  const PASS_MARK = 40;

  /** @type {{id:string,name:string,marks:number}[]} */
  let students = [];
  let sortDesc = true;

  // Elements
  const form = document.getElementById("student-form");
  const nameInput = document.getElementById("student-name");
  const marksInput = document.getElementById("student-marks");
  const tbody = document.getElementById("students-body");
  const emptyState = document.getElementById("empty-state");
  const sortButton = document.getElementById("sort-marks");
  const clearButton = document.getElementById("clear-all");

  const metricCount = document.getElementById("metric-count");
  const metricAverage = document.getElementById("metric-average");
  const metricTopper = document.getElementById("metric-topper");
  const metricTopperMarks = document.getElementById("metric-topper-marks");
  const metricPassStatus = document.getElementById("metric-pass-status");
  const metricPassNote = document.getElementById("metric-pass-note");

  function loadFromStorage() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        students = parsed
          .filter(
            (s) =>
              s &&
              typeof s.name === "string" &&
              typeof s.marks === "number" &&
              !Number.isNaN(s.marks)
          )
          .map((s) => ({
            id: s.id || crypto.randomUUID?.() || String(Date.now() + Math.random()),
            name: s.name.trim(),
            marks: s.marks,
          }));
      }
    } catch (err) {
      console.error("Failed to load students from localStorage", err);
      students = [];
    }
  }

  function saveToStorage() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    } catch (err) {
      console.error("Failed to save students to localStorage", err);
    }
  }

  function addStudent(name, marks) {
    const trimmed = name.trim();
    if (!trimmed) return;

    const value = Number(marks);
    if (!Number.isFinite(value)) return;

    const clamped = Math.min(100, Math.max(0, value));

    students.push({
      id: crypto.randomUUID?.() || String(Date.now() + Math.random()),
      name: trimmed,
      marks: clamped,
    });
    saveToStorage();
    render();
  }

  function deleteStudent(id) {
    students = students.filter((s) => s.id !== id);
    saveToStorage();
    render();
  }

  function sortByMarks(desc = true) {
    students.sort((a, b) => (desc ? b.marks - a.marks : a.marks - b.marks));
  }

  function computeAverage() {
    if (!students.length) return null;
    const total = students.reduce((sum, s) => sum + s.marks, 0);
    return total / students.length;
  }

  function getTopper() {
    if (!students.length) return null;
    return students.reduce((top, s) => (s.marks > top.marks ? s : top), students[0]);
  }

  function allPassed() {
    if (!students.length) return null;
    return students.every((s) => s.marks >= PASS_MARK);
  }

  function renderTable() {
    tbody.innerHTML = "";

    if (!students.length) {
      emptyState.style.display = "block";
      return;
    }

    emptyState.style.display = "none";

    students.forEach((student, index) => {
      const tr = document.createElement("tr");

      const idxTd = document.createElement("td");
      idxTd.textContent = String(index + 1);

      const nameTd = document.createElement("td");
      nameTd.textContent = student.name;

      const marksTd = document.createElement("td");
      marksTd.textContent = String(student.marks);

      const statusTd = document.createElement("td");
      const statusSpan = document.createElement("span");
      const passed = student.marks >= PASS_MARK;
      statusSpan.className = "badge " + (passed ? "pass" : "fail");
      statusSpan.textContent = passed ? "Pass" : "Fail";
      statusTd.appendChild(statusSpan);

      const actionsTd = document.createElement("td");
      actionsTd.className = "row-actions";
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "icon-button";
      deleteBtn.type = "button";
      deleteBtn.title = "Remove student";
      deleteBtn.textContent = "✕";
      deleteBtn.addEventListener("click", () => deleteStudent(student.id));
      actionsTd.appendChild(deleteBtn);

      tr.appendChild(idxTd);
      tr.appendChild(nameTd);
      tr.appendChild(marksTd);
      tr.appendChild(statusTd);
      tr.appendChild(actionsTd);

      tbody.appendChild(tr);
    });
  }

  function renderAnalytics() {
    const count = students.length;
    metricCount.textContent = String(count);

    const avg = computeAverage();
    metricAverage.textContent =
      avg === null ? "–" : avg.toFixed(2).replace(/\.00$/, "");

    const top = getTopper();
    if (!top) {
      metricTopper.textContent = "–";
      metricTopperMarks.textContent = "";
    } else {
      metricTopper.textContent = top.name;
      metricTopperMarks.textContent = `${top.marks} marks`;
    }

    const allPass = allPassed();
    if (allPass === null) {
      metricPassStatus.textContent = "–";
      metricPassNote.textContent = "";
    } else if (allPass) {
      metricPassStatus.textContent = "Yes";
      metricPassNote.textContent = "Every student has at least " + PASS_MARK + " marks.";
    } else {
      metricPassStatus.textContent = "No";
      const passedCount = students.filter((s) => s.marks >= PASS_MARK).length;
      metricPassNote.textContent = `${passedCount}/${students.length} students passed.`;
    }
  }

  function render() {
    sortByMarks(sortDesc);
    renderTable();
    renderAnalytics();
    sortButton.textContent = sortDesc ? "Sort by Marks ↓" : "Sort by Marks ↑";
  }

  // Event listeners
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    addStudent(nameInput.value, marksInput.value);
    form.reset();
    nameInput.focus();
  });

  sortButton.addEventListener("click", () => {
    sortDesc = !sortDesc;
    render();
  });

  clearButton.addEventListener("click", () => {
    if (!students.length) return;
    const confirmClear = window.confirm(
      "This will remove all students from the dashboard. Continue?"
    );
    if (!confirmClear) return;
    students = [];
    saveToStorage();
    render();
  });

  // Init
  loadFromStorage();
  render();
})();