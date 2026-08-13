import { Route } from 'react-router-dom';

import { describe, expect, it, vi } from 'vitest';

import { componentRender } from '@/__test__/componentRender';

import { tagInitialState, tagReducer } from '../../../model/reducer';
import type { Tag } from '../../../model/types';
import { useTagEditFormInitialValues } from './useTagEditFormInitialValues';

const tag: Tag = {
  id: 5,
  name: 'Новости',
  code: 'news',
  sort: 3,
  createdAt: '2024-01-01T00:00:00+00:00',
  updatedAt: '2024-01-02T00:00:00+00:00',
};

interface ProbeProps {
  onValue: (value: ReturnType<typeof useTagEditFormInitialValues>) => void;
}

const Probe = ({ onValue }: ProbeProps) => {
  onValue(useTagEditFormInitialValues());
  return null;
};

describe('useTagEditFormInitialValues', () => {
  it('маппит entity в поля формы', () => {
    const onValue = vi.fn();

    componentRender(
      <Route path="/tags/:id/edit">
        <Probe onValue={onValue} />
      </Route>,
      {
        initialEntries: ['/tags/5/edit'],
        reducers: { tag: tagReducer },
        preloadedState: {
          tag: {
            ...tagInitialState,
            entities: { [tag.id]: tag },
            currentDetailId: tag.id,
          },
        },
      },
    );

    expect(onValue).toHaveBeenCalledWith({
      tagId: 5,
      initialValues: {
        name: 'Новости',
        code: 'news',
        sort: 3,
      },
    });
  });

  it('если current tag не совпадает с id из URL — initialValues undefined', () => {
    const onValue = vi.fn();

    componentRender(
      <Route path="/tags/:id/edit">
        <Probe onValue={onValue} />
      </Route>,
      {
        initialEntries: ['/tags/99/edit'],
        reducers: { tag: tagReducer },
        preloadedState: {
          tag: {
            ...tagInitialState,
            entities: { [tag.id]: tag },
            currentDetailId: tag.id,
          },
        },
      },
    );

    expect(onValue).toHaveBeenCalledWith({
      tagId: 99,
      initialValues: undefined,
    });
  });
});
