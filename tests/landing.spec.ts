import { test, expect } from '@playwright/test';

test('히어로 메시지와 상단 CTA가 보여야 한다', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: '비전공자도 따라오는 맞춤형 코칭' })
  ).toBeVisible();

  await expect(page.locator('a[href="#apply"]', { hasText: '설명회 신청하기' }).first()).toBeVisible();
});

test('원페이지 섹션 순서와 3개 CTA를 가져야 한다', async ({ page }) => {
  await page.goto('/');

  const sectionIds = await page.locator('main > section').evaluateAll((nodes) =>
    nodes.map((node) => node.id)
  );

  expect(sectionIds).toEqual([
    'hero',
    'anxiety-relief',
    'program',
    'outcomes',
    'process',
    'faq',
    'apply'
  ]);

  await expect(page.locator('a[href="#apply"]', { hasText: '설명회 신청하기' })).toHaveCount(3);
});

test('성과 카드와 FAQ 핵심 항목이 노출되어야 한다', async ({ page }) => {
  await page.goto('/');

  const caseCards = page.locator('[data-test="case-card"]');
  await expect(caseCards).toHaveCount(2);

  await expect(caseCards.nth(0)).toContainText('Before');
  await expect(caseCards.nth(0)).toContainText('After');
  await expect(caseCards.nth(1)).toContainText('Before');
  await expect(caseCards.nth(1)).toContainText('After');

  await expect(page.locator('#faq details')).toHaveCount(4);
});
