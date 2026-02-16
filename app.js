// Factory function: creates a counter with private state
function createCounter(initial = 0) {
  let value = initial; // private variable, not accessible from outside

  return {
    getValue() {
      return value;
    },
    increment() {
      value += 1;
    },
    decrement() {
      value -= 1;
    },
    reset() {
      value = initial;
    }
  };
}

// UI wiring for multi-counter app
const countersContainer = document.getElementById("counters");
const addCounterBtn = document.getElementById("add-counter");

let counterCount = 0;

function addCounter() {
  counterCount += 1;

  // Each call gets its own closure + private value
  const counter = createCounter(0);

  const wrapper = document.createElement("div");
  wrapper.className = "counter";

  const header = document.createElement("div");
  header.className = "counter-header";
  header.textContent = `Counter #${counterCount}`;

  const valueEl = document.createElement("div");
  valueEl.className = "counter-value";

  const buttons = document.createElement("div");
  buttons.className = "counter-buttons";

  const incBtn = document.createElement("button");
  incBtn.className = "inc";
  incBtn.textContent = "+";

  const decBtn = document.createElement("button");
  decBtn.className = "dec";
  decBtn.textContent = "–";

  const resetBtn = document.createElement("button");
  resetBtn.className = "reset";
  resetBtn.textContent = "Reset";

  buttons.appendChild(decBtn);
  buttons.appendChild(resetBtn);
  buttons.appendChild(incBtn);

  wrapper.appendChild(header);
  wrapper.appendChild(valueEl);
  wrapper.appendChild(buttons);
  countersContainer.appendChild(wrapper);

  // Renders the current value from the closure
  function render() {
    valueEl.textContent = counter.getValue();
  }

  // Wire up events to closure methods
  incBtn.addEventListener("click", () => {
    counter.increment();
    render();
  });

  decBtn.addEventListener("click", () => {
    counter.decrement();
    render();
  });

  resetBtn.addEventListener("click", () => {
    counter.reset();
    render();
  });

  // Initial render
  render();
}

// Add a first counter by default
addCounter();

addCounterBtn.addEventListener("click", addCounter);