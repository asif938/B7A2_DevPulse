# DevPulse API

A collaborative internal issue tracking platform for software teams to report bugs, suggest features, and coordinate issue resolution.

Built with Node.js, TypeScript, Express.js, PostgreSQL, Raw SQL, JWT authentication, and role-based authorization.

---

# Live Urls

GitHub Repo (Public):      https://github.com/asif938/B7A2_DevPulse
Live Deployment (Public):  https://express-assignment-nine.vercel.app/

# Features

- User authentication with JWT
- Secure password hashing using bcrypt
- Role-based access control
- Create and manage issues
- Public issue browsing
- Advanced filtering and sorting
- Maintainer-only issue deletion
- Protected routes with middleware
- Centralized error handling
- PostgreSQL with raw SQL queries only

---

# Technology Stack

| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| TypeScript | Type safety |
| Express.js | Backend framework |
| PostgreSQL | Relational database |
| pg | Native PostgreSQL driver |
| bcrypt | Password hashing |
| jsonwebtoken | JWT authentication |
| dotenv | Environment variables |
| http-status-codes | HTTP status constants |

---


---

# API Endpoint List

```md
# API Endpoints

## Authentication Routes

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login user and get JWT |

---

## Issues Routes

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/issues` | Authenticated | Create a new issue |
| GET | `/api/issues` | Public | Get all issues |
| GET | `/api/issues/:id` | Public | Get single issue |
| PATCH | `/api/issues/:id` | Contributor / Maintainer | Update issue |
| DELETE | `/api/issues/:id` | Maintainer | Delete issue |

# Database Schema

## Users Table

| Column | Type | Description |
|---|---|---|
| id | SERIAL | Primary key |
| name | VARCHAR(30) | User full name |
| email | VARCHAR(50) | Unique email address |
| password | VARCHAR(100) | Hashed password |
| role | VARCHAR(20) | contributor or maintainer |
| created_at | TIMESTAMP | Account creation time |
| updated_at | TIMESTAMP | Last update time |

---

## Issues Table

| Column | Type | Description |
|---|---|---|
| id | SERIAL | Primary key |
| title | VARCHAR(150) | Issue title |
| description | TEXT | Detailed issue description |
| type | VARCHAR(20) | bug or feature_request |
| status | VARCHAR(20) | open, in_progress, resolved |
| reporter_id | INTEGER | User id of issue creator |
| created_at | TIMESTAMP | Issue creation time |
| updated_at | TIMESTAMP | Last update time |

# Project Structure

```txt
src/
├── app.ts
├── server.ts
│
├── config/
│  
│── db/ 
│
├── modules/
│   ├── auth/
│   └── issues/
│
├── middleware/
│
├── utils/
│
├── type/
