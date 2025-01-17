# Web Chat App

**A complete real-time messaging application developed with Angular, Spring Boot, and Firebase, deployed in a modern cloud environment.**

---

## 🎯 Project Objective

Build a web-based messaging application featuring an interactive frontend, a robust backend, and advanced functionalities such as:

- User authentication and management with security (JWT, Firestore).
- Real-time messaging with WebSocket.
- File and image handling via Cloud Storage.
- Cloud deployment with performance monitoring.

---

## 🛠️Technologies Used

### **Frontend**
- **Framework** : Angular
- **Outils supplémentaires** : Angular Material for UI design and WebSocket for real-time communication.

### **Backend**
- **Framework** : Spring Boot
- **Base de données** : Firebase Firestore
- **Authentification** : JSON Web Tokens (JWT)

### **Cloud and Deployment**
- **Cloud Services** : Firebase (Firestore, Cloud Storage, Hosting)
- **CI/CD and Containerization*** : Docker and Google Cloud Run

---

## 🚀 Key Features

### **1. User Authentication**
- User validation with Firestore.
- Secure password encoding with BCrypt.
- Session management using JWT.

### **2. Real-Time Messaging**
- Message display through an interactive user interface.
- File and image uploads via Cloud Storage.
- Real-time notifications using WebSocket.

### **3. Error Handling and Testing**
- Error management on both frontend and backend.
- Automated unit and integration tests for stability.

### **4. Deployment and Monitoring**
- Frontend hosted on Firebase Hosting.
- Backend containerized with Docker and deployed on Google Cloud Run.
- Monitoring dashboard with key metrics (response time, error rates, system load).
- Alert system for anomalies.

---
## 💻 Installation and Setup

### **Prerequisites**
- Node.js and Angular CLI (for the frontend).
- JDK 21 and Gradle (for the backend).
- Google Cloud account with Firebase.

### **Instructions**
1. **Clone the repository:**
```bash
git clone https://github.com/ahmadibrahim00/Web-Chat-App.git
cd Web-Chat-App
cd frontend
npm install
ng serve
```
2. **Set up the frontend :**
```bash
cd frontend
npm install
ng serve
```

3. **Set up the backend :**
```bash
cd backend
./gradlew bootRun
```
4. **Access the application : **
- Frontend : http://localhost:4200
- Backend : http://localhost:8080

---

## 🌐 Deployment
- **Frontend** hosted on Firebase.
- **Backend** containerized with Docker and deployed on Google Cloud Run.
