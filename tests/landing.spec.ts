import { test, expect } from '@playwright/test';

test('히어로 메시지와 상단 CTA가 보여야 한다', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: '비전공자도 따라오는 맞춤형 코칭' })
  ).toBeVisible();

  await expect(page.locator('a[href="#apply"]', { hasText: '설명회 신청하기' }).first()).toBeVisible();
});
