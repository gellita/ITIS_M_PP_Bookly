# AGENTS.md

## Project overview

Bookly is a full-stack bookshelf web application. Users can register and sign in, browse the shared catalog, maintain a personal shelf, rate and review books, and view public reader profiles.

The repository contains:

- `frontend/` — React single-page application.
- `backend/` — Spring Boot REST API.
- PostgreSQL — started through Docker Compose.

Keep changes focused and consistent with the existing architecture. Do not introduce a new framework, authentication model, router, state-management library, or persistence approach unless the requested task explicitly requires it.

## Repository structure

```text
.
├── backend/
│   ├── src/main/java/ru/kpfu/itis/
│   │   ├── config/       # Security, auth filter, OpenAPI, exception handling
│   │   ├── controller/   # REST controllers
│   │   ├── dto/          # Request and response DTOs
│   │   ├── entity/       # JPA entities
│   │   ├── repository/   # Spring Data JPA repositories
│   │   └── service/      # Business logic and transactions
│   └── src/main/resources/
│       ├── application.yaml
│       └── db/migration/ # Flyway migrations
├── frontend/
│   └── src/
│       ├── api/          # HTTP client and API functions
│       ├── components/   # Reusable UI components
│       ├── i18n/         # Translation context
│       ├── locales/      # en.json / ru.json
│       ├── pages/        # Top-level pages
│       ├── store/        # BooklyContext
│       ├── App.jsx       # Client-side routing
│       └── styles.css
├── docker-compose.yml
├── .env.example
└── README.md
```

Do not edit or commit generated/build directories such as `backend/build/`, `backend/bin/`, `backend/.gradle/`, `frontend/node_modules/`, or Vite build output unless the task explicitly concerns generated artifacts.

## Technology stack

### Backend

- Java 21
- Spring Boot 3.3.5
- Gradle wrapper
- Spring Web
- Spring Security
- Spring Data JPA
- Jakarta Validation
- PostgreSQL
- Flyway
- springdoc-openapi 2.6.0
- Lombok 1.18.42

### Frontend

- React 18.3.1
- React DOM 18.3.1
- Vite 5.4.x
- JavaScript / JSX
- `lucide-react`
- React Context for shared state
- Custom History API routing; React Router is not used

### Runtime

- PostgreSQL 16 Alpine
- Node 22 Alpine
- Eclipse Temurin Java 21
- Docker Compose

## Architecture

### Backend

Follow the existing flow:

```text
HTTP request
  -> Controller
  -> Service
  -> Repository
  -> JPA / PostgreSQL
```

Rules:

- Controllers handle HTTP mapping, validation, authenticated principal extraction, and delegation.
- Services contain business logic and transaction boundaries.
- Repositories contain persistence queries.
- DTOs define the API contract.
- JPA entities must not be exposed directly through REST endpoints.
- Do not access repositories directly from controllers.

Existing domains:

- Authentication: `AuthController`, `AuthService`, `AuthSessionRepository`, `SessionAuthenticationFilter`
- Books/shelf: `BookController`, `BookService`, `BookRepository`, `UserBookRepository`
- Public users/profiles: `UserController`, `UserService`, `UserRepository`, `UserBookRepository`

### Frontend

`frontend/src/App.jsx` owns navigation using `window.history.pushState()` and `popstate`.

Current routes:

- `/` — landing page
- `/signin` — login / registration
- `/readers` — public users list
- `/readers/{id}` — public user profile
- `/shelf` — authenticated user's shelf

Do not introduce React Router for a small route change unless explicitly requested.

`BooklyContext` is the central authenticated application state. It contains data such as the bearer token, current user, catalog, shelf, loading state, and API error state.

Authentication tokens are stored in `localStorage` under `booklyToken`.

HTTP requests should go through `frontend/src/api/client.js` and domain API modules rather than direct `fetch()` calls in page components unless there is a clear task-specific reason.

## Authentication and security

The project does **not** use JWT.

Authentication uses opaque random bearer tokens:

1. Login or registration creates an `AuthSession` row.
2. `AuthService` generates a random token.
3. The token is stored in PostgreSQL in `auth_sessions`.
4. The frontend stores it in `localStorage`.
5. Requests send `Authorization: Bearer <token>`.
6. `SessionAuthenticationFilter` resolves the token and sets the authenticated principal.
7. Logout deletes the session from the database.

