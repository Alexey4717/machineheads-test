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
    display: block;
    margin-bottom: ${token.marginLG}px !important;
    color: ${token.colorTextHeading};
    font-size: ${token.fontSizeHeading2}px;
    font-weight: ${token.fontWeightStrong};
    line-height: ${token.lineHeightHeading2};
  `,
  fallback: css`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 160px;
    background: transparent;
  `,
}));
