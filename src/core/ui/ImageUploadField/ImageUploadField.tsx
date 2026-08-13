import { type ReactNode, useEffect, useRef } from 'react';

import { PlusOutlined } from '@ant-design/icons';
import { Form, Upload } from 'antd';
import type { FormItemProps, Rule } from 'antd/es/form';
import type { NamePath } from 'antd/es/form/interface';
import type {
  UploadChangeParam,
  UploadFile,
  UploadProps,
} from 'antd/es/upload/interface';

import { useStyles } from './ImageUploadField.styles';

function isBlobObjectUrl(url: string | undefined): url is string {
  return url != null && url.startsWith('blob:');
}

function collectBlobObjectUrls(fileList: UploadFile[] | undefined): string[] {
  const urls: string[] = [];

  for (const file of fileList ?? []) {
    const preview = file.thumbUrl ?? file.url;
    if (isBlobObjectUrl(preview)) {
      urls.push(preview);
    }
  }

  return urls;
}

function ensurePreviewUrl(file: UploadFile): UploadFile {
  if (file.thumbUrl != null || file.url != null) {
    return {
      ...file,
      status: 'done',
    };
  }

  if (file.originFileObj instanceof Blob) {
    return {
      ...file,
      status: 'done',
      thumbUrl: URL.createObjectURL(file.originFileObj),
    };
  }

  return {
    ...file,
    status: 'done',
  };
}

function getImageFileList(info: UploadChangeParam<UploadFile>): UploadFile[] {
  return info.fileList.slice(-1).map(ensurePreviewUrl);
}

interface ImageUploadControlProps extends Omit<
  UploadProps,
  'listType' | 'beforeUpload' | 'fileList' | 'children'
> {
  fileList?: UploadFile[];
  maxCount: number;
  testId: string;
  className?: string;
}

/**
 * Контролируемый Upload: кнопка «Загрузить» и превью завязаны на один и тот же
 * `fileList` от Form.Item. Двойной кадр на remove (leave-motion + select)
 * дополнительно гасится CSS в `ImageUploadField.styles`.
 */
const ImageUploadControl = ({
  fileList,
  maxCount,
  testId,
  className,
  disabled,
  accept,
  onChange,
  onRemove,
}: ImageUploadControlProps) => {
  const list = fileList ?? [];

  return (
    <Upload
      listType="picture-card"
      accept={accept}
      maxCount={maxCount}
      beforeUpload={() => false}
      disabled={disabled}
      fileList={list}
      onChange={onChange}
      onRemove={onRemove}
      className={className}
      data-testid={testId}
    >
      {list.length >= maxCount ? null : (
        <div>
          <PlusOutlined />
          <div>Загрузить</div>
        </div>
      )}
    </Upload>
  );
};

export interface ImageUploadFieldProps {
  name: NamePath;
  label?: ReactNode;
  rules?: Rule[];
  testId: string;
  tip?: ReactNode;
  accept?: string;
  maxCount?: number;
  removeFlagName?: NamePath;
  help?: FormItemProps['help'];
  extra?: FormItemProps['extra'];
  required?: boolean;
  validateStatus?: FormItemProps['validateStatus'];
  className?: string;
  disabled?: boolean;
}

