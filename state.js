import { PASS_MARK } from "./constants.js";
import { loadFromStorage, saveToStorage } from "./storage.js";

/** @type {{id:string,name:string,marks:number}[]} */
let students = [];
/** @type {boolean} */
let sortDesc = true;

export function getStudents() {
  return students;
}

export function getSortDesc() {
  return sortDesc;
}

export function setSortDesc(value) {
  sortDesc = value;
}

export function load() {
  students = loadFromStorage(students);
}

export function addStudent(name, marks) {
  const trimmed = name.trim();
  if (!trimmed) return;

  const value = Number(marks);
  if (!Number.isFinite(value)) return;

  const clamped = Math.min(100, Math.max(0, value));

  students = [
    ...students,
    {
      id: crypto.randomUUID?.() || String(Date.now() + Math.random()),
      name: trimmed,
      marks: clamped,
    },
  ];
  saveToStorage(students);
}

export function deleteStudent(id) {
  students = students.filter((s) => s.id !== id);
  saveToStorage(students);
}

/**
 * @param {boolean} [desc=true]
 */
export function sortByMarks(desc = true) {
  students = [...students].sort((a, b) =>
    desc ? b.marks - a.marks : a.marks - b.marks
  );
}

export function computeAverage() {
  if (!students.length) return null;
  const total = students.reduce((sum, s) => sum + s.marks, 0);
  return total / students.length;
}

export function getTopper() {
  if (!students.length) return null;
  return students.reduce(
    (top, s) => (s.marks > top.marks ? s : top),
    students[0]
  );
}

export function allPassed() {
  if (!students.length) return null;
  return students.every((s) => s.marks >= PASS_MARK);
}

export function clearAll() {
  students = [];
  saveToStorage(students);
}

export { PASS_MARK };