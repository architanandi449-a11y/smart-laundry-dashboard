# 🧺 LaundryOS — Order Management System

A complete full-stack Laundry Order Management System built with **React + Node.js + Express + MongoDB**.

---

## 📁 Project Structure

```
laundry/
├── backend/
│   ├── controllers/
│   │   ├── orderController.js
│   │   ├── dashboardController.js
│   │   └── authController.js
│   ├── models/
│   │   ├── Order.js
│   │   └── User.js
│   ├── routes/
│   │   ├── orderRoutes.js
│   │   ├── dashboardRoutes.js
│   │   └── authRoutes.js
│   ├── middleware/
│   │   └── auth.js
│   ├── utils/
│   │   └── db.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/            ← Vite React app (see setup below)
│   └── src/
│       ├── pages/       Dashboard, Orders, CreateOrder
│       ├── components/  Reusable UI components
│       ├── hooks/       Custom hooks
│       └── utils/       API helpers
│
└── README.md
```

---

## 🚀 Quick Start (Standalone Demo)

Open `laundry-app.html` directly in any browser — no setup needed!

- Uses `localStorage` as mock database
- Demo login: `admin@laundry.com` / `admin123`
- Includes seeded sample orders

---

## 🔧 Full Stack Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Backend Setup

```bash
cd backend
npm install

# Copy and edit environment variables
cp .env.example .env
# Set MONGO_URI, JWT_SECRET in .env

npm run dev     # Development (nodemon)
npm start       # Production
```

Backend runs on: `http://localhost:5000`

### Frontend Setup (Vite + React)

```bash
# Create Vite project
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install axios react-router-dom recharts

# Run dev server
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## 📡 REST API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Get current user |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | List orders (supports ?name, ?phone, ?status, ?garment) |
| POST | `/api/orders` | Create order |
| GET | `/api/orders/:id` | Get single order |
| PUT | `/api/orders/:id` | Edit order |
| PUT | `/api/orders/:id/status` | Update status |
| DELETE | `/api/orders/:id` | Delete order |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Stats: totals, revenue, by-status, daily revenue, top garments |

All routes (except auth) require: `Authorization: Bearer <token>`

---

## 📦 Garment Pricing

| Garment | Price |
|---------|-------|
| Shirt | ₹50 |
| Pants | ₹80 |
| Saree | ₹100 |
| Jacket | ₹150 |
| Kurta | ₹60 |
| Suit | ₹200 |

---

## 🎨 Features

- ✅ Login with JWT authentication
- ✅ Dashboard with stats cards + bar/pie charts
- ✅ Create orders with multi-garment selection & auto total calculation
- ✅ Auto-generated Order ID (ORD-XXXXXX)
- ✅ Estimated delivery date (+2 days auto-set)
- ✅ Order list with search (name, phone) + filter (status, garment)
- ✅ Status management (RECEIVED → PROCESSING → READY → DELIVERED)
- ✅ Delivery confirmation modal
- ✅ Edit & Delete orders
- ✅ Toast notifications
- ✅ Form validation
- ✅ Recent order highlighting
- ✅ Sidebar with live status counts

---

## .env Example

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/laundry_db
JWT_SECRET=your_super_secret_jwt_key_change_this
NODE_ENV=development
```
