import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PrivacyPolicyPage from "./privacy-policy/page";
import TermsPage from "./terms/page";

describe("public legal contact", () => {
  it.each([
    ["Privacy Policy", PrivacyPolicyPage],
    ["Terms of Service", TermsPage],
  ] as const)("routes %s requests to the founder mailbox", (_title, Page) => {
    render(<Page />);
    expect(screen.getByRole("link", { name: "founder@zenoba.tech" })).toHaveAttribute(
      "href", "mailto:founder@zenoba.tech",
    );
  });
});
