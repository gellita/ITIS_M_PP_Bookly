create
extension if not exists pgcrypto;

create table users
(
    id            uuid primary key      default gen_random_uuid(),
    username      varchar(64)  not null unique,
    email         varchar(160) not null unique,
    password_hash varchar(255) not null,
    display_name  varchar(120) not null,
    created_at    timestamptz  not null default now()
);

create table books
(
    id          bigserial primary key,
    title       varchar(240) not null,
    author      varchar(180) not null,
    description text         not null,
    created_at  timestamptz  not null default now()
);

create table user_books
(
    id          bigserial primary key,
    user_id     uuid        not null references users (id) on delete cascade,
    book_id     bigint      not null references books (id) on delete cascade,
    user_rating integer     not null check (user_rating between 1 and 5),
    review      text        not null,
    created_at  timestamptz not null default now(),
    updated_at  timestamptz not null default now(),
    constraint uq_user_books_user_book unique (user_id, book_id)
);

create table auth_sessions
(
    id         bigserial primary key,
    token      varchar(80) not null unique,
    user_id    uuid        not null references users (id) on delete cascade,
    created_at timestamptz not null default now()
);

create index idx_user_books_user_id on user_books (user_id);
create index idx_user_books_book_id on user_books (book_id);
create index idx_auth_sessions_token on auth_sessions (token);
