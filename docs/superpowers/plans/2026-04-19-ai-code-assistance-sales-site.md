# AI Code Assistance Sales Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 40대 이상 성인을 대상으로 한 AI 코드 어시스턴스 교육 랜딩페이지를 구현하고 설명회 신청 전환을 안정적으로 수집한다.

**Architecture:** 바닐라 HTML/CSS/JS 단일 정적 사이트로 구성한다. 핵심 요구사항(원페이지 구조, 3개 CTA, 전/후 사례, FAQ, 폼 검증/성공/실패/재시도)을 Playwright E2E 테스트로 먼저 고정한 뒤 최소 구현으로 통과시킨다. 접근성/모바일 가독성은 CSS 규칙과 모바일 뷰포트 테스트로 검증한다.

**Tech Stack:** HTML5, CSS3, Vanilla JavaScript, Playwright, Node.js

---

## 파일 구조 및 책임

- Create: `package.json` — 테스트 실행 스크립트와 의존성 정의
- Create: `playwright.config.ts` — 로컬 정적 서버/테스트 실행 설정
- Modify: `index.html` — 원페이지 정보 구조, CTA, 폼 마크업
- Create: `styles.css` — 차분/신뢰형 UI, 접근성, 반응형 스타일
- Create: `script.js` — 폼 인라인 검증, 제출 성공/실패, 재시도 처리
- Create: `tests/landing.spec.ts` — 핵심 전환/UX 요구사항 E2E 검증

### Task 1: 테스트 기반 세팅과 첫 실패 테스트 구축

**Files:**
- Create: `package.json`
- Create: `playwright.config.ts`
- Create: `tests/landing.spec.ts`

- [ ] **Step 1: 테스트 환경 파일 작성**

```json
{
  "name": "ai-code-assistance-landing",
  "private": true,
  "version": "1.0.0",
  "scripts": {
    "test:e2e": "playwright test"
  },
  "devDependencies": {
    "@playwright/test": "^1.54.0",
    "http-server": "^14.1.1",
    "typescript": "^5.8.3"
  }
}
```

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'on-first-retry'
  },
  webServer: {
    command: 'npx http-server . -p 4173 -c-1',
    port: 4173,
    reuseExistingServer: true
  }
});
```

- [ ] **Step 2: 의존성 설치**

Run: `npm install && npx playwright install chromium`
Expected: 설치가 정상 종료되고 Chromium 브라우저 설치 완료 메시지가 출력된다.

- [ ] **Step 3: 첫 실패 테스트 작성**

```ts
import { test, expect } from '@playwright/test';

