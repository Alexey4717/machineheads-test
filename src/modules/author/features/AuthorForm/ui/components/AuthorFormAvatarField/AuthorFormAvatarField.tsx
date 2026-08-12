import { PlusOutlined } from '@ant-design/icons';
import { Form, Upload } from 'antd';
import type { UploadChangeParam, UploadFile } from 'antd/es/upload/interface';

import { useStyles } from './AuthorFormAvatarField.styles';

function getAvatarFileList(info: UploadChangeParam<UploadFile>): UploadFile[] {
  const latest = info.fileList.slice(-1);
  return latest.map((file) => ({
    ...file,
    status: 'done' as const,
  }));
}

/**
 * Upload аватара + скрытое `removeAvatar`.
 * При очистке списка — `removeAvatar=true`; при новом файле — `false`.
 */
export const AuthorFormAvatarField = () => {
  const form = Form.useFormInstance();
  const { styles } = useStyles();
  const fileList = Form.useWatch('avatar', form) as UploadFile[] | undefined;

  const syncRemoveAvatar = (nextList: UploadFile[]) => {
    form.setFieldValue('removeAvatar', nextList.length === 0);
  };

  return (
    <Form.Item
      name="avatar"
      label="Аватар"
      valuePropName="fileList"
      getValueFromEvent={getAvatarFileList}
      extra={<span className={styles.tip}>JPG/PNG, один файл</span>}
    >
      <Upload
        listType="picture-card"
        accept="image/*"
        maxCount={1}
        beforeUpload={() => false}
        onChange={(info) => {
          syncRemoveAvatar(getAvatarFileList(info));
        }}
        onRemove={() => {
          form.setFieldValue('removeAvatar', true);
          return true;
        }}
        className={styles.upload}
        data-testid="author-avatar"
      >
        {(fileList?.length ?? 0) >= 1 ? null : (
          <div>
            <PlusOutlined />
            <div>Загрузить</div>
          </div>
        )}
      </Upload>
    </Form.Item>
  );
};
