import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ token, css }) => ({
  empty: css`
    padding: ${token.paddingXL}px ${token.padding}px;
  `,
}));