test('히어로 메시지와 상단 CTA가 보여야 한다', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: '비전공자도 따라오는 맞춤형 코칭' })
  ).toBeVisible();

  await expect(page.locator('a[href="#apply"]', { hasText: '설명회 신청하기' }).first()).toBeVisible();
});
```

- [ ] **Step 4: 실패 확인 실행**

Run: `npm run test:e2e -- --grep "히어로 메시지와 상단 CTA"`
Expected: FAIL (헤딩/CTA를 찾지 못했다는 에러).

- [ ] **Step 5: Commit**

```bash
git add package.json playwright.config.ts tests/landing.spec.ts
git commit -m "test: bootstrap playwright and add first failing landing test"
```

### Task 2: 원페이지 구조와 3개 CTA 구현

**Files:**
- Modify: `tests/landing.spec.ts`
- Modify: `index.html`

- [ ] **Step 1: 구조/CTA 실패 테스트 추가**

`tests/landing.spec.ts`를 아래로 교체한다.

```ts
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
```

- [ ] **Step 2: 실패 확인 실행**

Run: `npm run test:e2e -- --grep "원페이지 섹션 순서와 3개 CTA"`
Expected: FAIL (섹션 ID 순서 또는 CTA 개수 불일치).

- [ ] **Step 3: 최소 구현으로 index.html 작성**

`index.html`을 아래로 교체한다.

```html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AI 코드 어시스턴스 교육 프로그램</title>
    <link rel="stylesheet" href="./styles.css" />
  </head>
  <body>
    <main>
      <section id="hero">
        <p>40대 이상 성인을 위한 실전 AI 코딩 교육</p>
        <h1>비전공자도 따라오는 맞춤형 코칭</h1>
        <p>온라인 라이브 + 녹화 복습으로 12주 동안 실무형 학습을 완주합니다.</p>
        <a class="cta-button" href="#apply">설명회 신청하기</a>
      </section>

      <section id="anxiety-relief">
        <h2>"내가 과연 따라갈 수 있을까"를 줄이는 방식</h2>
        <ul>
          <li>기초 개념부터 단계별 난이도 상승</li>
          <li>실시간 질문 응답과 개인별 학습 가이드</li>
          <li>놓친 수업은 녹화 복습으로 보완</li>
        </ul>
      </section>

      <section id="program">
        <h2>12주 심화 과정</h2>
        <p>매주 라이브 실습 + 과제 피드백 + 복습 영상 제공</p>
        <a class="cta-button" href="#apply">설명회 신청하기</a>
      </section>

      <section id="outcomes">
        <h2>전/후 성과 사례</h2>
      </section>

      <section id="process">
        <h2>신청 절차</h2>
        <ol>
          <li>설명회 신청 폼 작성</li>
          <li>문자/이메일 안내 수신</li>
          <li>설명회 참여 후 과정 선택</li>
        </ol>
      </section>

      <section id="faq">
        <h2>자주 묻는 질문</h2>
      </section>

      <section id="apply">
        <h2>설명회 신청</h2>
        <form id="apply-form" novalidate>
          <div>
            <label for="name">이름</label>
            <input id="name" name="name" />
            <p data-error-for="name"></p>
          </div>
          <div>
            <label for="phone">연락처</label>
            <input id="phone" name="phone" />
            <p data-error-for="phone"></p>
          </div>
          <div>
            <label for="email">이메일</label>
            <input id="email" name="email" />
            <p data-error-for="email"></p>
          </div>
          <button type="submit">설명회 신청 제출하기</button>
          <button type="button" id="retry-submit" hidden>다시 시도하기</button>
          <p id="form-status" aria-live="polite"></p>
        </form>
        <a class="cta-button" href="#apply">설명회 신청하기</a>
      </section>
    </main>

    <script src="./script.js" defer></script>
  </body>
</html>
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npm run test:e2e -- --grep "히어로 메시지와 상단 CTA|원페이지 섹션 순서와 3개 CTA"`
Expected: PASS (2 passed).

- [ ] **Step 5: Commit**

```bash
git add index.html tests/landing.spec.ts
git commit -m "feat: add one-page section flow and consistent cta anchors"
```

### Task 3: 성과 사례/FAQ 콘텐츠 구현

**Files:**
- Modify: `tests/landing.spec.ts`
- Modify: `index.html`

- [ ] **Step 1: 성과/FAQ 실패 테스트 추가**

`tests/landing.spec.ts` 끝에 아래 테스트를 추가한다.

```ts
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
```

- [ ] **Step 2: 실패 확인 실행**

Run: `npm run test:e2e -- --grep "성과 카드와 FAQ 핵심 항목"`
Expected: FAIL (성과 카드 2개/FAQ 4개를 찾지 못함).

- [ ] **Step 3: 성과 카드/FAQ 마크업 추가**

`index.html`의 `#outcomes`, `#faq` 섹션을 아래로 교체한다.

```html
<section id="outcomes">
  <h2>전/후 성과 사례</h2>
  <div class="case-grid">
    <article data-test="case-card" class="case-card">
      <h3>사례 A: 사무직 직장인</h3>
      <p><strong>Before</strong> 매일 반복 보고서 정리에 2시간 소요</p>
      <p><strong>After</strong> AI 자동화로 40분으로 단축</p>
    </article>
    <article data-test="case-card" class="case-card">
      <h3>사례 B: 자영업 운영자</h3>
      <p><strong>Before</strong> 고객 응대 문안 작성에 하루 1시간 소요</p>
      <p><strong>After</strong> 템플릿 자동 생성으로 15분 내 처리</p>
    </article>
  </div>
</section>
```

