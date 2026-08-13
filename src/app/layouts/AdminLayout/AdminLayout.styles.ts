import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ token, css }) => ({
  layout: css`
    min-height: 100vh;
  `,
  logo: css`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 64px;
    padding-inline: ${token.padding}px;
    overflow: hidden;
    color: ${token.colorWhite};
    font-weight: ${token.fontWeightStrong};
    white-space: nowrap;
  `,
  logoCollapsed: css`
    justify-content: center;
    padding-inline: 0;
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
  fallback: css`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 240px;
    background: ${token.colorBgLayout};
  `,
}));
