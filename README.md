🍕 DEvZA Pizza Delivery

A full-stack pizza ordering and admin management web application built with the MERN stack.
This system allows users to customize pizzas, place orders, and complete payments while providing an admin dashboard for order and inventory management.

🚀 Features
👤 User Features

User registration and login

Email verification system

Forgot password and reset password functionality

Custom pizza builder with ingredient selection

Secure checkout process

Order tracking system

👨‍💼 Admin Features

Admin login with role-based access

Order management system

Update order status

Inventory management system

Automatic stock updates after orders

Low-stock email alerts

💳 Payment Integration

This project integrates Razorpay Payment Gateway (Test Mode) to simulate secure online payments during checkout.

🛠 Tech Stack
Frontend

React.js

Vite

React Router

Axios

HTML & CSS

Backend

Node.js

Express.js

MongoDB

Mongoose

Authentication

JSON Web Token (JWT)

Email verification system

Password reset flow

Integrations

Razorpay Payment Gateway

Nodemailer Email Service

📂 Project Structure
DEvZA-Pizza-Delivery
│
├── backend
│   ├── config
│   │   └── db.js
│   ├── controllers
│   │   ├── authController.js
│   │   ├── orderController.js
│   │   ├── inventoryController.js
│   │   └── paymentController.js
│   ├── middleware
│   │   └── authMiddleware.js
│   ├── models
│   │   ├── User.js
│   │   ├── Order.js
│   │   └── Inventory.js
│   ├── routes
│   │   ├── authRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── inventoryRoutes.js
│   │   └── paymentRoutes.js
│   └── server.js
│
├── frontend
│   ├── src
│   │   ├── pages
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CustomPizza.jsx
│   │   │   ├── Checkout.jsx
│   │   │   └── Orders.jsx
│   │   ├── components
│   │   │   ├── Navbar.jsx
│   │   │   ├── PizzaCard.jsx
│   │   │   └── Loader.jsx
│   │   ├── admin
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminOrders.jsx
│   │   │   └── Inventory.jsx
│   │   └── services
│   │       └── api.js
│   └── App.jsx
│
└── README.md

⚙️ Prerequisites

Before running the project, make sure you have:

Node.js (v18 or higher)

MongoDB installed locally or MongoDB Atlas

Gmail App Password (for email service)

🔑 Environment Variables

Create a .env file inside the backend folder.

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/pizzaDB
JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
ADMIN_EMAIL=admin_email@gmail.com

FRONTEND_URL=http://localhost:5173

RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

📦 Installation

Clone the repository

git clone https://github.com/yourusername/devza-pizza-delivery.git


Navigate into the project

cd devza-pizza-delivery


Install dependencies

npm run install:all

▶️ Run the Project

Run frontend and backend together

npm run dev


Or run separately

npm run dev:backend
npm run dev:frontend

🌐 Default Local URLs

Frontend

http://localhost:5173


Backend API

http://localhost:5000/api

🔐 Authentication Endpoints
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/verify/:token
POST /api/auth/forgot-password
POST /api/auth/reset-password/:token

🔁 Forgot Password Flow

User clicks Forgot Password on login page

Frontend calls /api/auth/forgot-password

Backend sends reset email

User opens reset link

Frontend calls /api/auth/reset-password/:token

Password gets updated

📊 Inventory Low Stock Alert

When an ingredient quantity falls below the threshold:

The backend automatically sends a warning email to admin

Admin can restock inventory from the dashboard

📸 Screenshots

(Add screenshots of your project here)

Example:

Login Page

Pizza Builder

Checkout Page

Admin Dashboard

Inventory Management

📚 Learning Outcomes

Through this project I gained hands-on experience in:

Full Stack Web Development

REST API development

Authentication & Authorization

Payment Gateway Integration

MongoDB Database Design

Inventory Management Systems

🤝 Acknowledgement

This project was developed as part of the Full Stack Web Development Internship at Oasis Infobyte.

📄 License

This project is for educational purposes.
