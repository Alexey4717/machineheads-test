import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ token, css }) => ({
  root: css`
    border: 1px solid ${token.colorBorderSecondary};
    border-radius: ${token.borderRadiusLG}px;
    overflow: hidden;
  `,
  row: css`
    display: grid;
    grid-template-columns: 140px minmax(0, 1fr);
    gap: ${token.margin}px;
    align-items: center;
    padding: ${token.padding}px ${token.paddingLG}px;
    border-bottom: 1px solid ${token.colorBorderSecondary};

    &:last-child {
      border-bottom: none;
    }
  `,
  label: css`
    max-width: 100px;
  `,
}));