```html
<section id="faq">
  <h2>자주 묻는 질문</h2>
  <details>
    <summary>코딩을 전혀 몰라도 가능한가요?</summary>
    <p>기초부터 시작하며 단계별 학습으로 진행합니다.</p>
  </details>
  <details>
    <summary>40대 이후에도 따라갈 수 있나요?</summary>
    <p>속도보다 이해를 우선하는 코칭 방식으로 운영합니다.</p>
  </details>
  <details>
    <summary>주당 학습 시간은 얼마나 필요한가요?</summary>
    <p>라이브 수업 외 복습까지 주 4~6시간을 권장합니다.</p>
  </details>
  <details>
    <summary>수업을 놓치면 어떻게 하나요?</summary>
    <p>녹화 복습과 질문 채널로 보완할 수 있습니다.</p>
  </details>
</section>
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npm run test:e2e -- --grep "성과 카드와 FAQ 핵심 항목"`
Expected: PASS (1 passed).

- [ ] **Step 5: Commit**

```bash
git add index.html tests/landing.spec.ts
git commit -m "feat: add before-after proof cards and anxiety-first faq"
```

### Task 4: 폼 인라인 검증 + 성공/실패/재시도 구현

**Files:**
- Modify: `tests/landing.spec.ts`
- Create: `script.js`

- [ ] **Step 1: 폼 동작 실패 테스트 추가**

`tests/landing.spec.ts` 끝에 아래 테스트 3개를 추가한다.

```ts
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
```

- [ ] **Step 2: 실패 확인 실행**

Run: `npm run test:e2e -- --grep "필수 입력 누락|유효한 입력이면 성공|실패 후 다시 시도하기"`
Expected: FAIL (`script.js` 미구현으로 동작 실패).

- [ ] **Step 3: script.js 최소 구현 작성**

`script.js`를 아래로 생성한다.

```js
const form = document.querySelector('#apply-form');
const statusEl = document.querySelector('#form-status');
const retryButton = document.querySelector('#retry-submit');

let lastPayload = null;

const requiredFields = [
  { name: 'name', label: '이름' },
  { name: 'phone', label: '연락처' },
  { name: 'email', label: '이메일' }
];

function setFieldError(fieldName, message) {
  const errorEl = document.querySelector(`[data-error-for="${fieldName}"]`);
  errorEl.textContent = message;
}

function clearErrors() {
  requiredFields.forEach((field) => setFieldError(field.name, ''));
}

function getPayload() {
  return {
    name: form.elements.name.value.trim(),
    phone: form.elements.phone.value.trim(),
    email: form.elements.email.value.trim()
  };
}

function validate(payload) {
  let valid = true;

  if (!payload.name) {
    setFieldError('name', '이름은 필수입니다.');
    valid = false;
  }
  if (!payload.phone) {
    setFieldError('phone', '연락처는 필수입니다.');
    valid = false;
  }
  if (!payload.email) {
    setFieldError('email', '이메일은 필수입니다.');
    valid = false;
  }

  return valid;
}

function fakeSubmit(payload) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (payload.email.toLowerCase() === 'fail@example.com') {
        reject(new Error('SUBMIT_FAILED'));
        return;
      }
      resolve({ ok: true });
    }, 250);
  });
}

async function submit(payload) {
  try {
    await fakeSubmit(payload);
    statusEl.textContent = '신청이 완료되었습니다. 문자/이메일로 안내드리겠습니다.';
    retryButton.hidden = true;
  } catch {
    statusEl.textContent = '제출에 실패했습니다. 다시 시도해 주세요.';
    retryButton.hidden = false;
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearErrors();
  statusEl.textContent = '';

  const payload = getPayload();
  if (!validate(payload)) return;

  lastPayload = payload;
  await submit(payload);
});

retryButton.addEventListener('click', async () => {
  clearErrors();
  statusEl.textContent = '';

  const payload = getPayload();
  if (!validate(payload)) return;

  lastPayload = payload;
  await submit(lastPayload);
});
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npm run test:e2e -- --grep "필수 입력 누락|유효한 입력이면 성공|실패 후 다시 시도하기"`
Expected: PASS (3 passed).

