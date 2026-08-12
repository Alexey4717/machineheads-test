import type { ReactNode } from 'react';
import { useHistory } from 'react-router-dom';

import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Result, Skeleton, Typography } from 'antd';

import { useStyles } from './Page.styles';

/** Статус ошибки для antd `Result` (HTTP-коды или общий `'error'`). */
export type PageErrorStatus = 403 | 404 | 500 | 'error';

/** Описание ошибки страницы для режима `Result`. */
export interface PageError {
  status?: PageErrorStatus;
  title?: string;
  subtitle?: string;
  extra?: ReactNode;
}

export interface PageProps {
  title: string;
  /** Путь для кнопки «назад» слева от заголовка. */
  backTo?: string;
  extra?: ReactNode;
  actions?: ReactNode;
  loading?: boolean;
  skeleton?: ReactNode;
  error?: PageError | null;
  children?: ReactNode;
}

/**
 * Оболочка страницы админки: шапка (заголовок + optional `extra`/`actions`) и контент
 * либо полноэкранный antd `Result` при ошибке.
 *
 * **Layout без ошибки:**
 * 1. Верхняя строка — опциональный `backTo` + `title` слева, опциональный `extra` справа.
 * 2. Под ней — опциональный блок `actions`.
 * 3. Ниже — при `loading` скелетон, иначе `children`.
 *
 * @param props.title - Заголовок страницы (`Typography.Title` level 3) слева в шапке.
 * @param props.backTo - Если задан — кнопка со стрелкой «назад» слева от заголовка;
 *   по клику `history.push(backTo)`.
 * @param props.extra - Правая часть шапки в одной строке с заголовком (компактные элементы:
 *   тема, ссылка, одиночная кнопка). Не для ряда кнопок управления — для них `actions`.
 * @param props.actions - Панель действий под строкой заголовка (создать, фильтры и т.п.),
 *   отдельная строка с flex-wrap.
 * @param props.loading - Режим загрузки: вместо `children` показывается `skeleton`
 *   или дефолтный `<Skeleton active />`. Шапка остаётся видимой. Игнорируется, если задан `error`.
 * @param props.skeleton - Кастомный скелетон при `loading`; иначе antd `Skeleton` с `active`.
 * @param props.error - Ошибка страницы. Если задано, вместо layout рендерится antd `Result`
 *   (`status` / `title` / `subtitle` / `extra` из объекта; шапка и контент не показываются).
 *   `null` или отсутствие prop — ошибки нет.
 * @param props.children - Основной контент; только когда нет `error` и `loading === false`.
 *
 * @remarks
 * **`extra` vs `actions`:** `extra` — в одной строке с заголовком справа;
 * `actions` — отдельная строка под заголовком для кнопок и контролов страницы.
 *
 * @example
 * ```tsx
 * // Список с действиями
 * <Page title="Посты" actions={<Button type="primary">Создать</Button>}>
 *   <PostsTable />
 * </Page>
 * ```
 *
 * @example
 * ```tsx
 * // Назад на деталку
 * <Page title="Редактирование" backTo={getPath(PATHS.TAG_DETAIL, { id })}>
 *   <TagForm />
 * </Page>
 * ```
 *
 * @example
 * ```tsx
 * // Ошибка
 * <Page
 *   title="Пост"
 *   error={{ status: 404, title: 'Не найдено', subtitle: 'Пост удалён или не существует' }}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Загрузка с кастомным скелетоном
 * <Page title="Авторы" loading skeleton={<AuthorsPageSkeleton />}>
 *   <AuthorsTable />
 * </Page>
 * ```
 */
export const Page = ({
  title,
  backTo,
  extra,
  actions,
  loading = false,
  skeleton,
  error,
  children,
}: PageProps) => {
  const { styles } = useStyles();
  const history = useHistory();

  if (error) {
    return (
      <Result
        status={error.status ?? 'error'}
        title={error.title ?? 'Ошибка'}
        subTitle={error.subtitle}
        extra={error.extra}
      />
    );
  }

  return (
    <div>
      <div className={styles.top}>
        <div className={styles.header}>
          <div className={styles.titleRow}>
            {backTo ? (
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                className={styles.back}
                aria-label="Назад"
                onClick={() => history.push(backTo)}
              />
            ) : null}
            <Typography.Title level={3} className={styles.title}>
              {title}
            </Typography.Title>
          </div>
          {extra}
        </div>
        {actions ? <div className={styles.actions}>{actions}</div> : null}
      </div>

      {loading ? (skeleton ?? <Skeleton active />) : children}
    </div>
  );
};
