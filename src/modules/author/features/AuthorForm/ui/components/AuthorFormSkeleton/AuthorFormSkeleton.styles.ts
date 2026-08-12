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
  textarea: css`
    height: 88px;
  `,
  avatar: css`
    width: 104px;
    height: 104px;
  `,
  submit: css`
    max-width: 120px;
  `,
}));