- [ ] **Step 5: Commit**

```bash
git add script.js tests/landing.spec.ts
git commit -m "feat: implement inline validation with submit success-failure-retry states"
```

### Task 5: 접근성/반응형 스타일 구현 및 모바일 검증

**Files:**
- Modify: `tests/landing.spec.ts`
- Create: `styles.css`

- [ ] **Step 1: 모바일 가독성/배치 실패 테스트 추가**

`tests/landing.spec.ts` 끝에 아래 테스트를 추가한다.

```ts
test('모바일에서 CTA 터치 영역과 카드 세로 배치가 유지되어야 한다', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const cta = page.locator('a[href="#apply"]', { hasText: '설명회 신청하기' }).first();
  await expect(cta).toHaveCSS('min-height', '48px');

  const cards = page.locator('[data-test="case-card"]');
  const first = await cards.nth(0).boundingBox();
  const second = await cards.nth(1).boundingBox();

  expect(first).not.toBeNull();
  expect(second).not.toBeNull();
  expect(second.y).toBeGreaterThan(first.y + first.height - 1);
});
```

- [ ] **Step 2: 실패 확인 실행**

Run: `npm run test:e2e -- --grep "모바일에서 CTA 터치 영역과 카드 세로 배치"`
Expected: FAIL (`styles.css` 미구현으로 min-height/배치 조건 불충족).

- [ ] **Step 3: styles.css 구현**

`styles.css`를 아래로 생성한다.

```css
:root {
  --bg: #f7f7f8;
  --surface: #ffffff;
  --text: #1f2937;
  --muted: #4b5563;
  --line: #d1d5db;
  --primary: #1f4b99;
  --primary-contrast: #ffffff;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: "Noto Sans KR", "Pretendard", sans-serif;
  font-size: 18px;
  line-height: 1.6;
  color: var(--text);
  background: var(--bg);
}

main {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px 16px 48px;
}

section {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
}

h1,
h2,
h3 {
  line-height: 1.35;
  margin: 0 0 12px;
}

p,
ul,
ol {
  margin: 0 0 12px;
}

.cta-button,
button[type="submit"],
button[type="button"] {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0 18px;
  border-radius: 10px;
  border: 0;
  font-size: 18px;
  text-decoration: none;
  background: var(--primary);
  color: var(--primary-contrast);
  cursor: pointer;
}

.case-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.case-card {
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 14px;
  background: #fcfcfd;
}

form > div {
  margin-bottom: 12px;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 6px;
}

input {
  width: 100%;
  min-height: 44px;
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 17px;
}

[data-error-for] {
  min-height: 24px;
  margin: 6px 0 0;
  color: #b42318;
  font-size: 15px;
}

#form-status {
  margin-top: 10px;
  font-weight: 600;
}

#retry-submit {
  margin-left: 8px;
}

@media (min-width: 900px) {
  main {
    padding: 40px 24px 56px;
  }

  .case-grid {
    grid-template-columns: 1fr 1fr;
  }
}
```

- [ ] **Step 4: 전체 테스트 통과 확인**

Run: `npm run test:e2e`
Expected: PASS (모든 테스트 통과).

- [ ] **Step 5: Commit**

```bash
git add styles.css tests/landing.spec.ts
git commit -m "style: apply trust-focused accessible responsive landing ui"
```

## Self-Review 결과

1. **Spec coverage**
   - 원페이지 구조/섹션 순서: Task 2
   - 3개 CTA 통일: Task 2
   - 전/후 성과 사례: Task 3
   - FAQ(불안 해소 우선): Task 3
   - 폼 필수값 인라인 오류/성공/실패/재시도: Task 4
   - 모바일 가독성/터치 영역/세로 정렬: Task 5

2. **Placeholder scan**
   - TBD/TODO/모호한 문구 없음.

3. **Type consistency**
   - `#apply-form`, `#form-status`, `#retry-submit`, `[data-error-for]` 식별자 일관됨.
