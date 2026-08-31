<h1 align="center">🚀 21-Day Full Stack & Backend Engineering Challenge</h1>
<h3 align="center">A hands-on journey from JavaScript fundamentals to production-grade, secure backend systems.</h3>

<p align="center">
  <img src="https://img.shields.io/github/stars/NalinaHM/full-stack-21-days?style=for-the-badge&logo=github&color=gold" alt="Stars"/>
  <img src="https://img.shields.io/github/forks/NalinaHM/full-stack-21-days?style=for-the-badge&logo=github&color=blue" alt="Forks"/>
  <img src="https://img.shields.io/github/last-commit/NalinaHM/full-stack-21-days?style=for-the-badge&logo=git&color=green" alt="Last Commit"/>
  <img src="https://img.shields.io/badge/License-MIT-brightgreen?style=for-the-badge" alt="License"/>
</p>

<p align="center">
  <a href="#-challenge-roadmap--module-files">Roadmap & Files</a> •
  <a href="#-key-concepts-covered">Concepts</a> •
  <a href="#-backend-architecture">Architecture</a> •
  <a href="#-security-features">Security</a> •
  <a href="#-getting-started">Getting Started</a>
</p>

---

## 📌 Overview

This repository documents my **21-Day Full Stack & Backend Engineering Challenge**. The primary objective of this challenge was to build real-world proficiency in core JavaScript execution, DOM manipulation, asynchronous programming, RESTful API development, database integration, and production security architectures.

---

## 🛠️ Tech Stack & Skills

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JSON Web Tokens](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

---

## 📅 Challenge Roadmap & Module Files

Each day includes working code implementations for that specific topic or mini-project:

| Day | Module / Project Title | Key Concepts | Implementation Files |
| :---: | :--- | :--- | :---: |
| **Day 01** | HTML Fundamentals | Semantic HTML5, Page Structure | [`day1.html`](./day1.html) |
| **Day 02** | CSS Styling & Layout | Flexbox, Responsive Design, CSS Selectors | [`day2.html`](./day2.html), [`day2.css`](./day2.css) |
| **Day 03** | Static Webpage Project | Web Layout, Typography, Responsive Styling | [`index.html`](./index.html), [`style.css`](./style.css) |
| **Day 04** | JavaScript Basics | Variables, Scope, Control Flow, Data Types | [`jsmain.js`](./jsmain.js) |
| **Day 05** | To-Do List Web App | DOM Manipulation, Event Listeners, Dynamic UI | [`todo-list-index.html`](./todo-list-index.html), [`todo-app-script.js`](./todo-app-script.js), [`todo-app-style.css`](./todo-app-style.css) |
| **Day 06** | Student Score Manager | LocalStorage, Array Methods, Data Persistence | [`studentGade.html`](./studentGade.html), [`student-score-manager.js`](./student-score-manager.js), [`student-score-manager.css`](./student-score-manager.css) |
| **Day 07** | Random User Generator | Fetch API, Async/Await, External API Integration | [`script.js`](./script.js) |
| **Day 08** | Student Analytics Dashboard | Functional Programming, `reduce()`, `every()`, Data Aggregation | [`student-dashboard.html`](./student-dashboard.html), [`student-dashboard.js`](./student-dashboard.js), [`student-dashboard.css`](./student-dashboard.css) |
| **Day 09** | Modular Dashboard Refactoring | ES6 Modules (`import`/`export`), Arrow Functions | [`Day-9.html`](./Day-9.html), [`analytic.js`](./analytic.js), [`constant.js`](./constant.js), [`day9.css`](./day9.css) |
| **Day 10** | Multi-Counter Application | Closures, Encapsulation, Private State | [`table.js`](./table.js) |
| **Day 11** | Interactive `this` Keyword Visualizer | Execution Context, `call()`, `apply()`, `bind()`, Implicit Binding | [`day-11.html`](./day-11.html) |
| **Day 12** | E-Commerce Product Catalog UI | Dynamic Grid Rendering, Product Filtering | [`day-12.html`](./day-12.html) |
| **Day 13** | JS Execution Context Visualizer | Call Stack, Variable Environment, Scope Chain | [`day13.html`](./day13.html) |
| **Day 14** | Fake E-Commerce Store | Mock API Data, Dynamic Product Card Generation | [`day-14.html`](./day-14.html) |
| **Day 15** | Event Loop & Store Loader | Promises, Microtasks, Macrotasks, `setTimeout()` | [`day-15.html`](./day-15.html) |
| **Days 16–17** | E-Commerce Store Mini Project | Full Frontend Cart Logic, State Synchronization | [`app.js`](./app.js) |
| **Day 18** | Patient Monitor System | State Management, Modular Storage | [`state.js`](./state.js), [`storage.js`](./storage.js) |
| **Day 19** | Secure AI Lab Management System | Access Control Logic, UI Roles | [`day19.html`](./day19.html) |
| **Days 20–21** | Healthcare Backend & Security System | Node/Express Backend, Authentication, API Hardening | [`day20-21.html`](./day20-21.html), [`server.js`](./server.js) |

---

## 🏗️ Backend Architecture

The backend built during Days 20–21 follows a clean **MVC + Service Layer Architecture**:

```
backend/
├── config/             # Database connection & env setup
├── controllers/        # Request handlers & HTTP response logic
├── services/           # Core business logic & database queries
├── models/             # Mongoose schemas & data validation
├── routes/             # Express API route endpoints
├── middleware/         # Auth verification, RBAC, Rate-limiting, Error handlers
├── utils/              # Helper utilities & custom loggers
└── server.js           # Express app entry point
```

---

## 🛡️ Security Implementation Details

The backend API incorporates production-level security practices:

- 🔑 **JWT Authentication**: Secure token generation with expiration strategies.
- 🛡️ **Role-Based Access Control (RBAC)**: Fine-grained permissions (Admin, Doctor, Patient).
- 🔒 **Password Security**: Strong password hashing using `bcrypt`.
- ⚡ **Rate Limiting**: Protection against brute-force attacks (`express-rate-limit`).
- 🪖 **HTTP Security Headers**: Protection against XSS, clickjacking, and MIME sniffing (`Helmet`).
- 🧹 **Input Sanitization**: Protection against NoSQL Injection.
- 🚨 **Centralized Error Handling**: Prevents leakage of stack traces in production environment.

---

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js installed on your system:
```bash
node -v
npm -v
```

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/NalinaHM/full-stack-21-days.git
   cd full-stack-21-days
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the backend server**:
   ```bash
   npm start
   ```

4. **Launch HTML Projects**:
   Open any of the `.html` files directly in your web browser or use VS Code **Live Server**.

---

## 📈 Learnings & Impact

- Deepened mastery of pure **vanilla JavaScript** execution before relying on frameworks.
- Learned how to write modular, scalable client-side and server-side code.
- Experienced full API design lifecycle from raw HTML/CSS up to secure backend services.

---

### 👨‍💻 Author

**Nalina H M**  
🎓 Final Year B.E. Student | 🤖 AI & ML Enthusiast | 💻 Aspiring Full Stack Developer  
🔗 **LinkedIn**: [Nalina H M](https://linkedin.com/in/nalina-h-m-37039837)  
💻 **GitHub**: [@NalinaHM](https://github.com/NalinaHM)
