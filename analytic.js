import { PASS_MARK } from "./constants.js";

/**
 * @param {Object} elements
 * @param {HTMLElement} elements.count
 * @param {HTMLElement} elements.average
 * @param {HTMLElement} elements.topper
 * @param {HTMLElement} elements.topperMarks
 * @param {HTMLElement} elements.passStatus
 * @param {HTMLElement} elements.passNote
 * @param {{id:string,name:string,marks:number}[]} students
 * @param {number|null} avg
 * @param {{name:string,marks:number}|null} top
 * @param {boolean|null} allPass
 */
export function renderAnalytics(elements, students, avg, top, allPass) {
  const { count, average, topper, topperMarks, passStatus, passNote } = elements;

  count.textContent = String(students.length);
  average.textContent =
    avg === null ? "–" : avg.toFixed(2).replace(/\.00$/, "");

  if (!top) {
    topper.textContent = "–";
    topperMarks.textContent = "";
  } else {
    topper.textContent = top.name;
    topperMarks.textContent = `${top.marks} marks`;
  }

  if (allPass === null) {
    passStatus.textContent = "–";
    passNote.textContent = "";
  } else if (allPass) {
    passStatus.textContent = "Yes";
    passNote.textContent = `Every student has at least ${PASS_MARK} marks.`;
  } else {
    passStatus.textContent = "No";
    const passedCount = students.filter((s) => s.marks >= PASS_MARK).length;
    passNote.textContent = `${passedCount}/${students.length} students passed.`;
  }
}