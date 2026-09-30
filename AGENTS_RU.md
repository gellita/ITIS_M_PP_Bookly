# AGENTS.md — русская версия

## Обзор проекта

Bookly — полнофункциональное веб-приложение для ведения книжной полки. Пользователи могут регистрироваться и входить в систему, просматривать общий каталог, вести личную полку, ставить оценки и писать отзывы о книгах, а также просматривать публичные профили читателей.

Репозиторий содержит:

- `frontend/` — одностраничное React-приложение.
- `backend/` — REST API на Spring Boot.
- PostgreSQL — запускается через Docker Compose.

Изменения должны быть точечными и соответствовать существующей архитектуре. Не добавляй новый фреймворк, модель аутентификации, роутер, библиотеку управления состоянием или другой подход к хранению данных, если этого прямо не требует задача.

## Структура репозитория

```text
.
├── backend/
│   ├── src/main/java/ru/kpfu/itis/
│   │   ├── config/       # Security, auth filter, OpenAPI, обработка исключений
│   │   ├── controller/   # REST-контроллеры
│   │   ├── dto/          # DTO запросов и ответов
│   │   ├── entity/       # JPA-сущности
│   │   ├── repository/   # Spring Data JPA репозитории
│   │   └── service/      # Бизнес-логика и транзакции
│   └── src/main/resources/
│       ├── application.yaml
│       └── db/migration/ # Миграции Flyway
├── frontend/
│   └── src/
│       ├── api/          # HTTP-клиент и API-функции
│       ├── components/   # Переиспользуемые UI-компоненты
│       ├── i18n/         # Контекст локализации
│       ├── locales/      # en.json / ru.json
│       ├── pages/        # Основные страницы
│       ├── store/        # BooklyContext
│       ├── App.jsx       # Клиентская маршрутизация
│       └── styles.css
├── docker-compose.yml
├── .env.example
└── README.md
```

Не редактируй и не коммить сгенерированные/сборочные директории, такие как `backend/build/`, `backend/bin/`, `backend/.gradle/`, `frontend/node_modules/` или результат сборки Vite, если задача явно не связана со сгенерированными артефактами.

## Технологический стек

### Backend

- Java 21
- Spring Boot 3.3.5
- Gradle Wrapper
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
- React Context для общего состояния
- Собственная маршрутизация через History API; React Router не используется

### Runtime

- PostgreSQL 16 Alpine
- Node 22 Alpine
- Eclipse Temurin Java 21
- Docker Compose

## Архитектура

### Backend

Следуй существующему потоку:

```text
HTTP request
  -> Controller
  -> Service
  -> Repository
  -> JPA / PostgreSQL
```

Правила:

- Контроллеры отвечают за HTTP-маршруты, валидацию, извлечение аутентифицированного пользователя и делегирование вызовов.
- Сервисы содержат бизнес-логику и границы транзакций.
- Репозитории содержат запросы к хранилищу данных.
- DTO определяют контракт API.
- JPA-сущности нельзя напрямую возвращать через REST endpoints.
- Не обращайся к репозиториям напрямую из контроллеров.

Существующие домены:

- Аутентификация: `AuthController`, `AuthService`, `AuthSessionRepository`, `SessionAuthenticationFilter`
- Книги/полка: `BookController`, `BookService`, `BookRepository`, `UserBookRepository`
- Публичные пользователи/профили: `UserController`, `UserService`, `UserRepository`, `UserBookRepository`

### Frontend

`frontend/src/App.jsx` управляет навигацией через `window.history.pushState()` и событие `popstate`.

Текущие маршруты:

- `/` — главная страница
- `/signin` — вход / регистрация
- `/readers` — список публичных пользователей
- `/readers/{id}` — публичный профиль пользователя
- `/shelf` — книжная полка аутентифицированного пользователя

Не добавляй React Router ради небольшого изменения маршрутов, если это явно не требуется.

`BooklyContext` — центральное состояние аутентифицированного приложения. В нём хранятся, например, bearer token, текущий пользователь, каталог, полка, состояние загрузки и ошибки API.

Токен аутентификации хранится в `localStorage` под ключом `booklyToken`.

