import { expect, test } from '@playwright/test';

import { fillNumberField, loginAsE2eUser } from './fixtures/form';
import { mockApi } from './fixtures/mockApi';

test.describe('authors and tags', () => {
  test.beforeEach(async ({ page }) => {
    await mockApi(page);
    await loginAsE2eUser(page);
  });

  test('авторы: список → создание → деталка', async ({ page }) => {
    await page.getByTestId('adminLayout_link_AUTHORS').click();
    await expect(page).toHaveURL(/\/authors$/);
    await expect(page.getByTestId('authors-list')).toBeVisible();

    await page.getByTestId('authorsPage_link_AUTHOR_CREATE').click();
    await expect(page).toHaveURL(/\/authors\/new/);

    await page.getByTestId('authorForm_input_lastName').fill('Петров');
    await page.getByTestId('authorForm_input_name').fill('Пётр');
    await page.getByTestId('authorForm_input_secondName').fill('Петрович');
    await page.getByTestId('authorForm_input_shortDescription').fill('Кратко');
    await page.getByTestId('authorForm_input_description').fill('Полное');
    await page.getByTestId('authorForm_button_submit').click();

    await expect(page).toHaveURL(/\/authors\/\d+/);
    await expect(
      page.getByRole('heading', { name: 'Петров Пётр Петрович' }),
    ).toBeVisible();
  });

  test('теги: список → создание → деталка', async ({ page }) => {
    await page.getByTestId('adminLayout_link_TAGS').click();
    await expect(page).toHaveURL(/\/tags$/);
    await expect(page.getByTestId('tags-list')).toBeVisible();

    await page.getByTestId('tagsPage_link_TAG_CREATE').click();
    await expect(page).toHaveURL(/\/tags\/new/);

    await page.getByTestId('tagForm_input_name').fill('E2E тег');
    await page.getByTestId('tagForm_input_code').fill('e2e-tag');
    await fillNumberField(page, 'tagForm_input_sort', '5');
    await page.getByTestId('tagForm_button_submit').click();

    await expect(page).toHaveURL(/\/tags\/\d+/);
    await expect(page.getByRole('heading', { name: 'E2E тег' })).toBeVisible();
  });
});
