# AGENTS.md

## Commands

- Полный стек: `cp .env.example .env && docker compose up --build`
- Остановка: `docker compose down`
- Сброс локальной БД только по явному запросу: `docker compose down -v`
- Backend build: `cd backend && bash ./gradlew build`
- Backend run: `cd backend && bash ./gradlew bootRun`
- Frontend install: `cd frontend && npm ci`
- Frontend dev: `cd frontend && npm run dev`
- Frontend production build: `cd frontend && npm run build`

## Project overview

Bookly — full-stack приложение для ведения книжной полки: регистрация и вход, каталог книг, личная полка, оценки, отзывы и публичные профили читателей.

Стек:
- Backend: Java 21, Spring Boot 3.3.5, Gradle, Spring Web, Security, Data JPA, Validation, PostgreSQL, Flyway.
- Frontend: React 18.3.1, Vite 5.4.x, JavaScript/JSX, React Context.
- Runtime: PostgreSQL 16, Docker Compose.

## Project structure

- `backend/src/main/java/ru/kpfu/itis/`
  - `controller/` — REST endpoints
  - `service/` — бизнес-логика и транзакции
  - `repository/` — Spring Data JPA
  - `entity/` — JPA entities
  - `dto/` — request/response DTO
  - `config/` — security, auth filter, OpenAPI, exception handling
- `backend/src/main/resources/db/migration/` — Flyway migrations
- `frontend/src/api/` — HTTP client и API functions
- `frontend/src/pages/` — страницы
- `frontend/src/components/` — переиспользуемые компоненты
- `frontend/src/store/` — `BooklyContext`
- `frontend/src/locales/` — `en.json`, `ru.json`
- `frontend/src/App.jsx` — клиентская маршрутизация через History API

## Architecture and code style

Backend flow: `Controller -> Service -> Repository -> JPA/PostgreSQL`.

- Контроллеры не должны содержать бизнес-логику или напрямую обращаться к repositories.
- Бизнес-логика и транзакции находятся в services.
- API-контракты оформляй через DTO; JPA entities напрямую через REST не возвращай.
- Для входных данных используй Jakarta Validation, где это уместно.
- Ошибки API обрабатывай через существующий `ApiExceptionHandler`.
- Сохраняй существующий стиль OpenAPI-аннотаций.
- HTTP-запросы frontend делай через `frontend/src/api/client.js` и доменные API-модули.
- Не используй прямой `fetch()` внутри page-компонентов без необходимости.
- React Router не используется: навигация реализована через History API.
- Общий state хранится в `BooklyContext`; не добавляй новую state-библиотеку без необходимости.
- Новый видимый UI-текст добавляй одновременно в `en.json` и `ru.json`.

## Authentication and security

Проект не использует JWT.

- При login/register создаётся `AuthSession` со случайным bearer-token.
- Токен хранится в PostgreSQL и на frontend в `localStorage` под ключом `booklyToken`.
- Запросы используют `Authorization: Bearer <token>`.
- `SessionAuthenticationFilter` определяет пользователя по токену.
- Logout удаляет auth-session.
- Текущие сессии не имеют expiry или refresh-token механизма.
- Пароли хешируются через `BCryptPasswordEncoder`.
- Не логируй пароли, bearer-токены или секреты.
- Не используй `dangerouslySetInnerHTML` для пользовательского контента без явной необходимости и санации.
- При добавлении endpoint явно определи, публичный он или требует authentication.
- CSRF сейчас отключён, так как auth использует явный `Authorization` header, а не cookie-based session.

## Database

Схема управляется Flyway.

- Не изменяй уже применённые migrations для новых изменений.
- Для изменения схемы добавляй новую versioned migration.
- Сохраняй ограничения БД согласованными с validation приложения.
- Не удаляй Docker volumes без прямого запроса.
- `Book` — общая книга каталога; `UserBook` — запись книги на полке пользователя с рейтингом/отзывом.
- Проверки владельца при update/delete полки должны оставаться на backend.

## Boundaries

### ✅ Always

- Сначала изучи существующий controller/service/repository или page/context/API module.
- Делай минимальные изменения в рамках текущей архитектуры.
- После backend-изменений запускай `bash ./gradlew build`.
- После frontend-изменений запускай `npm run build`.
- Проверяй, нужны ли вместе с изменением DTO, migration, locale strings, security rules или README.

### ⚠️ Ask first

- Изменение модели аутентификации.
- Изменение схемы БД, если это не является прямой частью задачи.
- Добавление новой зависимости, фреймворка, router или state-management библиотеки.
- Удаление demo data или Docker volumes.

### 🚫 Never

- Не заменяй bearer-session auth на JWT как побочный рефакторинг.
- Не добавляй refresh tokens, token expiry или session rotation без явной задачи.
- Не заменяй Gradle на Maven или Flyway на Hibernate schema generation.
- Не возвращай JPA entities напрямую через API.
- Не редактируй `node_modules/`, `backend/build/`, `.gradle/`, Vite build output или generated files.
- Не коммить `.env`, secrets, credentials, IDE metadata или данные БД.
- Не делай несвязанные рефакторинги.

## Definition of done

Задача завершена, когда:
- реализовано запрошенное поведение;
- backend и/или frontend успешно собираются;
- security boundaries и ownership checks сохранены;
- изменения схемы оформлены новой Flyway migration;
- новые API-контракты используют DTO и validation, где это уместно;
- новые UI-строки добавлены в обе локали;
- `.env.example` и README обновлены, если изменился setup;
- в diff нет secrets, generated output и несвязанных изменений.
