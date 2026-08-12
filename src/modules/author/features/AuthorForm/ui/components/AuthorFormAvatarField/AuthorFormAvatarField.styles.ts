import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ token, css }) => ({
  upload: css`
    .ant-upload-select {
      width: 104px !important;
      height: 104px !important;
    }

    .ant-upload-list-item-container {
      width: 104px !important;
      height: 104px !important;
    }
  `,
  tip: css`
    margin-top: ${token.marginXXS}px;
    color: ${token.colorTextSecondary};
    font-size: ${token.fontSizeSM}px;
  `,
}));
