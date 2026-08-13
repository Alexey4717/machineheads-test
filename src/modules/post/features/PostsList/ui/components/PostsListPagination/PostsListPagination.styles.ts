import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ token, css }) => ({
  root: css`
    margin-top: ${token.marginLG}px;
    display: flex;
    justify-content: flex-end;
  `,
}));
