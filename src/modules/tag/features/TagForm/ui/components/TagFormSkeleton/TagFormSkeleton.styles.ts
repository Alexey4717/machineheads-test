import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ token, css }) => ({
  root: css`
    display: flex;
    flex-direction: column;
    gap: ${token.marginLG}px;
    width: 100%;
    max-width: 480px;
  `,
  field: css`
    display: flex;
    flex-direction: column;
    gap: ${token.marginXS}px;
  `,
  label: css`
    max-width: 120px;
  `,
  submit: css`
    max-width: 120px;
  `,
}));
