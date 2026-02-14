import { PASS_MARK } from "./constants.js";

/**
 * @param {HTMLTableSectionElement} tbody
 * @param {HTMLElement} emptyState
 * @param {{id:string,name:string,marks:number}[]} students
 * @param {(id:string)=>void} onDelete
 */
export function renderTable(tbody, emptyState, students, onDelete) {
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
    statusSpan.className = `badge ${passed ? "pass" : "fail"}`;
    statusSpan.textContent = passed ? "Pass" : "Fail";
    statusTd.appendChild(statusSpan);

    const actionsTd = document.createElement("td");
    actionsTd.className = "row-actions";
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "icon-button";
    deleteBtn.type = "button";
    deleteBtn.title = "Remove student";
    deleteBtn.textContent = "✕";
    deleteBtn.addEventListener("click", () => onDelete(student.id));
    actionsTd.appendChild(deleteBtn);

    tr.append(idxTd, nameTd, marksTd, statusTd, actionsTd);
    tbody.appendChild(tr);
  });
}