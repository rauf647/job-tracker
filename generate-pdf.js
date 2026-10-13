const PDFDocument = require('pdfkit');
const fs = require('fs');

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 50, bottom: 50, left: 50, right: 50 }
});

const output = fs.createWriteStream('D:\\job-tracker\\Project-Documentation.pdf');
doc.pipe(output);

// Colors
const primary = '#4f46e5';
const accent = '#7c3aed';
const dark = '#1e293b';
const gray = '#64748b';
const lightBg = '#f8fafc';
const success = '#059669';
const border = '#e2e8f0';

// Helper functions
function drawHeader(title, subtitle) {
  // Header background
  doc.rect(0, 0, 612, 120).fill(primary);
  doc.rect(0, 120, 612, 4).fill(accent);

  doc.fillColor('#ffffff')
    .fontSize(28)
    .font('Helvetica-Bold')
    .text('Job Application Tracker', 50, 35);

  doc.fontSize(12)
    .font('Helvetica')
    .text('Full-Stack Web Application Documentation', 50, 72);

  doc.fontSize(10)
    .text('Project Report | ' + new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), 50, 95);

  doc.moveDown(4);
}

function sectionTitle(title, y) {
  const currentY = y || doc.y;
  doc.rect(50, currentY, 512, 32).fill(primary);

  doc.fillColor('#ffffff')
    .fontSize(14)
    .font('Helvetica-Bold')
    .text('  ' + title, 55, currentY + 8);

  doc.moveDown(1);
  doc.y = currentY + 40;
}

function bulletPoint(text, indent) {
  const x = 65 + (indent || 0);
  doc.fillColor(dark)
    .fontSize(10)
    .font('Helvetica')
    .text('•', x, doc.y - 5)
    .text(text, x + 12, doc.y - 15, { width: 480 });
}

function infoRow(label, value) {
  doc.fillColor(gray)
    .fontSize(9)
    .font('Helvetica-Bold')
    .text(label + ': ', 60, doc.y, { continued: true })
    .font('Helvetica')
    .fillColor(dark)
    .text(value);
  doc.moveDown(0.3);
}

function codeBlock(code) {
  const startY = doc.y;
  doc.rect(60, startY - 2, 500, 28).fill(lightBg).stroke(border);
  doc.fillColor('#334155')
    .fontSize(9)
    .font('Courier')
    .text(code, 68, startY + 6, { width: 485 });
  doc.moveDown(2);
  doc.y = startY + 32;
}

// ========== PAGE 1: COVER ==========
doc.rect(0, 0, 612, 800).fill(primary);

// Decorative circles
doc.circle(500, 100, 120).fillOpacity(0.1).fill('#ffffff');
doc.circle(100, 650, 80).fillOpacity(0.08).fill('#ffffff');
doc.circle(450, 700, 60).fillOpacity(0.06).fill('#ffffff');

doc.fillColor('#ffffff')
  .fontSize(42)
  .font('Helvetica-Bold')
  .text('Job Application', 60, 280)
  .text('Tracker', 60, 330);

doc.moveDown(1)
  .fontSize(16)
  .font('Helvetica')
  .fillOpacity(0.9)
  .text('Full-Stack Web Application with React, Node.js, Express & SQLite', 60, 400, { width: 400 });

doc.moveDown(2)
  .fontSize(12)
  .fillOpacity(0.7)
  .text('A complete job application management system with user authentication,', 60, 470)
  .text('dashboard analytics, CRUD operations, and responsive design.', 60, 490);

doc.moveDown(3)
  .fontSize(11)
  .fillOpacity(0.6)
  .text('Date: ' + new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), 60, 560)
  .text('Tech Stack: React 18 | Node.js | Express | SQLite | JWT', 60, 580);

// ========== PAGE 2: OVERVIEW ==========
doc.addPage();
drawHeader();

doc.fillColor(dark)
  .fontSize(16)
  .font('Helvetica-Bold')
  .text('1. Project Overview', 50, 140);

doc.moveDown(0.5);

doc.fillColor(gray)
  .fontSize(10)
  .font('Helvetica')
  .text('This is a full-stack web application designed to help job seekers track their job applications efficiently. Users can sign up, log in, and manage their job applications with features like adding, editing, deleting, searching, and filtering applications. The dashboard provides visual statistics of all applications by status.', 50, 168, { width: 512, align: 'justify' });

