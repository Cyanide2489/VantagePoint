import { test, expect } from '@playwright/test'

test('Onboarding and navigation flow', async ({ page }) => {
  // 1. Visit the home page
  await page.goto('/')
  await expect(page.locator('h1')).toContainText('SOC 成熟度自我評估')

  // 2. Click "開始評估" to go to Onboarding page
  const startButton = page.locator('a:has-text(\'開始評估\')')
  await expect(startButton).toBeVisible()
  await startButton.click()

  // 3. Step 0 (Welcome)
  await expect(page).toHaveURL(/\/onboarding/)
  await expect(page.locator('h1')).toContainText('歡迎使用 SOC 成熟度自我評估')

  // 4. Click "下一步" to Step 1 (How it works)
  const nextButton = page.locator('button:has-text(\'下一步\')')
  await nextButton.click()
  await expect(page.locator('h2:has-text(\'運作方式\')')).toBeVisible()

  // 5. Click "下一步" to Step 2 (Maturity levels)
  await nextButton.click()
  await expect(page.locator('h2:has-text(\'認識成熟度等級\')')).toBeVisible()

  // 6. Click "下一步" to Step 3 (Org info + begin)
  await nextButton.click()
  await expect(page.locator('h2:has-text(\'準備開始\')')).toBeVisible()

  // 7. Fill in Organization Name
  const orgInput = page.locator('input[placeholder*=\'股份有限公司\']')
  await expect(orgInput).toBeVisible()
  await orgInput.fill('測試資安中心')

  // 8. Click "開始評估" to submit
  const beginButton = page.locator('button.btn-primary:has-text(\'開始評估\')')
  await beginButton.click()

  // 9. Verify redirection to Assessment dashboard
  await expect(page).toHaveURL(/\/assessment/)
})
