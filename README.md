# 🎯 Job Application & Recruitment Tracker

A full-stack web application to track job applications efficiently. Built with React, Node.js, Express, and MySQL with JWT authentication.

## ✨ Features

- 🔐 **User Authentication** - Signup/Login with JWT tokens
- 📊 **Dashboard** - Visual stats of all applications
- ➕ **Add Applications** - Track company, title, date, status, notes
- 🔍 **Search & Filter** - By status, company, keywords
- ✏️ **Edit & Delete** - Update or remove applications
- 👤 **User Profile** - Update info, change password
- 📱 **Fully Responsive** - Works on all devices
- 🎨 **Modern UI** - Clean, professional design

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, React Router, Axios, Lucide Icons |
| Backend | Node.js, Express.js |
| Database | MySQL (mysql2) |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Styling | Pure CSS with CSS Variables |

## 📁 Project Structure

```
job-tracker/
├── backend/
│   ├── config/
│   │   └── db.js          # Database connection & table creation
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── jobController.js
│   │   └── profileController.js
│   ├── middleware/
│   │   └── auth.js         # JWT verification
│   ├── routes/
│   │   ├── auth.js
│   │   ├── jobs.js
│   │   └── profile.js
│   ├── .env                # Environment variables
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js    # Axios instance with interceptors
│   │   ├── components/
│   │   │   ├── JobCard.js
│   │   │   ├── JobFilters.js
│   │   │   ├── JobForm.js
│   │   │   ├── Navbar.js
│   │   │   └── StatsCards.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Dashboard.js
│   │   │   ├── Login.js
│   │   │   ├── Profile.js
│   │   │   └── Signup.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── styles.css
│   └── package.json
│
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MySQL Server running

### 1. Clone & Setup

```bash
cd job-tracker
```

### 2. Backend Setup

```bash
cd backend
npm install

# Update .env with your MySQL credentials
# DB_USER=root
# DB_PASSWORD=your_password

npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

### 4. Open Browser
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Jobs (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs` | Get all jobs (with filters) |
| GET | `/api/jobs/stats` | Dashboard statistics |
| GET | `/api/jobs/:id` | Get single job |
| POST | `/api/jobs` | Create new job |
| PUT | `/api/jobs/:id` | Update job |
| DELETE | `/api/jobs/:id` | Delete job |

### Profile (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile` | Get profile |
| PUT | `/api/profile` | Update profile |
| PUT | `/api/profile/password` | Change password |
| DELETE | `/api/profile` | Delete account |

## 🔒 JWT Authentication Flow

```
1. User signs up / logs in
2. Server generates JWT token (expires in 7 days)
3. Token stored in localStorage
4. Axios interceptor attaches token to every request
5. Server middleware verifies token
6. Protected routes accessible only with valid token
```

## 🎨 Application Statuses

| Status | Color | Meaning |
|--------|-------|---------|
| Applied | 🔵 Blue | Application submitted |
| Interview | 🟡 Yellow | Interview scheduled |
| Offer | 🟣 Purple | Offer received |
| Selected | 🟢 Green | Selected for position |
| Rejected | 🔴 Red | Application rejected |

## 🔧 Query Parameters for GET /api/jobs

```
?status=applied          # Filter by status
?company=SSGC            # Filter by company name
?search=engineer         # Search in title/company/notes
?sort=newest             # newest, oldest, company, title, status
?page=1                  # Page number
?limit=9                 # Items per page
```

## 📝 License

Free to use for portfolio and learning purposes.