Current auth sessions do not have expiration or refresh tokens. Do not introduce JWTs, refresh tokens, automatic rotation, or session expiry unless the task explicitly changes the authentication model.

Passwords are hashed with `BCryptPasswordEncoder`. Never store, return, or log plaintext passwords.

Current public routes include:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users/**`
- `GET /api/books`
- Swagger / OpenAPI routes

Other API routes require authentication.

CORS currently permits `http://localhost:5173` and `http://localhost:3000`.

CSRF protection is currently disabled because authentication is performed with a bearer token sent explicitly in the `Authorization` header rather than cookie-based authentication. If authentication changes to cookies, reconsider CSRF protection.

When adding an endpoint, deliberately decide whether it is public or authenticated and update `SecurityConfig` only when required.

### XSS safety

Because the auth token is stored in `localStorage`, preventing XSS is especially important.

- Treat display names, book data, reviews, and other user-controlled strings as untrusted input.
- Prefer normal JSX text rendering, which React escapes by default.
- Do not use `dangerouslySetInnerHTML` for user-controlled content unless the task explicitly requires trusted HTML and sanitization is implemented.
- Do not evaluate user-provided HTML or JavaScript.
- Do not log bearer tokens.

## API conventions

Backend API root: `/api`.

Important endpoints:

```text
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

GET    /api/books
POST   /api/books

GET    /api/my/books
POST   /api/my/books
PUT    /api/my/books/{id}
DELETE /api/my/books/{id}

GET    /api/users
GET    /api/users/{id}
```

For new or changed API contracts:

- use DTOs under `dto/req` and `dto/resp`;
- use Jakarta Bean Validation where applicable;
- keep validation near the API boundary;
- use `ApiExceptionHandler` for consistent error responses;
- preserve the existing OpenAPI annotation style.

## Database and Flyway

Schema changes are managed by Flyway.

Tracked migrations in the supplied repository snapshot:

- `V1__init_bookly_schema.sql`
- `V2__demo_data.sql`

A local `V3__add_book_translations.sql` file is present in the supplied working tree but is **not tracked by Git**. Do not assume V3 exists in other clones until it is committed.

Tracked core tables include:

- `users`
- `books`
- `user_books`
- `auth_sessions`

Rules:

- Never modify an already-applied migration to represent a new schema change.
- Add a new versioned migration using the next available version.
- Keep database constraints aligned with application validation.
- Do not delete persistent Docker volumes silently.

Existing constraints include unique usernames/emails, one shelf entry per `(user_id, book_id)`, and ratings constrained to `1..5`.

Demo users and shelf data are seeded by `V2__demo_data.sql`. The README documents the seeded password as `password`.

### Book translations

The untracked V3 migration introduces `book_translations` and seeded Russian translations.

The current Java backend does not expose this table through a JPA entity, repository, service, or API. Do not assume book translations are already used by the application.

Do not confuse book-content translations with frontend UI localization.

## Book and shelf behavior

- `Book` represents a shared catalog item.
- `UserBook` represents a user's shelf entry and stores the user's rating/review.

`BookService.addToShelf()` supports either:

- an existing catalog book via `bookId`, or
- a newly created catalog book from title, author, and description.

A user cannot add the same catalog book to their shelf twice.

Shelf updates and deletes are ownership-scoped through repository queries such as `findByIdAndUser(...)`. Preserve this server-side ownership check.

Average catalog rating is calculated from `UserBook` ratings and exposed in `BookResponse`.

## Internationalization

Frontend UI supports English and Russian through the custom i18n context.

Translation files:

- `frontend/src/locales/en.json`
- `frontend/src/locales/ru.json`

When adding visible UI text, add corresponding keys to both locale files instead of hardcoding one language in JSX.

## Environment configuration

Root `.env.example` documents variables including:

```text
POSTGRES_DB
POSTGRES_USER
POSTGRES_PASSWORD
VITE_API_URL
```

Default frontend API URL in Docker Compose:

```text
http://localhost:8080/api
```

Never commit real secrets or credentials. Keep `.env` local and update `.env.example` when a new required variable is introduced.

## Development commands

### Full stack with Docker

From the repository root:

```bash
cp .env.example .env
docker compose up --build
```

Services:

- frontend: `http://localhost:5173`
- backend: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- PostgreSQL: `localhost:5432`

Stop services:

```bash
docker compose down
```

Reset the local database only intentionally:

```bash
docker compose down -v
```

### Backend locally

The supplied Git snapshot records `backend/gradlew` without the executable bit, so use `bash ./gradlew ...` unless the permission is fixed and committed.

From `backend/`:

```bash
bash ./gradlew bootRun
bash ./gradlew build
```

Package without tests only when specifically needed:

```bash
bash ./gradlew bootJar -x test
```

The backend requires a reachable PostgreSQL database using the existing datasource configuration.

### Frontend locally

From `frontend/`:

```bash
npm ci
npm run dev
```

Production build:

```bash
npm run build
```

There is currently no `lint` script in `frontend/package.json`.

## Testing and verification

The repository currently has no established automated test suite. Do not claim tests exist when they do not.

At minimum, run the build relevant to the change:

```bash
cd backend && bash ./gradlew build
cd frontend && npm ci && npm run build
```

For API or integration-sensitive changes, also run the stack and manually exercise the affected endpoint or user flow when feasible.

If adding tests:

- follow Spring Boot conventions for backend tests;
- keep test dependencies explicit in Gradle;
- do not add a frontend test framework unless the task requires or clearly justifies it.

## Code style

### Java

- Keep packages under `ru.kpfu.itis`.
- Prefer constructor injection; `@RequiredArgsConstructor` is already used.
- Keep transaction boundaries in services.
- Use `@Transactional(readOnly = true)` for read-only service operations where appropriate.
- Use DTOs at REST boundaries.
- Reuse repository methods before adding custom persistence logic.
- Keep ownership and authorization checks server-side.
- Avoid broad exception swallowing.

### React / JavaScript

- Use functional components and hooks.
- Keep backend calls inside `src/api/` modules.
- Use `BooklyContext` only for genuinely shared state.
- Keep page-specific state local when possible.
- Reuse existing CSS and `styles.css` before adding another styling system.
- Use `lucide-react` instead of adding another icon library.
- Use translation keys for visible UI text.
- Preserve the current routing model unless the task intentionally changes routing.

## Dependencies

Avoid adding dependencies when the current stack can implement the requested behavior cleanly.

When a dependency is genuinely needed:

- explain why current dependencies are insufficient;
- update `backend/build.gradle` or `frontend/package.json`;
- let npm update `package-lock.json` through normal package commands; do not edit it manually;
- verify the corresponding build.

## Agent workflow

Before editing:

1. Inspect the relevant controller/service/repository or page/context/API module.
2. Identify the existing data flow and security boundary.
3. Prefer the smallest change that follows existing patterns.
4. Check whether the change also requires a DTO update, Flyway migration, translations, security rule, or documentation update.

For backend features, keep the usual order where applicable:

1. DTOs
2. Controller mapping
3. Service logic
4. Repository query, only if needed
5. Flyway migration, if schema changes
6. Security configuration, if endpoint visibility changes
7. OpenAPI annotations

For frontend features, keep the usual order where applicable:

1. API function
2. Shared state only if necessary
3. Page/component change
4. English and Russian locale strings
5. Existing routing conventions

## Do not do these without explicit instruction

- Replace bearer-session authentication with JWT.
- Add refresh tokens, session rotation, or token expiry as an unrelated refactor.
- Introduce React Router for a small route change.
- Replace React Context with Redux, Zustand, MobX, or another state library.
- Replace Gradle with Maven.
- Replace Flyway with Hibernate schema generation.
- Expose JPA entities directly as API responses.
- Access repositories directly from controllers.
- Edit applied Flyway migrations for new schema changes.
- Hardcode secrets or production credentials.
- Remove demo data without a task-specific reason.
- Delete Docker volumes as part of a normal build/run workflow.
- Commit generated build output, IDE metadata, local `.env`, or database data.

## Definition of done

A typical code task is complete when all applicable items are satisfied:

- requested behavior is implemented;
- existing architecture and auth model are preserved unless intentionally changed;
- backend builds successfully;
- frontend production build succeeds;
- schema changes use a new Flyway migration;
- new API fields/endpoints use DTOs and validation where appropriate;
- endpoint authorization is intentional;
- ownership checks remain server-side;
- new visible UI strings exist in both English and Russian locale files;
- `.env.example` and README are updated when setup changes;
- no secrets, generated output, unrelated refactors, or accidental data-loss commands are included.
