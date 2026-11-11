# 📚 Library & Book Issue Management System

An enterprise-grade, full-stack Library Management System built with the **MERN Stack** (MongoDB, Express.js, React, Node.js), featuring real-time inventory synchronization, automated late-return fine calculations, server-side pagination, and JWT authentication.

---

## 🚀 Key Modules & Features

### 🔐 Authentication & Security
- **JWT (JSON Web Tokens)** stateless session authentication.
- Password hashing using **bcrypt**.
- Password visibility toggle (Show/Hide).

### 📖 Module 1: Book Management
- Full **CRUD** operations for library books.
- Fields: Title, Author, ISBN (unique), Category, and Quantity.
- Real-time search across Title, Author, and ISBN using MongoDB regex.
- Multi-criteria filtering by Category and Stock Availability.
- Server-side dynamic pagination (`skip` & `limit`).
- Relational integrity: Prevents deletion of books currently on loan.

### 🔄 Module 2: Book Issue & Return Management
- Issue books to registered library members.
- Automated stock decrement upon issuance.
- Automated stock increment upon check-in.
- Out-of-stock prevention (disables books with 0 copies).
- Live overdue tracking with dynamic late fine calculation (₹10/day overdue).
- Active issues flagged with real-time visual alerts.

### 👥 Member Management
- Directory of library borrowers with unique Membership IDs.
- Relational mapping between members and borrowing transactions.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS v4, Lucide React, Axios
- **Backend**: Node.js, Express.js, MVC Architecture, RESTful APIs
- **Database**: MongoDB Atlas with Mongoose ODM
- **Authentication**: JWT, bcryptjs

---

## ⚙️ Local Setup Instructions

### 1. Clone Repository
```bash
git clone https://github.com/channabasava302812/library-management-system
cd library-management-system

Backend Setup
cd backend
npm install
# Create .env with:
# PORT=5000
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
# FINE_PER_DAY=10

# Run Seeder for demo data
node src/config/seed.js

# Start backend server
npm run dev

Frontend Setup
cd ../frontend
npm install
npm run dev

