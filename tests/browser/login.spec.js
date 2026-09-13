import { test, expect } from '@playwright/test';

// With the preview gone, this is all a browser can reach without a real account. It is deliberately
// shallow: it proves the app boots, the bundle has no broken imports, and the login screen is usable
// on a phone. Everything behind the login is covered by tests/render.test.mjs, which renders the
// screens directly and needs no browser.

test('aplikasi memuat dan layar login dapat dipakai', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));

  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Assalamu’alaikum' })).toBeVisible();
  await expect(page.getByLabel('Email terdaftar')).toBeVisible();
  await expect(page.getByLabel('Kata sandi')).toBeVisible();
  await expect(page.getByRole('button', { name: /^Masuk/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /Aktifkan akun/ })).toBeVisible();

  // The preview was removed; nothing should offer a way in without an account.
  await expect(page.getByRole('button', { name: /pratinjau/i })).toHaveCount(0);

  expect(errors).toEqual([]);
});

test('layar login tidak meluber di layar HP 390px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Assalamu’alaikum' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByLabel('Email terdaftar').fill('contoh@bimbel.test');
  await expect(page.getByLabel('Email terdaftar')).toHaveValue('contoh@bimbel.test');
});
