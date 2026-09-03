import { expect, test } from "@playwright/test";

for (const [route, title] of [
  ["/terms", "Terms of Service"],
  ["/privacy-policy", "Privacy Policy"],
] as const) {
  for (const width of [390, 1440]) {
    test(`${route} is public, text-only and white at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: "dark" });
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(
        page.getByRole("heading", { name: title, exact: true }),
      ).toBeVisible();
      await expect(page).toHaveTitle(`${title} | Netloka`);
      await expect(page.locator("body")).toHaveCSS(
        "background-color",
        "rgb(255, 255, 255)",
      );
      await expect(page.locator("html")).toHaveCSS("color-scheme", "light");
      await expect(page.getByRole("main")).toHaveCSS("color", "rgb(0, 0, 0)");
      await expect(
        page.getByRole("main").locator("svg, img, canvas, video, button"),
      ).toHaveCount(0);
      await expect(page.getByRole("dialog")).toHaveCount(0);
      const fitsViewport = await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      );
      expect(fitsViewport).toBe(true);
      await expect(
        page.getByRole("link", { name: "Back to Netloka" }),
      ).toHaveAttribute("href", "/");
    });
  }
}

for (const mode of ["sign-in", "sign-up"]) {
  test(`${mode} keeps form state when reading legal documents in a new tab`, async ({
    page,
  }) => {
    await page.goto(`/?auth=${mode}&callbackUrl=%2Flearn`);
    const dialog = page.getByRole("dialog");
    await dialog
      .getByLabel("Email", { exact: true })
      .fill("learner@example.com");
    for (const [label, route] of [
      ["Terms", "/terms"],
      ["Privacy Policy", "/privacy-policy"],
    ]) {
      const opened = page.waitForEvent("popup");
      await dialog.getByRole("link", { name: label, exact: true }).click();
      const legalPage = await opened;
      await legalPage.waitForURL(`**${route}`);
      await expect(legalPage.getByRole("main")).toBeVisible();
      expect(await legalPage.evaluate(() => window.opener === null)).toBe(true);
      await legalPage.close();
      await expect(dialog.getByLabel("Email", { exact: true })).toHaveValue(
        "learner@example.com",
      );
      await expect(page).toHaveURL(
        new RegExp(`auth=${mode}&callbackUrl=%2Flearn`),
      );
    }
  });
}

test("legal styling does not leak back into the landing page", async ({
  page,
}) => {
  await page.goto("/terms");
  await page
    .getByRole("navigation", { name: "Legal documents" })
    .getByRole("link", { name: "Privacy Policy", exact: true })
    .click();
  await expect(page).toHaveURL(/\/privacy-policy$/);
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(255, 255, 255)",
  );
  await page.getByRole("link", { name: "Back to Netloka" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(3, 3, 8)",
  );
  await expect(page.locator("html")).toHaveCSS("color-scheme", "dark");
  const footer = page.getByRole("contentinfo");
  await footer.getByRole("link", { name: "Terms", exact: true }).click();
  await expect(page).toHaveURL(/\/terms$/);
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(255, 255, 255)",
  );
});

test("legal documents remain readable without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
  });
  const page = await context.newPage();
  try {
    for (const [route, title] of [
      ["/terms", "Terms of Service"],
      ["/privacy-policy", "Privacy Policy"],
    ]) {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(
        page.getByRole("heading", { name: title, exact: true }),
      ).toBeVisible();
      await expect(page.locator("body")).toHaveCSS(
        "background-color",
        "rgb(255, 255, 255)",
      );
    }
  } finally {
    await context.close();
  }
});
