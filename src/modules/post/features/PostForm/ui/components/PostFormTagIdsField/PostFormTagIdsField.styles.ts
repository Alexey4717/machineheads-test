import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ token, css }) => ({
  alert: css`
    margin-bottom: ${token.margin}px;
  `,
}));
