import { STORAGE_KEY } from "./constants.js";

/**
 * @param {{id:string,name:string,marks:number}[]} students
 * @returns {{id:string,name:string,marks:number}[]}
 */
export function loadFromStorage(students) {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return students;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return students;
    return parsed
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
  } catch (err) {
    console.error("Failed to load students from localStorage", err);
    return [];
  }
}

/**
 * @param {{id:string,name:string,marks:number}[]} students
 */
export function saveToStorage(students) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  } catch (err) {
    console.error("Failed to save students to localStorage", err);
  }
}