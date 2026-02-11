// Array of student objects: { name, score }
let students = [];

// DOM references
const form = document.getElementById('student-form');
const nameInput = document.getElementById('name');
const scoreInput = document.getElementById('score');
const tbody = document.getElementById('student-table-body');

const btnShowAll = document.getElementById('show-all');
const btnShowPass = document.getElementById('show-pass');
const btnShowFail = document.getElementById('show-fail');

const countSpan = document.getElementById('count');
const avgSpan = document.getElementById('average');
const highestSpan = document.getElementById('highest');

// Add or update student (uses objects, arrays, arrow functions)
form.addEventListener('submit', e => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const score = Number(scoreInput.value);

  if (!name || Number.isNaN(score)) return;

  // Check if student already exists (by name)
  const existingIndex = students.findIndex(s => s.name.toLowerCase() === name.toLowerCase());

  if (existingIndex >= 0) {
    // Update existing
    students[existingIndex].score = score;
  } else {
    // Add new
    students.push({ name, score });
  }

  nameInput.value = '';
  scoreInput.value = '';
  renderTable(students);
});

// Render table using forEach and arrow functions
const renderTable = list => {
  tbody.innerHTML = '';

  list.forEach((student, index) => {
    const tr = document.createElement('tr');

    const statusText = student.score >= 40 ? 'Pass' : 'Fail';
    const statusClass = student.score >= 40 ? 'status-pass' : 'status-fail';

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${student.name}</td>
      <td>${student.score}</td>
      <td class="${statusClass}">${statusText}</td>
    `;

    tbody.appendChild(tr);
  });

  updateSummary();
};

// Use filter with arrow functions for views
btnShowAll.addEventListener('click', () => renderTable(students));
btnShowPass.addEventListener('click', () => {
  const passing = students.filter(s => s.score >= 40);
  renderTable(passing);
});
btnShowFail.addEventListener('click', () => {
  const failing = students.filter(s => s.score < 40);
  renderTable(failing);
});

// Summary stats using forEach / arrow functions
const updateSummary = () => {
  const total = students.length;
  countSpan.textContent = `Total: ${total}`;

  if (total === 0) {
    avgSpan.textContent = 'Average: N/A';
    highestSpan.textContent = 'Highest: N/A';
    return;
  }

  let sum = 0;
  let max = students[0].score;

  students.forEach(s => {
    sum += s.score;
    if (s.score > max) max = s.score;
  });

  const avg = (sum / total).toFixed(2);
  avgSpan.textContent = `Average: ${avg}`;
  highestSpan.textContent = `Highest: ${max}`;
};

// Initial render
renderTable(students);