import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ token, css }) => ({
  author: css`
    display: inline-flex;
    align-items: center;
    gap: ${token.marginXS}px;
  `,
}));
