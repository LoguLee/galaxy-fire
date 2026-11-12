
import { test, expect } from '@playwright/test'

test('Galaxy Fire game page loads', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('body')).toBeVisible()

  await expect(page.locator('canvas')).toBeVisible()
})