HTTP-запросы должны идти через `frontend/src/api/client.js` и доменные API-модули, а не через прямые вызовы `fetch()` внутри page-компонентов, если нет чёткой причины сделать иначе в рамках конкретной задачи.

## Аутентификация и безопасность

Проект **не использует JWT**.

Аутентификация работает через непрозрачные случайные bearer-токены:

1. При входе или регистрации создаётся запись `AuthSession`.
2. `AuthService` генерирует случайный токен.
3. Токен хранится в PostgreSQL в таблице `auth_sessions`.
4. Frontend сохраняет его в `localStorage`.
5. Запросы отправляют `Authorization: Bearer <token>`.
6. `SessionAuthenticationFilter` определяет пользователя по токену и устанавливает аутентифицированного principal.
7. Logout удаляет сессию из базы данных.

Текущие auth-сессии не имеют срока действия и refresh-токенов. Не добавляй JWT, refresh-токены, автоматическую ротацию или истечение сессии, если задача прямо не меняет модель аутентификации.

Пароли хешируются через `BCryptPasswordEncoder`. Никогда не сохраняй, не возвращай и не логируй пароль в открытом виде.

Текущие публичные маршруты включают:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users/**`
- `GET /api/books`
- Swagger / OpenAPI маршруты

Остальные API-маршруты требуют аутентификации.

CORS сейчас разрешает `http://localhost:5173` и `http://localhost:3000`.

CSRF-защита сейчас отключена, потому что аутентификация выполняется через bearer-токен, который явно передаётся в заголовке `Authorization`, а не через cookie-based authentication. Если аутентификация будет переведена на cookie, нужно пересмотреть CSRF-защиту.

При добавлении endpoint явно определяй, должен ли он быть публичным или требовать аутентификацию, и меняй `SecurityConfig` только при необходимости.

### Защита от XSS

Поскольку auth-токен хранится в `localStorage`, защита от XSS особенно важна.

- Считай display name, данные книг, отзывы и другие пользовательские строки недоверенным вводом.
- Предпочитай обычный JSX-рендеринг текста — React экранирует его по умолчанию.
- Не используй `dangerouslySetInnerHTML` для пользовательского контента, если задача явно не требует доверенного HTML и не реализована санация.
- Не выполняй пользовательский HTML или JavaScript.
- Не логируй bearer-токены.

## Соглашения API

Корень backend API: `/api`.

Основные endpoints:

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

Для новых или изменяемых API-контрактов:

- используй DTO из `dto/req` и `dto/resp`;
- применяй Jakarta Bean Validation там, где это уместно;
- выполняй валидацию как можно ближе к границе API;
- используй `ApiExceptionHandler` для единообразных ответов с ошибками;
- сохраняй существующий стиль OpenAPI-аннотаций.

## База данных и Flyway

Изменения схемы управляются через Flyway.

Миграции, отслеживаемые Git в предоставленном snapshot репозитория:

- `V1__init_bookly_schema.sql`
- `V2__demo_data.sql`

Основные таблицы, отслеживаемые схемой:

- `users`
- `books`
- `user_books`
- `auth_sessions`

Правила:

- Никогда не изменяй уже применённую миграцию для нового изменения схемы.
- Для изменения схемы добавляй новую versioned-миграцию со следующим доступным номером.
- Согласовывай ограничения БД с валидацией приложения.
- Не удаляй persistent Docker volumes без явного запроса.

Существующие ограничения включают уникальные username/email, одну запись полки на `(user_id, book_id)` и рейтинг в диапазоне `1..5`.

Демо-пользователи и данные полки создаются через `V2__demo_data.sql`. В README указано, что пароль для seeded-пользователей — `password`.

## Логика книг и полки

- `Book` представляет общую запись книги в каталоге.
- `UserBook` представляет запись книги на полке конкретного пользователя и хранит его рейтинг/отзыв.

`BookService.addToShelf()` поддерживает два варианта:

- существующая книга из каталога через `bookId`, или
- новая книга, создаваемая по title, author и description.

Пользователь не может дважды добавить одну и ту же книгу из каталога на свою полку.

Обновление и удаление элементов полки ограничены владельцем через repository-запросы вроде `findByIdAndUser(...)`. Сохраняй эту серверную проверку владельца.

Средний рейтинг книги в каталоге рассчитывается по рейтингам `UserBook` и возвращается в `BookResponse`.

## Локализация

Frontend UI поддерживает английский и русский языки через собственный i18n context.

Файлы переводов:

- `frontend/src/locales/en.json`
- `frontend/src/locales/ru.json`

При добавлении видимого UI-текста добавляй соответствующие ключи в оба locale-файла вместо жёстко заданной строки на одном языке в JSX.

## Конфигурация окружения

Корневой `.env.example` описывает переменные, включая:

```text
POSTGRES_DB
POSTGRES_USER
POSTGRES_PASSWORD
VITE_API_URL
```

URL frontend API по умолчанию в Docker Compose:

```text
http://localhost:8080/api
```

Никогда не коммить реальные секреты или credentials. Храни `.env` локально и обновляй `.env.example`, если добавляется новая обязательная переменная.

## Команды разработки

### Полный стек через Docker

Из корня репозитория:

```bash
cp .env.example .env
docker compose up --build
```

Сервисы:

- frontend: `http://localhost:5173`
- backend: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- PostgreSQL: `localhost:5432`

Остановка сервисов:

```bash
docker compose down
```

Сбрасывай локальную БД только намеренно:

```bash
docker compose down -v
```

## Зависимости

Не добавляй новые зависимости, если текущий стек позволяет чисто решить задачу без них.

Если зависимость действительно нужна:

- объясни, почему текущих зависимостей недостаточно;
- обнови `backend/build.gradle` или `frontend/package.json`;
- позволяй npm обновлять `package-lock.json` обычными package-командами; не редактируй lock-файл вручную;
- проверь соответствующую сборку.

## Рабочий процесс агента

Перед изменениями:

1. Изучи соответствующий controller/service/repository или page/context/API module.
2. Определи существующий data flow и security boundary.
3. Предпочитай минимальное изменение в рамках существующих паттернов.
4. Проверь, требует ли изменение также обновления DTO, Flyway migration, переводов, security rule или документации.

Для backend-функций, где применимо, придерживайся порядка:

1. DTO
2. Controller mapping
3. Service logic
4. Repository query, только если нужен
5. Flyway migration, если меняется схема
6. Security configuration, если меняется видимость endpoint
7. OpenAPI annotations

Для frontend-функций, где применимо, придерживайся порядка:

1. API function
2. Shared state только при необходимости
3. Изменение page/component
4. Английские и русские locale strings
5. Существующие routing conventions

## Не делай это без прямого указания

- Не заменяй bearer-session authentication на JWT.
- Не добавляй refresh tokens, session rotation или token expiry как побочный рефакторинг.
- Не подключай React Router ради небольшого изменения маршрутов.
- Не заменяй React Context на Redux, Zustand, MobX или другую state-библиотеку.
- Не заменяй Gradle на Maven.
- Не заменяй Flyway на Hibernate schema generation.
- Не возвращай JPA entities напрямую через API.
- Не обращайся к repositories напрямую из controllers.
- Не редактируй уже применённые Flyway migrations ради нового изменения схемы.
- Не хардкодь secrets или production credentials.
- Не удаляй demo data без причины, связанной с задачей.
- Не удаляй Docker volumes как часть обычного build/run workflow.
- Не коммить generated build output, IDE metadata, локальный `.env` или данные БД.

## Критерии завершения задачи

Обычная code-задача считается завершённой, когда выполнены все применимые пункты:

- запрошенное поведение реализовано;
- существующая архитектура и модель аутентификации сохранены, если задача специально их не меняет;
- backend успешно собирается;
- production-сборка frontend проходит успешно;
- изменения схемы оформлены новой Flyway migration;
- новые API-поля/endpoints используют DTO и validation там, где это уместно;
- правила доступа к endpoint заданы осознанно;
- новые видимые UI-строки добавлены и в английский, и в русский locale-файл;
- `.env.example` и README обновлены, если изменился setup;
- в изменениях нет secrets, generated output, несвязанных рефакторингов или случайных команд, способных удалить данные.
