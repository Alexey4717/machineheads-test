import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ token, css }) => ({
  layout: css`
    min-height: 100vh;
  `,
  logo: css`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 64px;
    padding-inline: ${token.paddingSM}px;
    color: ${token.colorWhite};
    font-weight: ${token.fontWeightStrong};
    text-align: center;
  `,
  header: css`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: ${token.margin}px;
    padding-inline: ${token.paddingLG}px;
    background: ${token.colorBgContainer};
    border-bottom: 1px solid ${token.colorBorderSecondary};
  `,
  content: css`
    margin: ${token.marginLG}px;
  `,
}));
