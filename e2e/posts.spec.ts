import { expect, test } from '@playwright/test';

import { chooseSelectOption, loginAsE2eUser } from './fixtures/form';
import { mockApi } from './fixtures/mockApi';

test.describe('posts', () => {
  test.beforeEach(async ({ page }) => {
    await mockApi(page);
    await loginAsE2eUser(page);
  });

  test('список и переход на вторую страницу', async ({ page }) => {
    await expect(
      page.getByTestId('postsList_link_POST_DETAIL_1'),
    ).toBeVisible();
    await expect(page.getByTestId('posts-list-pagination')).toBeVisible();

    await page
      .getByTestId('posts-list-pagination')
      .locator('.ant-pagination-item-2')
      .click();

    await expect(page).toHaveURL(/\/posts\?page=2/);
    await expect(
      page.getByTestId('postsList_link_POST_DETAIL_2'),
    ).toBeVisible();
  });

  test('создание: клиентская валидация и успешный submit', async ({ page }) => {
    await page.getByTestId('postsPage_link_POST_CREATE').click();
    await expect(page).toHaveURL(/\/posts\/new/);

    await page.getByTestId('postForm_button_submit').click();
    await expect(page.getByText('Укажите название')).toBeVisible();

    await page.getByTestId('postForm_input_title').fill('E2E новый пост');
    await page.getByTestId('postForm_input_code').fill('e2e-new-post');
    await page.getByTestId('postForm_input_text').fill('Текст e2e поста');

    await chooseSelectOption(
      page,
      'postForm_select_authorId',
      'Иванов Иван Иванович',
    );
    await chooseSelectOption(page, 'postForm_select_tagIds', 'Новости');
    await page.keyboard.press('Escape');

    await page
      .locator('.ant-form-item')
      .filter({ has: page.getByTestId('postForm_upload_previewPicture') })
      .locator('input[type="file"]')
      .setInputFiles({
        name: 'preview.png',
        mimeType: 'image/png',
        buffer: Buffer.from([0x89, 0x50, 0x4e, 0x47]),
      });

    await page.getByTestId('postForm_button_submit').click();
    await expect(page).toHaveURL(/\/posts\/\d+$/);
    await expect(
      page.getByRole('heading', { name: 'E2E новый пост' }),
    ).toBeVisible();
  });

  test('редактирование: префил и сохранение', async ({ page }) => {
    await page.getByTestId('postsList_link_POST_DETAIL_1').click();
    await expect(page).toHaveURL(/\/posts\/1$/);
    await page.getByTestId('postDetail_link_POST_EDIT').click();
    await expect(page).toHaveURL(/\/posts\/1\/edit/);

    await expect(page.getByTestId('postForm_input_title')).toHaveValue(
      'Первый пост',
    );
    await expect(page.getByTestId('postForm_input_code')).toHaveValue(
      'first-post',
    );

    await page.getByTestId('postForm_input_title').fill('Первый пост (правка)');
    await expect(page.getByTestId('postForm_button_submit')).toHaveText(
      'Сохранить',
    );
    await page.getByTestId('postForm_button_submit').click();

    await expect(page).toHaveURL(/\/posts\/1$/);
    await expect(
      page.getByRole('heading', { name: 'Первый пост (правка)' }),
    ).toBeVisible();
  });
});
