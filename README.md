## Splitwise Clone

## 📌 About

Splito is a full-stack expense-splitting application inspired by Splitwise. It allows users to create groups, add shared expenses, and track who owes whom—perfect for roommates, travel groups, or friends splitting bills.

This project is built to demonstrate full-stack development skills and meets the assignment requirements for the **Neurix Full-Stack SDE Intern role**.

[https://split-m4p7ya1kb-prajeetas-projects.vercel.app/]

---

## 🧰 Tech Stack

### Backend

- **Python**, **FastAPI**
- **PostgreSQL** (via SQLAlchemy ORM)
- **Alembic** (for migrations)

### Frontend

- **React.js**
- **TailwindCSS**
- **Axios** (for API requests)

### DevOps

- **Docker** & **docker-compose** for full-stack orchestration
- **Pipenv** for Python environment management

---

## ✅ Features

### 🧑‍🤝‍🧑 Group Management

- `POST /groups` – Create new group with name + users
- `GET /groups/{group_id}` – Get group details

### 💸 Expense Management

- `POST /groups/{group_id}/expenses` – Add an expense
- Supports:
  - Equal splitting
  - Percentage splitting

### 📊 Balance Tracking

- `GET /groups/{group_id}/balances` – See group balances
- `GET /users/{user_id}/balances` – See user balances across groups

### (Optional) 🤖 LLM Chatbot

- Natural language queries like:
  - “How much does Alice owe in Goa Trip?”
  - “Who paid the most in Weekend Trip?”

---

## 🚀 Run the Project Locally

### 1. Clone the repo

```bash
git clone https://github.com/prajeeta15/SplitO.git
cd SmartSplit
2. Backend Setup
bash
Copy
Edit
cd backend
pipenv install
cp .env.example .env  # update DB, SCHEMA, and Flask settings
pipenv shell
alembic upgrade head
uvicorn main:app --reload
Ensure your .env file points to a valid PostgreSQL URL, e.g.
DATABASE_URL=postgresql://username:password@localhost:5432/smartsplit

3. Frontend Setup
bash
Copy
Edit
cd ../frontend
npm install
npm run dev
🐳 Docker Setup (Recommended)
Run the full app (API + PostgreSQL + UI) with:

bash
Copy
Edit
docker-compose up --build
Make sure .env is correctly configured and .env.production is used for Dockerized builds.

📁 Folder Structure
bash
Copy
Edit
SmartSplit/
├── backend/             # FastAPI backend
│   ├── alembic/         # Alembic migrations
│   ├── app/             # FastAPI routes, models
│   └── main.py
├── frontend/            # React + Tailwind app
│   └── src/
├── docker-compose.yml
└── README.md
```