doc.moveDown(1.5);

// Key Features Box
const featuresY = doc.y;
doc.rect(50, featuresY, 512, 180).fill(lightBg).stroke(border);

doc.fillColor(primary)
  .fontSize(12)
  .font('Helvetica-Bold')
  .text('  Key Features', 60, featuresY + 10);

const features = [
  'User Authentication (Signup/Login with JWT tokens)',
  'Dashboard with visual statistics and status cards',
  'Add, Edit, Delete job applications (Full CRUD)',
  'Search by company, title, or keywords',
  'Filter by status (Applied, Interview, Offer, Selected, Rejected)',
  'Sort by date, company, title, or status',
  'User Profile management with password change',
  'Fully responsive design (Mobile, Tablet, Desktop)',
  'Modern UI with gradients and smooth animations'
];

features.forEach((f, i) => {
  doc.fillColor(dark)
    .fontSize(9)
    .font('Helvetica')
    .text('✓ ' + f, 65, featuresY + 35 + (i * 15), { width: 490 });
});

doc.moveDown(8);

// ========== PAGE 3: TECH STACK ==========
sectionTitle('2. Technology Stack', doc.y);

const techData = [
  { layer: 'Frontend', tech: 'React 18, React Router v6, Axios, Lucide Icons, CSS3' },
  { layer: 'Backend', tech: 'Node.js, Express.js, JWT Authentication, bcryptjs' },
  { layer: 'Database', tech: 'SQLite (via built-in node:sqlite module)' },
  { layer: 'Build Tool', tech: 'Create React App (react-scripts 5.0.1)' }
];

// Tech table
const tableTop = doc.y;
const colWidth = [120, 392];
let rowY = tableTop;

// Header
doc.rect(50, rowY, 512, 25).fill(primary);
doc.fillColor('#ffffff')
  .fontSize(10)
  .font('Helvetica-Bold')
  .text('  Layer', 55, rowY + 6)
  .text('  Technology', 175, rowY + 6);
rowY += 25;

techData.forEach((row, i) => {
  const bg = i % 2 === 0 ? lightBg : '#ffffff';
  doc.rect(50, rowY, 512, 22).fill(bg);
  doc.fillColor(gray)
    .font('Helvetica-Bold')
    .fontSize(9)
    .text('  ' + row.layer, 55, rowY + 5)
    .fillColor(dark)
    .font('Helvetica')
    .text('  ' + row.tech, 175, rowY + 5);
  rowY += 22;
});

// Border around table
doc.rect(50, tableTop, 512, rowY - tableTop).stroke(border);

doc.moveDown(2);

// ========== PAGE 4: DATABASE ==========
sectionTitle('3. Database Design & Connection', doc.y);

doc.fillColor(dark)
  .fontSize(11)
  .font('Helvetica-Bold')
  .text('Database: SQLite (node:sqlite)', 55, doc.y);

doc.moveDown(0.5);

doc.fillColor(gray)
  .fontSize(9)
  .font('Helvetica')
  .text('SQLite was chosen because it requires no separate server installation. Node.js v24 has a built-in node:sqlite module, so no native compilation (like Visual Studio) is needed. Data is stored in a local file (data.sqlite) that persists between server restarts.', 55, doc.y, { width: 512 });

doc.moveDown(1);

// Tables
doc.fillColor(dark)
  .fontSize(11)
  .font('Helvetica-Bold')
  .text('Tables:', 55, doc.y);
doc.moveDown(0.3);

// Users table
const usersY = doc.y;
doc.rect(55, usersY, 502, 22).fill('#eef2ff').stroke('#c7d2fe');
doc.fillColor(primary)
  .fontSize(10)
  .font('Helvetica-Bold')
  .text('  Table: users', 60, usersY + 5);
doc.moveDown(0.8);

