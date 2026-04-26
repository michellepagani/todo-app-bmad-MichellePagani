# QA Report — Story 7

## Summary
This report validates Story 7 for the full-stack Todo app using the current implementation and test coverage results.

- Frontend coverage: `97.4%` overall
- Backend coverage: `100%` overall
- Frontend test result: `52 passed` in `8` test files
- Backend test result: `10 passed` in `2` test suites

## Coverage Results

### Frontend
- All files: `97.4%` statements, `96.66%` branches, `100%` functions, `98.61%` lines
- `src/App.jsx`: `100%` statements, branches, functions, lines
- `src/components/TodoForm.jsx`: `85.71%` statements, `87.5%` branches, `100%` functions, `92.3%` lines
- `src/components/TodoItem.jsx`: `100%` across all metrics
- `src/components/TodoList.jsx`: `100%` across all metrics
- `src/services/api.js`: `100%` across all metrics

### Backend
- `db.js`: `100%` statements, branches, functions, lines
- Overall backend coverage: `100%`

## Test Commands

- Frontend coverage: `cd frontend && npm run coverage`
- Backend coverage: `cd backend && npm run coverage`

## Validation Notes

### Frontend QA
- The UI supports create, toggle, delete, loading state, and empty-state messaging.
- The form includes an accessible label and `aria-label` for the add input.
- Buttons include accessible text and state-aware labels (`Add`, `Adding...`).
- The checkbox is labeled with a dynamic `aria-label` describing the todo action.
- Error states are displayed to the user; this should be improved by using `role="alert"` or `aria-live="assertive"` on the error container for better screen reader announcement.

### Backend QA
- The backend exposes a health route (`/health`) and a full todo CRUD API.
- Input validation is implemented for `description` and `completed` values.
- SQL statements use parameter binding, reducing SQL injection risk.
- The database directory is created automatically when needed, which improves deployment reliability.

## Security Observations

### Strengths
- Backend validates payload content and rejects invalid `description` or `completed` values.
- Prepared statement binding is used for SQLite commands.
- Generic internal error responses are returned instead of leaking stack traces.
- The backend is configured with `express.json()` to parse JSON safely.

### Recommended Improvements
- Restrict CORS to allowed origins instead of using open `cors()` in production.
- Add authentication/authorization before exposing todo management endpoints.
- Add rate limiting or abuse protection for public-facing usage.
- Consider a Content Security Policy (CSP) when serving the frontend in production.
- Add a standard error container with `role="alert"` for accessibility and screen reader support.

## Observations and Risks

- Frontend test output includes React `act(...)` warnings in some tests. These warnings do not fail the suite, but they indicate the test implementation should be updated to more closely follow React testing best practices.
- Frontend tests purposely simulate failure paths for fetch and mutation errors. The current suite passes, but the console logs show expected error cases from those paths.
- Because this app is a simple demo, there is no authentication or authorization layer yet.

## Final Security and Accessibility Review

- Accessibility confirmation: the Todo form input, submit button, checkbox, and delete button all have accessible labels. Keyboard interaction is supported using native form controls.
- Outstanding accessibility item: error feedback currently renders in a plain `<div>` without `role="alert"` or `aria-live="assertive"`, so screen readers may not announce runtime errors predictably.
- Security confirmation: backend validation is implemented for request payloads, and SQLite commands use parameter binding rather than string interpolation.
- Security risk remains for production deployment because CORS is currently enabled broadly, there is no authentication/authorization layer, and there is no rate limiting or CSP at the server level.
- No immediate data leakage or server error details are exposed in the current implementation; the backend returns generic internal error messages on failure.

## Conclusion
The current implementation satisfies Story 7 with strong coverage, functional end-to-end behavior in the component and service layers, and a secure-enough baseline for a demo application.

The main remaining QA action is to clean up the React `act(...)` warnings in frontend tests and harden backend CORS/auth for production readiness.
