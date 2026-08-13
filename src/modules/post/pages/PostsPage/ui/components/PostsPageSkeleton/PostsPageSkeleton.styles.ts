import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ token, css }) => ({
  root: css`
    display: flex;
    flex-direction: column;
    gap: ${token.marginXS}px;
  `,
  header: css`
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(0, 1.2fr) minmax(0, 1.5fr);
    gap: ${token.margin}px;
    padding: ${token.paddingSM}px ${token.padding}px;
  `,
  card: css`
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(0, 1.2fr) minmax(0, 1.5fr);
    gap: ${token.margin}px;
    align-items: center;
    padding: ${token.padding}px;
    border: 1px solid ${token.colorBorderSecondary};
    border-radius: ${token.borderRadiusLG}px;
    background: ${token.colorBgContainer};
  `,
  cell: css`
    min-width: 0;
  `,
}));
