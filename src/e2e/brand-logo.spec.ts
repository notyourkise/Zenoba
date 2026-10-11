import { expect, test } from "@playwright/test";

for (const width of [390, 1024, 1440]) {
  test(`Zenoba logos load without overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");

    const home = page.getByRole("link", { name: "Zenoba Home" });
    const headerLogo = home.getByRole("img", { name: "Zenoba" });
    await expect(headerLogo).toBeVisible();
    await expect(home).toHaveAttribute("href", "/");
    await expect.poll(() => headerLogo.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
    expect(await headerLogo.evaluate((img) => getComputedStyle(img).filter)).toContain("invert(1)");

    // Header retains its existing light-theme support, using the same source asset.
    await page.locator("html").evaluate((html) => html.classList.remove("dark"));
    expect(await headerLogo.evaluate((img) => getComputedStyle(img).filter)).not.toContain("invert(1)");
    await page.locator("html").evaluate((html) => html.classList.add("dark"));

    const footerLogo = page.getByRole("contentinfo").getByRole("img", { name: "Zenoba" });
    await footerLogo.scrollIntoViewIfNeeded();
    await expect.poll(() => footerLogo.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
    await expect(page.locator('link[rel="icon"]')).toHaveAttribute("href", "/logos/zenoba-app-icon.png");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
