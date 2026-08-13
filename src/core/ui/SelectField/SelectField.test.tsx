import { screen } from '@testing-library/react';
import { Form } from 'antd';
import { describe, expect, it } from 'vitest';

import { componentRender } from '@/__test__/componentRender';

import { SelectField } from './SelectField';

describe('SelectField', () => {
  it('прокидывает data-testid на интерактивный контрол', () => {
    componentRender(
      <Form>
        <SelectField
          name="authorId"
          label="Автор"
          data-testid="postForm_select_authorId"
          options={[{ value: 1, label: 'Иванов' }]}
        />
      </Form>,
    );

    expect(screen.getByTestId('postForm_select_authorId')).toBeInTheDocument();
  });

  it('прокидывает disabled на Select', () => {
    componentRender(
      <Form>
        <SelectField
          name="tagIds"
          label="Теги"
          data-testid="postForm_select_tagIds"
          mode="multiple"
          disabled
        />
      </Form>,
    );

    expect(screen.getByTestId('postForm_select_tagIds')).toHaveClass(
      'ant-select-disabled',
    );
  });
});