const userCols = [
  'id (INTEGER, PK, AUTOINCREMENT)',
  'name (VARCHAR(100), NOT NULL)',
  'email (VARCHAR(150), UNIQUE, NOT NULL)',
  'password (VARCHAR(255), NOT NULL) - bcrypt hashed',
  'phone (VARCHAR(20), optional)',
  'location (VARCHAR(100), optional)',
  'bio (TEXT, optional)',
  'created_at (TEXT, DEFAULT CURRENT_TIMESTAMP)',
  'updated_at (TEXT, auto-updated via trigger)'
];

userCols.forEach(col => {
  doc.fillColor(dark)
    .fontSize(8)
    .font('Courier')
    .text('  ' + col, 60, doc.y);
  doc.moveDown(0.2);
});

doc.moveDown(1);

// Jobs table
const jobsY = doc.y;
doc.rect(55, jobsY, 502, 22).fill('#f5f3ff').stroke('#c4b5fd');
doc.fillColor(accent)
  .fontSize(10)
  .font('Helvetica-Bold')
  .text('  Table: job_applications', 60, jobsY + 5);
doc.moveDown(0.8);

const jobCols = [
  'id (INTEGER, PK, AUTOINCREMENT)',
  'user_id (INTEGER, FK → users.id, CASCADE DELETE)',
  'company_name (VARCHAR(150), NOT NULL)',
  'job_title (VARCHAR(150), NOT NULL)',
  'job_description (TEXT, optional)',
  'job_location (VARCHAR(150), optional)',
  'salary_range (VARCHAR(100), optional)',
  'application_date (TEXT, NOT NULL)',
  'status (TEXT, CHECK: applied/interview/rejected/selected/offer)',
  'notes, job_url, contact_person, contact_email (optional)',
  'Indexes: idx_job_user_status, idx_job_user_date'
];

jobCols.forEach(col => {
  doc.fillColor(dark)
    .fontSize(8)
    .font('Courier')
    .text('  ' + col, 60, doc.y);
  doc.moveDown(0.2);
});

doc.moveDown(1);

// Connection info
doc.fillColor(dark)
  .fontSize(11)
  .font('Helvetica-Bold')
  .text('Database Connection:', 55, doc.y);
doc.moveDown(0.3);

doc.fillColor(gray)
  .fontSize(9)
  .font('Helvetica')
  .text('The backend uses Node.js built-in node:sqlite module (DatabaseSync class). A wrapper was created to mimic mysql2\'s pool.execute() interface, returning [rows] for SELECT and [{insertId}] / [{affectedRows}] for write operations. This ensures clean async/await syntax throughout the codebase.', 55, doc.y, { width: 512 });

// ========== PAGE 5: API ENDPOINTS ==========
doc.addPage();
drawHeader();

sectionTitle('4. API Endpoints', doc.y);

// Auth endpoints
const authY = doc.y;
doc.rect(55, authY, 502, 22).fill('#ecfdf5').stroke('#6ee7b7');
doc.fillColor(success)
  .fontSize(10)
  .font('Helvetica-Bold')
  .text('  Authentication (Public)', 60, authY + 5);
doc.moveDown(0.8);

const authEndpoints = [
  { method: 'POST', path: '/api/auth/signup', desc: 'Register new user, returns JWT token' },
  { method: 'POST', path: '/api/auth/login', desc: 'Login user, returns JWT token' },
  { method: 'GET', path: '/api/auth/me', desc: 'Get current user (protected)' }
];

authEndpoints.forEach(ep => {
  doc.fillColor(success)
    .fontSize(8)
    .font('Courier-Bold')
    .text('  ' + ep.method, 60, doc.y, { continued: false });
  doc.fillColor(dark)
    .font('Courier')
    .text('  ' + ep.path, 110, doc.y - 11, { continued: true })
    .fillColor(gray)
    .font('Helvetica')
    .text('  → ' + ep.desc);
  doc.moveDown(0.2);
});

doc.moveDown(1);

// Jobs endpoints
const jobsEY = doc.y;
doc.rect(55, jobsEY, 502, 22).fill('#eef2ff').stroke('#c7d2fe');
doc.fillColor(primary)
  .fontSize(10)
  .font('Helvetica-Bold')
  .text('  Jobs (Protected - JWT Required)', 60, jobsEY + 5);
doc.moveDown(0.8);

