# Todo App — BMAD Spec-Driven Implementation


This project demonstrates a full-stack Todo application built using the **BMAD (Behaviour-Modelled AI Development)** framework.

Rather than focusing only on coding, this implementation follows a **spec-driven, AI-assisted delivery workflow**, where requirements, architecture, testing, and QA are defined upfront and evolve alongside development.

---

## BMAD Approach

This project was developed using BMAD personas and phases:

1. **Product (PM)**
   - PRD refinement and project brief creation

2. **Architecture (Architect)**
   - System design
   - API contract definition
   - Data model structure

3. **Delivery (Developer)**
   - Backend and frontend implementation guided by specs

4. **Quality (QA)**
   - Test strategy defined early
   - Unit, integration, and E2E tests implemented alongside features

5. **DevOps**
   - Containerization with Docker
   - Health checks and environment configuration

This ensures alignment between **requirements → implementation → validation → delivery**

---

## Product Overview

The application allows users to:
- Create todos
- View all todos
- Mark todos as completed
- Delete todos

The focus is on:
- Simplicity
- Reliability
- Immediate user feedback
- Clean and responsive UI

---

## Architecture Overview

- **Frontend**: React (Vite) SPA
- **Backend**: REST API with Express
- **Database**: SQLite (file-based persistence)
- **Communication**: HTTP (JSON API)

The system is designed to be:
- Modular
- Easy to extend (e.g., authentication, multi-user)
- Simple to deploy

---

## QA-Driven Development

QA activities were integrated from the beginning:

- Unit tests for components and backend logic
- Integration tests for API endpoints
- End-to-End tests using Playwright

### Results
- Frontend coverage: **97%+**
- Backend coverage: **100%**
- E2E tests: **5 passing scenarios**

 See full report:
- [`QA_REPORT.md`](./QA_REPORT.md)

---

## 🤖 AI-Assisted Development

AI was used throughout the project lifecycle:

- Specification generation (PRD → architecture → stories)
- Code scaffolding and refinement
- Test generation and coverage improvement
- Debugging and issue resolution

Full traceability:
- [`AI_INTEGRATION_LOG.md`](./AI_INTEGRATION_LOG.md)

---
##  Tech Stack

**Frontend**
- React (Vite)
- Vitest

**Backend**
- Node.js (Express)
- SQLite

**Testing**
- Jest / Vitest
- Playwright

**DevOps**
- Docker & Docker Compose

---

## ▶️ Running the Application

### Docker (recommended)

```bash
docker compose up --build