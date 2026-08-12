import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ token, css }) => ({
  top: css`
    display: flex;
    flex-direction: column;
    gap: ${token.marginSM}px;
    margin-bottom: ${token.margin}px;
  `,
  header: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${token.margin}px;
  `,
  actions: css`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: ${token.marginSM}px;
  `,
  title: css`
    margin: 0 !important;
  `,
}));
