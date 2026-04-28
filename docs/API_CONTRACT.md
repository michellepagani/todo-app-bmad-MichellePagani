# Todo App - API Contract Specification

## Base URL
```
http://localhost:4000
```

## Authentication
Not required for MVP. All endpoints are public.

---

## Endpoints

### 1. Health Check
**Endpoint:** `GET /health`

**Purpose:** Verify server is running and responsive

**Response:**
```json
{
  "status": "ok"
}
```

**Status Code:** 200

---

### 2. List All Todos
**Endpoint:** `GET /todos`

**Purpose:** Retrieve all todos, ordered by creation date (newest first)

**Query Parameters:** None (pagination not in MVP)

**Response (200 OK):**
```json
{
  "todos": [
    {
      "id": "uuid-string",
      "description": "Buy groceries",
      "completed": false,
      "createdAt": "2026-04-26T14:30:00Z",
      "updatedAt": "2026-04-26T14:30:00Z"
    },
    {
      "id": "uuid-string-2",
      "description": "Finish project",
      "completed": true,
      "createdAt": "2026-04-26T12:00:00Z",
      "updatedAt": "2026-04-26T13:45:00Z"
    }
  ]
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "error": "Internal server error"
}
```

---

### 3. Create a Todo
**Endpoint:** `POST /todos`

**Purpose:** Create a new todo item

**Request Body:**
```json
{
  "description": "Buy groceries"
}
```

**Validation:**
- `description` is required (string, non-empty after trim)
- `description` must be ≤ 200 characters
- `description` must not be only whitespace

**Response (201 Created):**
```json
{
  "todo": {
    "id": "uuid-string",
    "description": "Buy groceries",
    "completed": false,
    "createdAt": "2026-04-26T14:30:00Z",
    "updatedAt": "2026-04-26T14:30:00Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Description is required and must be a non-empty string"
}
```

or

```json
{
  "error": "Description must be 200 characters or less"
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "error": "Internal server error"
}
```

---

### 4. Update Todo (Toggle Completion)
**Endpoint:** `PATCH /todos/:id`

**Purpose:** Update todo status (mark complete/incomplete)

**Path Parameters:**
- `id` (required): UUID of the todo

**Request Body:**
```json
{
  "completed": true
}
```

**Validation:**
- `completed` must be a boolean if provided

**Response (200 OK):**
```json
{
  "todo": {
    "id": "uuid-string",
    "description": "Buy groceries",
    "completed": true,
    "createdAt": "2026-04-26T14:30:00Z",
    "updatedAt": "2026-04-26T14:35:00Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Completed must be a boolean"
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Todo not found"
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "error": "Internal server error"
}
```

---

### 5. Delete a Todo
**Endpoint:** `DELETE /todos/:id`

**Purpose:** Delete a todo permanently

**Path Parameters:**
- `id` (required): UUID of the todo

**Response (204 No Content)**
- No response body
- Success indicated by 204 status code

**Error Response (404 Not Found):**
```json
{
  "error": "Todo not found"
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "error": "Internal server error"
}
```

---

## Headers

### Request Headers
```
Content-Type: application/json
```

### Response Headers
```
Content-Type: application/json
Access-Control-Allow-Origin: *
```

---

## Data Types

### Todo Object
```typescript
interface Todo {
  id: string;              // UUID v4
  description: string;     // 1-200 characters
  completed: boolean;      // true or false
  createdAt: ISO8601;      // UTC timestamp
  updatedAt: ISO8601;      // UTC timestamp
}
```

---

## Error Handling

### General Principles
- All errors return appropriate HTTP status codes
- Error responses include a generic `error` message
- No stack traces or technical details are exposed
- Validation errors return 400 Bad Request with specific message
- Not found errors return 404
- Server errors return 500 with generic message

### Status Codes Used
- **200 OK**: Successful GET or PATCH
- **201 Created**: Successful POST
- **204 No Content**: Successful DELETE
- **400 Bad Request**: Validation error
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

---

## Rate Limiting
Not implemented in MVP. To be added in future releases.

---

## CORS
Enabled for all origins (`*`) for MVP. To be restricted in production.
