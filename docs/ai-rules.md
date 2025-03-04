# AI Rules & Guidelines for 8thDegree

## 🛠️ General AI Behavior
- Cursor **is allowed** to:
  - Write, modify, and refactor code **inside the "8thDegree" project folder**.
  - Create new files and folders as needed **within the project**.
  - Add and edit function definitions, classes, and modules.
  - Optimize and restructure existing code **for better performance & maintainability**.

- Cursor **must NOT**:
  - Modify files **outside the "8thDegree" directory**.
  - Delete or rename files/folders without **explicit confirmation**.
  - Execute shell/system commands outside the allowed list.
  - Install external dependencies **without approval**.

---

## 🔐 Security & Restrictions
- Cursor **must NOT** modify:
  - **Authentication and security logic** (e.g., login, JWT, OAuth, encryption).
  - **Database schema migrations** without explicit confirmation.
  - **Environment variables or secrets** stored in `.env` files.

- AI should never **send external requests** without approval.
- Any AI-generated function must include **docstrings** for clarity.

---

## 📂 Project Structure & Best Practices
- Code must follow **8thDegree's style guide** (`docs/style-guide.md`).
- AI should use **consistent naming conventions** for variables, functions, and classes.
- AI-generated code should prioritize:
  - **Readability**
  - **Performance**
  - **Scalability**
  - **Maintainability**
- Functions should be **modular and reusable** where possible.

---

## ✅ Allowed Actions & Safe Commands
- Cursor **can** run safe project-level commands:
  ```sh
  npm install <package> --save  # For Node.js dependencies
  pip install <package>         # For Python dependencies
