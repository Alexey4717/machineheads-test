import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  root: css`
    .ant-descriptions-view > table {
      table-layout: fixed !important;
    }

    .ant-descriptions-item-label {
      width: 25%;
    }

    .ant-descriptions-item-content {
      width: 75%;
    }
  `,
}));
