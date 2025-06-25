# Feedback Portal

A modern internal feedback portal for managers and employees, built with React, Flask, and MongoDB.

## 🚀 Project Overview

Feedback Portal enables structured, ongoing feedback between managers and employees. It features authentication, team management, feedback submission/history/editing, dashboards, and a modern, responsive UI.

---

## 🛠️ Stack & Design Decisions

- **Frontend:** React (Vite, MUI)
  - Fast, modern UI with Material-UI and custom design
  - Responsive, glassmorphism, and Zomato-inspired style
- **Backend:** Python Flask
  - Clean architecture: controllers, models, schemas
  - JWT authentication, role-based access, password hashing
- **Database:** MongoDB
  - Flexible schema for users, teams, and feedback
- **Containerization:** Docker (for backend)
  - Easy deployment and reproducibility

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd Feedback-Portal
```

### 2. Backend Setup
#### Local (requires Python 3.11+)
```bash
cd backend
pip install -r requirements.txt
# Start the Flask server
flask run
```

#### With Docker
```bash
cd backend
docker build -t feedback-backend .
docker run -p 5000:5000 feedback-backend
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

---

## 📺 Demo Video
[Insert your demo video link here]

## 🧑‍💻 Code Walkthrough Video
[Insert your code walkthrough video link here]

---

## 📦 Features
- User registration & login (manager/employee)
- JWT authentication, role-based access
- Team management (manager)
- Feedback submission, history, editing, acknowledgment
- Manager dashboard with team & sentiment summary
- Employee dashboard with feedback timeline
- Modern, responsive UI
- Dockerfile for backend deployment

---

## 🤝 Contributing
Pull requests welcome! For major changes, please open an issue first.

---

## 📄 License
[MIT](LICENSE) (or your preferred license) 