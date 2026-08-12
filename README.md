## Запуск проекта

```
Версия pnpm — 11.9.0
Версия node — 22+
pnpm install — устанавливаем зависимости
pnpm dev — запуск frontend в dev режиме
```

Скопируйте `.env.example` в `.env` при необходимости. В dev API ходит через proxy `/api` → `rest-test.machineheads.ru`.

---

## Скрипты

- `pnpm dev` — Vite dev server
- `pnpm build` — typecheck + production build
- `pnpm preview` — превью production-сборки
- `pnpm typecheck` — проверка TypeScript
- `pnpm lint` — ESLint
- `pnpm lint:fix` — ESLint с автофиксом
- `pnpm format` — Prettier
- `pnpm format:check` — проверка Prettier
- `pnpm prepare` — husky hooks

---

## Архитектура проекта

Упрощённая модульная схема: `app` / `modules` / `core`.

- `app` — композиция приложения (providers, router, store, layouts, themes)
- `modules` — домены `auth`, `post`, `author`, `tag` (api, model, features, pages, module.ts)
- `core` — общий слой (axios, cookies, ui, config)

Правила импортов (зависимости только вниз):

- `core` — не импортирует из `app` и `modules`
- `modules` — импортируют из `core` и public API других modules (`index.ts`); не из `app`
- `app` — импортирует из `core` и `modules`; зависимости из `app` не уходят вниз в `modules` / `core`
- `main.tsx` — импортирует только из `app`
- Barrel (`index.ts`) — только у модулей (`modules/<name>/index.ts`); в `core` и `app` — прямые импорты из файлов

Эти правила импортов проверяет ESLint (`eslint-plugin-boundaries` + `no-restricted-imports` в `eslint.config.js`).

Страницы экспортируются лениво через `*.async.tsx` (`React.lazy`). Redux-модули подключаются через `redux-dynamic-modules`.

---

## Стили

css-in-js на `antd-style`, без CSS Modules и глобальных css (кроме `antd/dist/reset.css`).

- Стили компонента — в `Component.styles.ts` рядом с компонентом: `createStyles(({ token, css }) => ({ ... }))`
- В компоненте: `const { styles } = useStyles();` и `className={styles.xxx}`
- Значения — из Design Tokens (`token.colorBgContainer`, `token.margin`, ...), инлайновый `style={{ ... }}` не используем
- Light / dark тема — `ConfigProvider` + `algorithm` в `app/styles/theme.ts`; `token` в стилях подхватывает тему автоматически

---

## API

Базовый URL: `VITE_API_BASE_URL` (в dev обычно `/api`).

Документация: [REST docs](http://rest-test.machineheads.ru/documentation/)

Основные эндпоинты:

- Auth: `POST /auth/token-generate`, `POST /auth/token-refresh`
- Posts / Authors / Tags: `/manage/*` (CRUD)

Токены хранятся в cookies (`js-cookie`). Access передаётся как `Bearer` в interceptor; при 401 выполняется single-flight refresh.

---

## Демо-доступ (тестовый API)

Для проверки логина:

- E-mail: `test@test.ru`
- Пароль: `khro2ij3n2730`

Креды не хардкодить в коде приложения.

---

## Auth

- Логин: multipart `email` + `password` → access/refresh tokens
- Refresh: multipart `refresh_token`
- Logout: очистка cookies + редирект на `/login`
- Guards: без сессии → login; на login с сессией → `/posts`
