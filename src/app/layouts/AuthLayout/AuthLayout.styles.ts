import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ token, css }) => ({
  layout: css`
    min-height: 100vh;
  `,
  content: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: ${token.paddingLG}px;
  `,
  title: css`
    margin-bottom: ${token.marginLG}px !important;
  `,
  fallback: css`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 160px;
    background: transparent;
  `,
}));
