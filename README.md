## Foci To-Do app

![login](login.png)

![img_2.png](img_2.png)

![img_1.png](img_1.png)

# Development

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

# Future Improvement

### Authentication

1. The current authentication is handled via cookies on the server-side, which works well for demo purposes but isn't
   ideal for production. Implement OAuth and social logins for Authentication.

### Performance:

1. Database indexing for full text search
2. Event Driven approach to keep all tabs in Sync
3. Limit the number of API calls - merge states on client-side. Right now, each action 2 API calls (one to perform the
   action and other one to load the todo list).
4. Impl `useOptimistic(...)` to improve the loading time.

### Maintainability:

1. Add Unit and E2E Tests
2. Refactoring to improve DRY and readability

### Error Handling

1. Improve error handling and UI/UX error messages
