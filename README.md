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
- `pnpm test` / `pnpm test:unit` — unit + integration (Vitest)
- `pnpm test:watch` — Vitest в watch-режиме
- `pnpm prepare` — husky hooks

---

## Тесты

Стек: **Vitest** + Testing Library + `redux-saga-test-plan` (jsdom).

- `data-testid` на интерактивных контролах: `<feature>_<type>_<name>` (например `loginForm_input_email`, `postsList_link_POST_DETAIL_1`). Контролы в RTL ищем через `getByTestId` / `findByTestId`, не через role / title / placeholder / label.
- Общий рендер: `componentRender` / `TestProvider` из `@/__test__/componentRender` (только в `*.test.ts(x)`).
- В production-сборке `data-testid` вырезается Vite-плагином (`config/plugins/vite-plugin-strip-data-testid.ts`).
- Playwright (позже) живёт в корневой `e2e/`, не в `src/__test__`.

```
pnpm test
```

---

## Архитектура проекта

Упрощённая модульная схема: `app` / `modules` / `core`.

- `app` — композиция приложения (providers, router, store, layouts, themes)
- `modules` — домены `auth`, `post`, `author`, `tag` (api, model, features, pages, module.ts)
- `core` — общий слой (axios, cookies, ui, config)

Внутри `features/` и `pages/` у каждой сущности разделы:

- `ui/` — только TSX (компоненты, `*.async.tsx`) и стили `*.styles.ts`
- `lib/` — утилиты, хуки, константы, локальные типы, схемы валидации форм (`*.rules.ts`); папку создаём, когда есть не-UI код

Правила импортов (зависимости только вниз):

- `core` — не импортирует из `app` и `modules`
- `modules` — импортируют из `core` и public API других modules (`index.ts`); не из `app`
- `app` — импортирует из `core` и `modules`; зависимости из `app` не уходят вниз в `modules` / `core`
- `main.tsx` — импортирует только из `app`
- Barrel (`index.ts`) — только у модулей (`modules/<name>/index.ts`); в `core` и `app` — прямые импорты из файлов

Эти правила импортов проверяет ESLint (`eslint-plugin-boundaries` + `no-restricted-imports` в `eslint.config.js`).

Страницы экспортируются лениво через `pages/.../ui/*.async.tsx` (`React.lazy`). Redux-модули подключаются через `redux-dynamic-modules`.

---

## Стили

css-in-js на `antd-style`, без CSS Modules и глобальных css (кроме `antd/dist/reset.css`).

- Стили компонента — в `Component.styles.ts` рядом с компонентом: `createStyles(({ token, css }) => ({ ... }))`
- В компоненте: `const { styles } = useStyles();` и `className={styles.xxx}`
- Значения — из Design Tokens (`token.colorBgContainer`, `token.margin`, ...), инлайновый `style={{ ... }}` не используем
- Light / dark тема — `ConfigProvider` + `algorithm` в `app/styles/theme.ts`; `token` в стилях подхватывает тему автоматически

---

## Формы и поля

- Формы — Ant Design `Form` / `Form.useForm()` (без RHF/zod). Значения формы локально в antd; в Redux — submit/loading/ошибки сервера.
- Валидация — фабрики в `src/core/lib/formRules/formRules.ts`; схемы фичи — в `features/<Feature>/lib/*.rules.ts`.
- UI формы — в `features/<Feature>/ui/`; текстовые поля — самозакрывающийся `TextField` (`src/core/ui/TextField/TextField.tsx`), `type` по умолчанию `text`; числа — `NumberField` (`src/core/ui/NumberField/NumberField.tsx`).
- Без `name` — controlled (`value`/`onChange`), например фильтры в Redux. Обязательны `testId` (`data-testid`) и `aria-label`, если нет видимого `label`.

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
