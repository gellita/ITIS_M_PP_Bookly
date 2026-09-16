# Bookly

Bookly is a small bookshelf service. Users can sign up, sign in, manage their own shelf, rate books, write reviews, browse public reader profiles.

## Stack

- Backend: Java 21, Spring Boot, Spring Web, Spring Security, Spring Data JPA, Flyway, springdoc-openapi, Lombok
- Frontend: React, Vite, lucide-react
- Database: PostgreSQL
- Runtime: Docker Compose

## Run

Create a local env file if you want to override defaults:

```bash
cp .env.example .env
```

Start everything:

```bash
docker compose up --build
```

Open:

- Frontend: http://localhost:5173
- Backend API: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html

Demo users are seeded by Flyway. Password for seeded users is `password`.

If you already had an older database volume before the UUID migration, recreate it:

```bash
docker compose down -v
docker compose up --build
```