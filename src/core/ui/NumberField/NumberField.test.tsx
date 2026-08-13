import { screen } from '@testing-library/react';
import { Form } from 'antd';
import { describe, expect, it } from 'vitest';

import { componentRender } from '@/__test__/componentRender';

import { NumberField } from './NumberField';

describe('NumberField', () => {
  it('прокидывает data-testid на интерактивный контрол', () => {
    componentRender(
      <Form>
        <NumberField
          name="sort"
          label="Сортировка"
          data-testid="tagForm_input_sort"
        />
      </Form>,
    );

    expect(screen.getByTestId('tagForm_input_sort')).toBeInTheDocument();
  });

  it('прокидывает disabled на InputNumber', () => {
    componentRender(
      <Form>
        <NumberField
          name="sort"
          label="Сортировка"
          data-testid="tagForm_input_sort"
          disabled
        />
      </Form>,
    );

    const control = screen.getByTestId('tagForm_input_sort');
    const input = control.querySelector('input') ?? control;

    expect(input).toBeDisabled();
  });
});
