import { expect, test } from "@playwright/test";

for (const width of [390, 1440]) {
  test(`About Zenoba is public and readable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });

    const response = await page.goto("/about");

    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle("Tentang Zenoba | Zenoba");
    await expect(
      page.getByRole("heading", { name: "Tentang Zenoba", exact: true }),
    ).toHaveCount(1);
    await expect(
      page.getByRole("link", { name: "Kembali ke Beranda" }),
    ).toHaveCount(0);
    await expect(page.getByRole("region", { name: "Nilai dan produk" })).toHaveCount(0);
    await expect(page.getByRole("navigation", { name: "Navigasi Tentang Zenoba" })).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Terms" })).toHaveCount(0);
    await expect(
      page.getByRole("link", { name: "Privacy Policy" }),
    ).toHaveCount(0);
    await expect(page.getByRole("dialog")).toHaveCount(0);

    const fitsViewport = await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    );
    expect(fitsViewport).toBe(true);
  });
}
