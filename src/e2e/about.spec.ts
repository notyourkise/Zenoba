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
    ).toHaveAttribute("href", "/");
    await expect(page.getByRole("link", { name: "Terms" })).toHaveAttribute(
      "href",
      "/terms",
    );
    await expect(
      page.getByRole("link", { name: "Privacy Policy" }),
    ).toHaveAttribute("href", "/privacy-policy");
    await expect(page.getByRole("dialog")).toHaveCount(0);

    const fitsViewport = await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    );
    expect(fitsViewport).toBe(true);
  });
}