const jobEndpoints = [
  { method: 'GET', path: '/api/jobs', desc: 'Get all jobs (query: status, company, search, sort, page, limit)' },
  { method: 'GET', path: '/api/jobs/stats', desc: 'Get dashboard statistics (counts by status)' },
  { method: 'GET', path: '/api/jobs/:id', desc: 'Get single job by ID' },
  { method: 'POST', path: '/api/jobs', desc: 'Create new job application' },
  { method: 'PUT', path: '/api/jobs/:id', desc: 'Update job application' },
  { method: 'DELETE', path: '/api/jobs/:id', desc: 'Delete job application' }
];

jobEndpoints.forEach(ep => {
  const methodColor = ep.method === 'GET' ? '#2563eb' : ep.method === 'POST' ? '#059669' : ep.method === 'PUT' ? '#d97706' : '#dc2626';
  doc.fillColor(methodColor)
    .fontSize(8)
    .font('Courier-Bold')
    .text('  ' + ep.method, 60, doc.y, { continued: false });
  doc.fillColor(dark)
    .font('Courier')
    .text('  ' + ep.path, 110, doc.y - 11, { continued: true })
    .fillColor(gray)
    .font('Helvetica')
    .text('  → ' + ep.desc);
  doc.moveDown(0.2);
});

doc.moveDown(1);

// Profile endpoints
const profY = doc.y;
doc.rect(55, profY, 502, 22).fill('#fef3c7').stroke('#fcd34d');
doc.fillColor('#d97706')
  .fontSize(10)
  .font('Helvetica-Bold')
  .text('  Profile (Protected - JWT Required)', 60, profY + 5);
doc.moveDown(0.8);

const profEndpoints = [
  { method: 'GET', path: '/api/profile', desc: 'Get user profile' },
  { method: 'PUT', path: '/api/profile', desc: 'Update profile (name, phone, location, bio)' },
  { method: 'PUT', path: '/api/profile/password', desc: 'Change password' },
  { method: 'DELETE', path: '/api/profile', desc: 'Delete account (cascade deletes all jobs)' }
];

profEndpoints.forEach(ep => {
  const methodColor = ep.method === 'GET' ? '#2563eb' : ep.method === 'PUT' ? '#d97706' : '#dc2626';
  doc.fillColor(methodColor)
    .fontSize(8)
    .font('Courier-Bold')
    .text('  ' + ep.method, 60, doc.y, { continued: false });
  doc.fillColor(dark)
    .font('Courier')
    .text('  ' + ep.path, 110, doc.y - 11, { continued: true })
    .fillColor(gray)
    .font('Helvetica')
    .text('  → ' + ep.desc);
  doc.moveDown(0.2);
});

doc.moveDown(1);

// Health check
doc.fillColor(gray)
  .fontSize(9)
  .font('Helvetica')
  .text('Health Check: GET /api/health → Returns { status: "OK", message: "Job Tracker API is running" }', 55, doc.y);

// ========== PAGE 6: AUTH FLOW ==========
doc.addPage();
drawHeader();

sectionTitle('5. Authentication Flow (JWT)', doc.y);

const authSteps = [
  { step: '1. User Signs Up / Logs In', detail: 'POST /api/auth/signup or /api/auth/login with email & password' },
  { step: '2. Server Generates JWT Token', detail: 'Token contains user ID, expires in 7 days (configurable in .env)' },
  { step: '3. Token Stored in localStorage', detail: 'Both token and user object stored in browser localStorage' },
  { step: '4. Axios Interceptor Attaches Token', detail: 'Every API request includes Authorization: Bearer <token> header' },
  { step: '5. Server Middleware Verifies Token', detail: 'protect middleware decodes JWT, fetches user from DB, attaches to req.user' },
  { step: '6. Protected Routes Accessible', detail: 'Only valid token grants access to /api/jobs and /api/profile routes' },
  { step: '7. 401 Handling', detail: 'If token expires/invalid, interceptor redirects to /login automatically' }
];

authSteps.forEach(item => {
  const stepY = doc.y;
  doc.circle(65, stepY + 5, 8).fill(primary);
  doc.fillColor('#ffffff')
    .fontSize(8)
    .font('Helvetica-Bold')
    .text(item.step.charAt(0), 62, stepY + 1);

  doc.fillColor(dark)
    .fontSize(9)
    .font('Helvetica-Bold')
    .text(item.step, 80, stepY - 2);
  doc.fillColor(gray)
    .fontSize(8)
    .font('Helvetica')
    .text(item.detail, 80, stepY + 12, { width: 470 });
  doc.moveDown(1.2);
});

