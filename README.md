# Тестовое задание для Machineheads: админ-панель на React

Админ-панель для управления постами, авторами и тегами.

## Демо-доступ

Тестовые креды для входа в приложение:

- **E-mail:** `test@test.ru`
- **Password:** `khro2ij3n2730`

- [API](https://rest-test.machineheads.ru/)
- [Документация](https://rest-test.machineheads.ru/documentation)

## Как запустить

Нужны Node 22+ и pnpm 11.9.0.

```bash
pnpm install
pnpm dev
```

Запросы идут на `/api` (same-origin). В dev Vite проксирует их на
`rest-test.machineheads.ru`, в проде на Vercel — rewrite в Build Output API.
При необходимости скопируйте `.env.example` в `.env`.

## Что сделано

- **Auth:** логин и логаут, JWT в cookies, refresh при 401, защита маршрутов.
- **Посты:** список с пагинацией из заголовков ответа (`X-Pagination-*`), полный
  CRUD, ошибки 422 по полям и системные ошибки в форме.
- **Авторы и теги:** полный CRUD.
- Обязательный стек задания плюс Ant Design, ленивые страницы и
  `redux-dynamic-modules`.
- **Тесты:** Vitest и Playwright, CI.
- **UX:** светлая и тёмная тема, сайдбар, модалки подтверждения, a11y.

## Стек

react, redux, redux-saga, react-router-dom, connected-react-router, TypeScript,
antd, redux-dynamic-modules.

## Архитектура

Приложение разбито на слои `app`, `modules` и `core`. Слой `app` собирает
providers, роутер, store и layouts. Вертикальные домены живут в `modules`:
`auth`, `post`, `author` и `tag`. Общий код (API-клиент, UI, конфиг) лежит в
`core`. Страницы подгружаются лениво (`React.lazy`), Redux-модули подключаются
через `redux-dynamic-modules`.
