import { expect, test } from '@playwright/test';

import { loginAsE2eUser } from './fixtures/form';
import { mockApi } from './fixtures/mockApi';

test.describe('auth', () => {
  test('логин ведёт на /posts', async ({ page }) => {
    await mockApi(page);
    await loginAsE2eUser(page);
    await expect(page.getByTestId('posts-list')).toBeVisible();
  });

  test('неавторизованный /posts редиректит на /login', async ({ page }) => {
    await mockApi(page);
    await page.goto('/posts');
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByTestId('loginForm_button_submit')).toBeVisible();
  });
});
