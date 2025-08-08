# 🗂 SmartBoard – Full Stack Next.js App

A modern **full-stack task management application** built with **Next.js**, allowing users to **register/login**, create multiple task boards, and manage their to-dos — all with clean UI and secure backend logic.

<img width="1896" height="904" alt="image" src="https://github.com/user-attachments/assets/1925727f-0da1-4dc9-9c11-570d76acd4ad" />

---

## 🚀 Features

### 🔐 Authentication & Authorization
- Secure **JWT-based authentication** (stored in HTTP-only cookies/localStorage)
- User registration & login
- Only authenticated users can access their own boards and tasks
- Full **authorization checks** to prevent cross-user data access

### 📝 Task Management
- Create multiple **Task Boards** (e.g., `Work`, `Groceries`, `Learning`)
- Each board can contain multiple tasks with:
  - Title
  - Optional description
  - Status toggle (**Pending / Completed**)
  - Due date & created date
- Add / Update / Delete tasks
- Rename / Delete boards
- Authorization ensures **user-specific task isolation**

### 💻 Backend API
- Built entirely with **Next.js API routes**
- RESTful endpoints:
  - `POST /api/auth/register` – register user
  - `POST /api/auth/login` – authenticate user & return JWT
  - `GET/POST/PUT/DELETE /api/boards` – CRUD for boards
  - `GET/POST/PUT/DELETE /api/tasks` – CRUD for tasks

### 📦 Data Storage
- Data is stored in a **JSON file** (in-memory during runtime)

### 🛠 Tech Stack
Next.js – Full-stack React framework
React Context API – State management
Tailwind CSS – Styling
Lucide Icons – Icons
JWT – Authentication


---

## ⚙️ Installation & Setup

```bash
# 1️⃣ Clone the repository
git clone https://github.com/sohamsk13/SmartBoard.git

# 2️⃣ Install dependencies
cd SmartBoard
npm install

# 3️⃣ Run in development mode
npm run dev

# 4️⃣ Open in browser
http://localhost:3000

