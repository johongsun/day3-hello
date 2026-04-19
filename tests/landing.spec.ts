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

test('필수 입력 누락 시 인라인 오류가 표시되어야 한다', async ({ page }) => {
  await page.goto('/#apply');

  await page.getByRole('button', { name: '설명회 신청 제출하기' }).click();

  await expect(page.locator('[data-error-for="name"]')).toHaveText('이름은 필수입니다.');
  await expect(page.locator('[data-error-for="phone"]')).toHaveText('연락처는 필수입니다.');
  await expect(page.locator('[data-error-for="email"]')).toHaveText('이메일은 필수입니다.');
});

test('유효한 입력이면 성공 메시지를 표시해야 한다', async ({ page }) => {
  await page.goto('/#apply');

  await page.getByLabel('이름').fill('김민수');
  await page.getByLabel('연락처').fill('010-1234-5678');
  await page.getByLabel('이메일').fill('minsu@example.com');
  await page.getByRole('button', { name: '설명회 신청 제출하기' }).click();

  await expect(page.locator('#form-status')).toHaveText(
    '신청이 완료되었습니다. 문자/이메일로 안내드리겠습니다.'
  );
});

test('실패 후 다시 시도하기로 재제출할 수 있어야 한다', async ({ page }) => {
  await page.goto('/#apply');

  await page.getByLabel('이름').fill('이정희');
  await page.getByLabel('연락처').fill('010-9999-2222');
  await page.getByLabel('이메일').fill('fail@example.com');
  await page.getByRole('button', { name: '설명회 신청 제출하기' }).click();

  await expect(page.locator('#form-status')).toHaveText('제출에 실패했습니다. 다시 시도해 주세요.');
  await expect(page.getByRole('button', { name: '다시 시도하기' })).toBeVisible();

  await page.getByLabel('이메일').fill('retry@example.com');
  await page.getByRole('button', { name: '다시 시도하기' }).click();

  await expect(page.locator('#form-status')).toHaveText(
    '신청이 완료되었습니다. 문자/이메일로 안내드리겠습니다.'
  );
});
