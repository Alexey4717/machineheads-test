import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ token, css }) => ({
  form: css`
    width: 100%;
    max-width: 360px;
  `,
  alert: css`
    margin-bottom: ${token.margin}px;
  `,
}));
