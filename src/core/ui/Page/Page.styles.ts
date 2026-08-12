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
  titleRow: css`
    display: flex;
    align-items: center;
    gap: ${token.marginXS}px;
    min-width: 0;
  `,
  back: css`
    flex-shrink: 0;
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
