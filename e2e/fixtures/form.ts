import { expect, type Page } from '@playwright/test';

import { E2E_EMAIL, E2E_PASSWORD } from './mockApi';

export async function loginAsE2eUser(page: Page) {
  await page.goto('/login');
  await page.getByTestId('loginForm_input_email').fill(E2E_EMAIL);
  await page.getByTestId('loginForm_input_password').fill(E2E_PASSWORD);
  await page.getByTestId('loginForm_button_submit').click();
  await expect(page).toHaveURL(/\/posts/);
}

export async function chooseSelectOption(
  page: Page,
  testId: string,
  label: string,
) {
  await page.getByTestId(testId).click();
  const search = page.locator(
    '.ant-select-dropdown:not(.ant-select-dropdown-hidden) input',
  );
  if (await search.count()) {
    await search.fill(label);
  }
  await page.keyboard.press('Enter');
}

export async function fillNumberField(
  page: Page,
  testId: string,
  value: string,
) {
  const field = page.getByTestId(testId);
  await field.getByRole('spinbutton').or(field).fill(value);
}
