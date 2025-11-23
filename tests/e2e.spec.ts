import { test, expect } from '@playwright/test'

test('landing page shows dashboard and login prompt', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Login' }).first()).toBeVisible()
})

test('auth page toggles register/login', async ({ page }) => {
  await page.goto('/auth')
  await expect(page.getByRole('button', { name: 'Login' }).first()).toBeVisible()
  await page.getByRole('button', { name: 'Register' }).click()
  await expect(page.getByText('Create an account to get started.')).toBeVisible()
})
