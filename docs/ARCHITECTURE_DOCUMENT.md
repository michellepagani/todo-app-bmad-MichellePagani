# Todo App - Architecture Document

## System Overview
A full-stack Todo application enabling users to create, read, update, and delete tasks. Built with React frontend, Node.js/Express backend, and SQLite database for single-user task management.

## High-Level Architecture
```
Frontend (React) ── HTTP/REST ── Backend (Node.js + Express) ── SQLite Database
```

## API Endpoints
- `GET /todos` - Retrieve all todos
- `POST /todos` - Create new todo
- `PATCH /todos/:id` - Update todo completion status
- `DELETE /todos/:id` - Delete todo

## Data Model
**Todos Table:**
```sql
CREATE TABLE todos (
  id TEXT PRIMARY KEY,
  description TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
)
```

**Fields:**
- `id`: UUID v4 primary key
- `description`: Task text (max 200 chars)
- `completed`: Boolean status
- `createdAt`: ISO 8601 timestamp
- `updatedAt`: ISO 8601 timestamp

## Key Decisions
- **SQLite Database:** File-based persistence, no external dependencies
- **UUID Primary Keys:** Prevents enumeration, database-agnostic
- **No Authentication:** MVP scope for single-user context
- **Hard Delete:** Permanent removal, no audit trail needed
- **REST API:** Standard HTTP methods for CRUD operations