doc.moveDown(1);

// Password security
doc.fillColor(dark)
  .fontSize(11)
  .font('Helvetica-Bold')
  .text('Password Security:', 55, doc.y);
doc.moveDown(0.3);

doc.fillColor(gray)
  .fontSize(9)
  .font('Helvetica')
  .text('Passwords are hashed using bcryptjs with a salt round of 12. The hashed password is stored in the database — plain text passwords are never saved. During login, bcrypt.compare() verifies the entered password against the stored hash.', 55, doc.y, { width: 512 });

// ========== PAGE 7: PROJECT STRUCTURE ==========
doc.addPage();
drawHeader();

sectionTitle('6. Project Structure', doc.y);

doc.fillColor(dark)
  .fontSize(9)
  .font('Courier')
  .text('job-tracker/', 55, doc.y);
doc.moveDown(0.3);
doc.text('├── backend/', 65, doc.y);
doc.moveDown(0.2);
doc.text('│   ├── config/', 65, doc.y);
doc.moveDown(0.2);
doc.text('│   │   └── db.js          # Database connection & table creation', 75, doc.y);
doc.moveDown(0.2);
doc.text('│   ├── controllers/', 65, doc.y);
doc.moveDown(0.2);
doc.text('│   │   ├── authController.js    # Signup, Login, GetMe', 75, doc.y);
doc.moveDown(0.2);
doc.text('│   │   ├── jobController.js     # CRUD + Stats for jobs', 75, doc.y);
doc.moveDown(0.2);
doc.text('│   │   └── profileController.js # Profile management', 75, doc.y);
doc.moveDown(0.2);
doc.text('│   ├── middleware/', 65, doc.y);
doc.moveDown(0.2);
doc.text('│   │   └── auth.js        # JWT verification (protect)', 75, doc.y);
doc.moveDown(0.2);
doc.text('│   ├── routes/', 65, doc.y);
doc.moveDown(0.2);
doc.text('│   │   ├── auth.js         # /api/auth/* routes', 75, doc.y);
doc.moveDown(0.2);
doc.text('│   │   ├── jobs.js         # /api/jobs/* routes', 75, doc.y);
doc.moveDown(0.2);
doc.text('│   │   └── profile.js      # /api/profile/* routes', 75, doc.y);
doc.moveDown(0.2);
doc.text('│   ├── .env               # Environment variables', 65, doc.y);
doc.moveDown(0.2);
doc.text('│   ├── server.js          # Express app entry point', 65, doc.y);
doc.moveDown(0.2);
doc.text('│   ├── package.json       # Dependencies', 65, doc.y);
doc.moveDown(0.2);
doc.text('│   └── data.sqlite        # SQLite database file (auto-created)', 65, doc.y);
doc.moveDown(0.3);
doc.text('├── frontend/', 55, doc.y);
doc.moveDown(0.2);
doc.text('│   ├── public/', 65, doc.y);
doc.moveDown(0.2);
doc.text('│   │   └── index.html      # HTML shell', 75, doc.y);
doc.moveDown(0.2);
doc.text('│   ├── src/', 65, doc.y);
doc.moveDown(0.2);
doc.text('│   │   ├── api/', 75, doc.y);
doc.moveDown(0.2);
doc.text('│   │   │   └── axios.js     # Axios instance with JWT interceptors', 85, doc.y);
doc.moveDown(0.2);
doc.text('│   │   ├── components/', 75, doc.y);
doc.moveDown(0.2);
doc.text('│   │   │   ├── Navbar.js     # Navigation with mobile menu', 85, doc.y);
doc.moveDown(0.2);
doc.text('│   │   │   ├── StatsCards.js # Dashboard statistics cards', 85, doc.y);
doc.moveDown(0.2);
doc.text('│   │   │   ├── JobCard.js    # Individual job display card', 85, doc.y);
doc.moveDown(0.2);
doc.text('│   │   │   ├── JobFilters.js # Search, filter, sort controls', 85, doc.y);
doc.moveDown(0.2);
doc.text('│   │   │   └── JobForm.js    # Add/Edit job modal form', 85, doc.y);
doc.moveDown(0.2);
doc.text('│   │   ├── context/', 75, doc.y);
doc.moveDown(0.2);
doc.text('│   │   │   └── AuthContext.js # Auth state management', 85, doc.y);
doc.moveDown(0.2);
doc.text('│   │   ├── pages/', 75, doc.y);
doc.moveDown(0.2);
doc.text('│   │   │   ├── Login.js      # Login page', 85, doc.y);
doc.moveDown(0.2);
doc.text('│   │   │   ├── Signup.js     # Signup page', 85, doc.y);
doc.moveDown(0.2);
doc.text('│   │   │   ├── Dashboard.js  # Main dashboard with jobs', 85, doc.y);
doc.moveDown(0.2);
doc.text('│   │   │   └── Profile.js    # User profile page', 85, doc.y);
doc.moveDown(0.2);
doc.text('│   │   ├── App.js           # Router & route protection', 75, doc.y);
doc.moveDown(0.2);
doc.text('│   │   ├── index.js         # React entry point', 75, doc.y);
doc.moveDown(0.2);
doc.text('│   │   └── styles.css       # All styling (950+ lines)', 75, doc.y);
doc.moveDown(0.2);
doc.text('│   └── package.json         # Frontend dependencies', 65, doc.y);
doc.moveDown(0.2);
doc.text('└── README.md                # Project documentation', 55, doc.y);

