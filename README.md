# DevPulse API

A collaborative internal issue tracking platform for software teams to report bugs, suggest features, and coordinate issue resolution.

Built with Node.js, TypeScript, Express.js, PostgreSQL, Raw SQL, JWT authentication, and role-based authorization.

---

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
