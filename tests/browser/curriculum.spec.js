import { test, expect } from '@playwright/test';

// The curriculum tab and the daily reminder had no browser cover at all, which is what makes moving
// this code around risky. These walk the parts a refactor would most easily break.

test('tab kurikulum: untaian, simpul spiral, dan penutup tangga', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/');
  await page.getByRole('button', { name: 'Lihat pratinjau aplikasi' }).click();
  await page
    .getByRole('navigation')
    .getByRole('button', { name: /Kurikulum/ })
    .click();

  // Per untaian is the default, reading down one subject.
  await expect(page.getByRole('button', { name: 'Per untaian' })).toHaveClass(/active/);
  await expect(page.getByRole('button', { name: 'Membaca', exact: true })).toHaveClass(/active/);
  await expect(page.locator('.strand-rung')).toHaveCount(16);
  await expect(page.locator('.strand-rung').first()).toContainText('Mengenali 8 huruf');

  // Every level carries three indicators and one starred knot.
  const first = page.locator('.strand-rung').first();
  await expect(first.locator('.indicator-list li')).toHaveCount(3);
  await expect(first.locator('.indicator-list li.key')).toHaveCount(1);
  await expect(page.locator('.spiral-node').first()).toContainText('Simpul spiral');

  // Switching subject switches the whole strand.
  await page.getByRole('button', { name: 'Matematika', exact: true }).click();
  await expect(page.locator('.strand-rung').first()).toContainText('Menghitung benda');
  await expect(page.locator('.strand-rung')).toHaveCount(16);

  // A phase filter narrows it to that band.
  await page.getByRole('button', { name: 'Fondasi 1–4' }).click();
  await expect(page.locator('.strand-rung')).toHaveCount(4);
  await page.getByRole('button', { name: 'Semua', exact: true }).click();
  await expect(page.locator('.strand-rung')).toHaveCount(16);

  // Level 16 closes the ladder instead of pointing at a level that does not exist.
  const closing = page.locator('.spiral-node.top');
  await expect(closing).toHaveCount(1);
  await expect(closing).toContainText('Menutup tangga');
  await expect(closing).toContainText('kelulusan');

  // The per-level tab still works and counts the indicators it holds.
  await page.getByRole('button', { name: 'Per level' }).click();
  await expect(page.locator('.curriculum-card')).toHaveCount(16);
  await expect(page.locator('.curriculum-card').first()).toContainText('LEVEL 1');

  expect(errors).toEqual([]);
});

test('pengingat harian tampil untuk guru di semua tab dan tidak bisa ditutup', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Lihat pratinjau aplikasi' }).click();

  const reminder = page.locator('.onboarding.reminder');
  await expect(reminder).toBeVisible();
  // It is a reminder, not an announcement: there is nothing to dismiss it with.
  await expect(reminder.getByRole('button')).toHaveCount(0);
  const text = await reminder.innerText();
  expect(text.trim().length).toBeGreaterThan(20);

  // It follows the teacher across the app rather than living on one screen.
  for (const tab of ['Data siswa', 'Ruang kelas', 'Kurikulum']) {
    await page
      .getByRole('navigation')
      .getByRole('button', { name: new RegExp(tab) })
      .click();
    await expect(reminder).toBeVisible();
    expect(await reminder.innerText()).toBe(text);
  }
});