// ========== PAGE 8: HOW TO RUN ==========
doc.addPage();
drawHeader();

sectionTitle('7. How to Run the Project', doc.y);

const runSteps = [
  { title: 'Prerequisites', cmd: 'Node.js v16+ installed (currently using v24.21.0)' },
  { title: 'Step 1: Backend Setup', cmd: 'cd backend && npm install && node server.js' },
  { title: 'Step 2: Frontend Setup', cmd: 'cd frontend && npm install && npm start' },
  { title: 'Step 3: Open Browser', cmd: 'http://localhost:3000 (Frontend) | http://localhost:5000 (Backend API)' }
];

runSteps.forEach((item, i) => {
  doc.fillColor(primary)
    .fontSize(10)
    .font('Helvetica-Bold')
    .text(item.title + ':', 55, doc.y);
  doc.moveDown(0.2);
  codeBlock(item.cmd);
  doc.moveDown(0.3);
});

doc.moveDown(1);

// Environment Variables
doc.fillColor(dark)
  .fontSize(11)
  .font('Helvetica-Bold')
  .text('Environment Variables (backend/.env):', 55, doc.y);
doc.moveDown(0.3);

const envVars = [
  'PORT=5000',
  'DB_HOST=localhost',
  'DB_USER=root',
  'DB_PASSWORD=root',
  'DB_NAME=job_tracker',
  'JWT_SECRET=your_super_secret_jwt_key',
  'JWT_EXPIRE=7d'
];

envVars.forEach(v => {
  doc.fillColor('#334155')
    .fontSize(8)
    .font('Courier')
    .text('  ' + v, 60, doc.y);
  doc.moveDown(0.15);
});

// ========== PAGE 9: CHANGES MADE ==========
doc.addPage();
drawHeader();

sectionTitle('8. Changes Made to Run the Project', doc.y);

doc.fillColor(dark)
  .fontSize(10)
  .font('Helvetica-Bold')
  .text('Original project used MySQL. Following changes were made to run it without MySQL:', 55, doc.y, { width: 512 });
doc.moveDown(0.5);

