import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ token, css }) => ({
  header: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${token.margin}px;
    margin-bottom: ${token.margin}px;
  `,
  title: css`
    margin: 0 !important;
  `,
}));
