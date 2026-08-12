import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  fallback: css`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
  `,
}));