const changes = [
  {
    title: '1. MySQL → SQLite Migration',
    detail: 'Replaced mysql2 with Node.js built-in node:sqlite (DatabaseSync). No native compilation needed. Created a wrapper that mimics mysql2\'s pool.execute() interface returning [rows] for SELECT and [{insertId}] for INSERT.'
  },
  {
    title: '2. SQL Syntax Adaptations',
    detail: 'Changed AUTO_INCREMENT → AUTOINCREMENT, ENUM → TEXT with CHECK constraint, FIELD() → CASE WHEN for sorting, MONTH()/YEAR() → strftime() for date filtering, added triggers for updated_at timestamps.'
  },
  {
    title: '3. Fixed Icon Import Error',
    detail: 'Replaced CalendarMonth (not in newer lucide-react) with Calendar icon in StatsCards.js component.'
  },
  {
    title: '4. Database Auto-Initialization',
    detail: 'initDatabase() now returns a Promise to work with server.js\'s .then() chain. Tables and indexes are created automatically on first run.'
  },
  {
    title: '5. Premium UI/UX Design',
    detail: 'Complete CSS overhaul with gradient buttons, glassmorphism navbar, smooth animations, vibrant color palette, and full responsive design (mobile, tablet, desktop).'
  },
  {
    title: '6. Sample Data Seeded',
    detail: 'Added 12 sample job records (6 SSGC + 6 other companies) with a demo user for testing purposes.'
  }
];

changes.forEach(change => {
  const changeY = doc.y;
  doc.rect(55, changeY, 502, 18).fill('#eef2ff').stroke('#c7d2fe');
  doc.fillColor(primary)
    .fontSize(9)
    .font('Helvetica-Bold')
    .text('  ' + change.title, 60, changeY + 4);
  doc.moveDown(0.8);
  doc.fillColor(gray)
    .fontSize(8)
    .font('Helvetica')
    .text(change.detail, 60, doc.y, { width: 495 });
  doc.moveDown(0.8);
});

// ========== PAGE 10: USER FLOW ==========
doc.addPage();
drawHeader();

sectionTitle('9. User Flow (How Any User Can Use It)', doc.y);

const userFlow = [
  { step: 'Sign Up', desc: 'Go to /signup → Enter name, email, password → Account created → Auto login' },
  { step: 'Login', desc: 'Go to /login → Enter email & password → JWT token stored → Redirect to dashboard' },
  { step: 'View Dashboard', desc: 'See stats cards (total, applied, interview, offer, selected, rejected counts)' },
  { step: 'Add Job', desc: 'Click "Add New" button → Fill form (company, title, date, status, notes) → Submit' },
  { step: 'Edit Job', desc: 'Click Edit on any job card → Modify details → Update' },
  { step: 'Delete Job', desc: 'Click Delete on any job card → Confirm → Removed from list' },
  { step: 'Search & Filter', desc: 'Use search bar for keywords, dropdown for status, sort options' },
  { step: 'View Profile', desc: 'Go to /profile → Update name, phone, location, bio → Change password' },
  { step: 'Logout', desc: 'Click logout button → Token cleared → Redirect to login' }
];

userFlow.forEach((item, i) => {
  const flowY = doc.y;

  // Step number circle
  doc.circle(65, flowY + 8, 10).fill(primary);
  doc.fillColor('#ffffff')
    .fontSize(9)
    .font('Helvetica-Bold')
    .text(String(i + 1), 61, flowY + 3);

  doc.fillColor(dark)
    .fontSize(9)
    .font('Helvetica-Bold')
    .text(item.step, 82, flowY);
  doc.fillColor(gray)
    .fontSize(8)
    .font('Helvetica')
    .text(item.desc, 82, flowY + 13, { width: 470 });

  doc.moveDown(1.3);
});

doc.moveDown(1);

// Demo credentials
doc.fillColor(dark)
  .fontSize(11)
  .font('Helvetica-Bold')
  .text('Demo Credentials:', 55, doc.y);
doc.moveDown(0.3);

const credY = doc.y;
doc.rect(55, credY, 502, 50).fill('#f0fdf4').stroke('#6ee7b7');
doc.fillColor('#059669')
  .fontSize(9)
  .font('Helvetica-Bold')
  .text('  Email: ahmed@gmail.com', 60, credY + 8)
  .text('  Password: password123', 60, credY + 25);
doc.moveDown(4);

// Footer
doc.fillColor(gray)
  .fontSize(8)
  .font('Helvetica')
  .text('This project was built as a full-stack portfolio application demonstrating React, Node.js, Express, SQLite, and JWT authentication.', 55, 750, { width: 512, align: 'center' });

doc.end();

console.log('PDF generated: D:\\job-tracker\\Project-Documentation.pdf');
