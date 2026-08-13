import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ token, css }) => ({
  card: css`
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(0, 1.2fr) minmax(0, 1.5fr);
    gap: ${token.margin}px;
    align-items: center;
    padding: ${token.padding}px;
    border: 1px solid ${token.colorBorderSecondary};
    border-radius: ${token.borderRadiusLG}px;
    background: ${token.colorBgContainer};
    color: inherit;
    text-decoration: none;
    transition:
      border-color ${token.motionDurationMid},
      box-shadow ${token.motionDurationMid};

    &:hover {
      border-color: ${token.colorPrimaryBorder};
      box-shadow: ${token.boxShadowTertiary};
    }
  `,
  cell: css`
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
}));
