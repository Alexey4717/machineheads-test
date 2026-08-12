import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ token, css }) => ({
  header: css`
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(0, 1.2fr) 100px minmax(
        0,
        1.2fr
      );
    gap: ${token.margin}px;
    padding: ${token.paddingSM}px ${token.padding}px;
    color: ${token.colorTextSecondary};
    font-size: ${token.fontSizeSM}px;
    font-weight: ${token.fontWeightStrong};
  `,
}));