/**
 * Поле формы для загрузки одного изображения: antd `Form.Item` + `Upload`
 * в режиме `picture-card`, без автозагрузки на сервер.
 *
 * Значение поля — `UploadFile[]` (`valuePropName="fileList"`,
 * `getValueFromEvent` оставляет только последний файл со `status: 'done'`
 * и локальным `thumbUrl` через `URL.createObjectURL`).
 * Существующее url-превью задаётся через `initialValues` формы
 * (элемент списка с `url` / `thumbUrl`).
 *
 * @param props.name - Имя поля формы (`NamePath`); значение — `UploadFile[]`.
 * @param props.label - Подпись `Form.Item`.
 * @param props.rules - Правила валидации antd Form.
 * @param props.testId - Атрибут `data-testid` на `Upload` (обязателен).
 * @param props.tip - Подсказка под полем (styled tip). Если задан `extra`,
 *   используется `extra` вместо `tip`.
 * @param props.accept - MIME / extension filter для `Upload`; по умолчанию `image/*`.
 * @param props.maxCount - Максимум файлов в списке; по умолчанию `1`.
 *   При достижении лимита кнопка «Загрузить» скрывается.
 * @param props.removeFlagName - Имя скрытого boolean-поля формы: `true` при очистке
 *   списка / remove, `false` при выборе нового файла (как `removeAvatar` у автора).
 *   Если не задан — синхронизация флага не выполняется.
 * @param props.help - Проп `help` у `Form.Item`.
 * @param props.extra - Проп `extra` у `Form.Item`; имеет приоритет над `tip`.
 * @param props.required - Проп `required` у `Form.Item` (визуальная звёздочка).
 * @param props.validateStatus - Проп `validateStatus` у `Form.Item`.
 * @param props.className - CSS-класс на `Form.Item`.
 * @param props.disabled - Блокирует `Upload`.
 *
 * @remarks
 * **Значение:** всегда массив `UploadFile[]`, не одиночный `File`/`string`.
 *
 * **`beforeUpload`:** возвращает `false` — файл не уходит на сервер из компонента;
 * загрузка/отправка — ответственность саги/API при submit формы.
 *
 * **`removeFlagName`:** при `onChange` флаг = `nextList.length === 0`;
 * при `onRemove` — сразу `true`. Нужен, когда бэкенд отличает «оставить старое»
 * от «удалить аватар/превью».
 *
 * @example
 * ```tsx
 * // Аватар автора с флагом удаления
 * <ImageUploadField
 *   name="avatar"
 *   label="Аватар"
 *   testId="author-avatar"
 *   tip="JPG/PNG, один файл"
 *   removeFlagName="removeAvatar"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Превью поста
 * <ImageUploadField
 *   name="previewPicture"
 *   label="Превью"
 *   testId="post-preview-picture"
 *   tip="JPG/PNG, один файл"
 * />
 * ```
 */
export const ImageUploadField = ({
  name,
  label,
  rules,
  testId,
  tip,
  accept = 'image/*',
  maxCount = 1,
  removeFlagName,
  help,
  extra,
  required,
  validateStatus,
  className,
  disabled,
}: ImageUploadFieldProps) => {
  const form = Form.useFormInstance();
  const { styles } = useStyles();
  const fileList = Form.useWatch(name, form) as UploadFile[] | undefined;
  const blobUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    const nextUrls = collectBlobObjectUrls(fileList);

    for (const prevUrl of blobUrlsRef.current) {
      if (!nextUrls.includes(prevUrl)) {
        URL.revokeObjectURL(prevUrl);
      }
    }

    blobUrlsRef.current = nextUrls;
  }, [fileList]);

  useEffect(() => {
    return () => {
      for (const url of blobUrlsRef.current) {
        URL.revokeObjectURL(url);
      }
      blobUrlsRef.current = [];
    };
  }, []);

  const syncRemoveFlag = (nextList: UploadFile[]) => {
    if (removeFlagName == null) {
      return;
    }

    form.setFieldValue(removeFlagName, nextList.length === 0);
  };

  const tipNode =
    tip != null ? <span className={styles.tip}>{tip}</span> : null;

  return (
    <Form.Item
      name={name}
      label={label}
      rules={rules}
      valuePropName="fileList"
      getValueFromEvent={getImageFileList}
      help={help}
      extra={extra ?? tipNode}
      required={required}
      validateStatus={validateStatus}
      className={className}
    >
      <ImageUploadControl
        accept={accept}
        maxCount={maxCount}
        disabled={disabled}
        testId={testId}
        className={styles.upload}
        onChange={
          removeFlagName != null
            ? (info) => {
                syncRemoveFlag(getImageFileList(info));
              }
            : undefined
        }
        onRemove={
          removeFlagName != null
            ? () => {
                form.setFieldValue(removeFlagName, true);
                return true;
              }
            : undefined
        }
      />
    </Form.Item>
  );
};
