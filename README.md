# Feedback Portal

A modern internal feedback portal for managers and employees, built with React, Flask, and MongoDB. Features LinkedIn-style UI with professional design and seamless user experience.

## 🚀 Project Overview

Feedback Portal enables structured, ongoing feedback between managers and employees. It features authentication, team management, feedback submission/history/editing, dashboards, and a modern, responsive LinkedIn-inspired UI.

---

## 🛠️ Stack & Design Decisions

### **Frontend**
- **React 18** with Vite for fast development
- **Material-UI (MUI)** for consistent, professional components
- **LinkedIn-inspired Design** with signature blue color scheme
- **Responsive Design** that works on all devices
- **Modern UI Patterns** with cards, chips, and smooth interactions

### **Backend**
- **Python Flask** for robust API development
- **Clean Architecture** with controllers, models, and schemas
- **JWT Authentication** for secure user sessions
- **Role-based Access Control** (Manager/Employee)
- **Password Hashing** for security

### **Database**
- **MongoDB** for flexible document storage
- **Optimized Queries** for fast data retrieval
- **Scalable Schema** for future enhancements

### **Deployment**
- **Docker** for consistent backend deployment
- **Containerization** for easy scaling and deployment

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js 16+ and npm
- Python 3.11+
- Docker (optional, for backend)
- MongoDB instance

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd Feedback-Portal
```

### 2. Backend Setup

#### Option A: Local Development
```bash
cd backend
pip install -r requirements.txt
flask run
```

#### Option B: Docker (Recommended)
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

### 4. Access the Application
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

---

## 📺 Demo Video
[Insert your demo video link here]

## 🧑‍💻 Code Walkthrough Video
[Insert your code walkthrough video link here]

---

## 🎨 Features

### **Authentication & User Management**
- User registration with role selection (Manager/Employee)
- Secure login with JWT tokens
- Role-based access control
- Auto-login after registration

### **Manager Features**
- Team management and overview
- Feedback submission for team members
- Feedback editing and history
- Team sentiment analytics
- Professional dashboard with insights

### **Employee Features**
- View received feedback
- Acknowledge feedback
- Feedback timeline and history
- Professional dashboard

### **Feedback System**
- Structured feedback with strengths and improvements
- Sentiment analysis (Positive/Neutral/Negative)
- Tag system for categorization
- Timestamp tracking
- Acknowledgment system

### **UI/UX Features**
- LinkedIn-inspired design language
- Responsive layout for all devices
- Modern card-based interface
- Smooth animations and transitions
- Professional color scheme
- Intuitive navigation

---

## 🏗️ Project Structure

```
Feedback Portal/
├── backend/
│   ├── app.py                 # Main Flask application
│   ├── controllers/           # API route handlers
│   ├── models/               # Database models
│   ├── schemas/              # Data validation schemas
│   ├── requirements.txt      # Python dependencies
│   └── Dockerfile           # Docker configuration
├── frontend/
│   ├── src/
│   │   ├── pages/           # React page components
│   │   ├── api/             # API integration
│   │   ├── App.jsx          # Main app component
│   │   └── Layout.jsx       # Layout wrapper
│   ├── package.json         # Node.js dependencies
│   └── vite.config.js       # Vite configuration
└── README.md               # This file
```

---

## 🔧 API Endpoints

### Authentication
- `POST /register` - User registration
- `POST /login` - User login
- `GET /users/me` - Get current user info

### Team Management
- `GET /team` - Get team members (managers only)

### Feedback
- `POST /feedback` - Submit feedback
- `GET /feedback/<user_id>` - Get feedback history
- `PUT /feedback/<id>` - Edit feedback (managers only)
- `POST /feedback/<id>/acknowledge` - Acknowledge feedback

---

## 🎯 Key Design Decisions

### **LinkedIn-Style UI**
- Professional color scheme (#0a66c2 primary blue)
- Clean, modern typography
- Card-based layout for content
- Consistent spacing and alignment
- Hover effects and smooth transitions

### **User Experience**
- Intuitive navigation
- Clear visual hierarchy
- Responsive design for all screen sizes
- Loading states and error handling
- Professional form design

### **Technical Architecture**
- Separation of concerns (frontend/backend)
- RESTful API design
- Secure authentication
- Scalable database schema
- Containerized deployment

---

## 🚀 Deployment

### Backend Deployment
```bash
# Build Docker image
docker build -t feedback-backend .

# Run container
docker run -p 5000:5000 feedback-backend
```

### Frontend Deployment
```bash
# Build for production
npm run build

# Deploy to your preferred hosting service
# (Vercel, Netlify, AWS, etc.)
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

For support, email support@feedbackportal.com or create an issue in the repository.

---

**Built with ❤️ using React, Flask, and MongoDB** 


USED AI TO BUILD THIS APPLICATION