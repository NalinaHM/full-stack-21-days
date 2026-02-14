import * as state from "./state.js";
import { renderTable } from "./table.js";
import { renderAnalytics } from "./analytics.js";

const form = document.getElementById("student-form");
const nameInput = document.getElementById("student-name");
const marksInput = document.getElementById("student-marks");
const tbody = document.getElementById("students-body");
const emptyState = document.getElementById("empty-state");
const sortButton = document.getElementById("sort-marks");
const clearButton = document.getElementById("clear-all");

const metricElements = {
  count: document.getElementById("metric-count"),
  average: document.getElementById("metric-average"),
  topper: document.getElementById("metric-topper"),
  topperMarks: document.getElementById("metric-topper-marks"),
  passStatus: document.getElementById("metric-pass-status"),
  passNote: document.getElementById("metric-pass-note"),
};

function render() {
  state.sortByMarks(state.getSortDesc());
  const students = state.getStudents();
  renderTable(tbody, emptyState, students, state.deleteStudent);
  renderAnalytics(
    metricElements,
    students,
    state.computeAverage(),
    state.getTopper(),
    state.allPassed()
  );
  sortButton.textContent = state.getSortDesc()
    ? "Sort by Marks ↓"
    : "Sort by Marks ↑";
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  state.addStudent(nameInput.value, marksInput.value);
  form.reset();
  nameInput.focus();
  render();
});

sortButton.addEventListener("click", () => {
  state.setSortDesc(!state.getSortDesc());
  render();
});

clearButton.addEventListener("click", () => {
  if (!state.getStudents().length) return;
  const confirmClear = window.confirm(
    "This will remove all students from the dashboard. Continue?"
  );
  if (!confirmClear) return;
  state.clearAll();
  render();
});

state.load();
render();