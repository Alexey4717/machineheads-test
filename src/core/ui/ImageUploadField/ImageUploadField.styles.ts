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

    /*
     * antd picture-card remove: CSSMotion leave держит list-item в DOM,
     * а select («Загрузить») уже visible — оба кадра рядом.
     * 1) select скрыт, пока есть стабильный (не leave) preview;
     * 2) leave-контейнер сразу display:none — атомарный swap на кнопку.
     */
    &:has(
        .ant-upload-list-item-container:not(.ant-upload-animate-inline-leave)
          .ant-upload-list-item
      )
      .ant-upload-select {
      display: none !important;
    }

    .ant-upload-list-item-container.ant-upload-animate-inline-leave {
      display: none !important;
    }
  `,
  tip: css`
    margin-top: ${token.marginXXS}px;
    color: ${token.colorTextSecondary};
    font-size: ${token.fontSizeSM}px;
  `,
}));
