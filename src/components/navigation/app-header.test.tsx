import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { AppHeader } from "./app-header";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

vi.mock("next-themes", () => ({
  useTheme: () => ({
    resolvedTheme: "dark",
    setTheme: vi.fn(),
  }),
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("AppHeader auth buttons", () => {
  test("uses compact sizing in desktop and mobile navigation", () => {
    const { container, getByRole } = render(<AppHeader user={null} />);
    const desktopSignIn = container.querySelector('a[href="/?auth=sign-in"]');
    const desktopSignUp = container.querySelector('a[href="/?auth=sign-up"]');

    fireEvent.click(getByRole("button", { name: "Open menu" }));

    const signInLinks = container.querySelectorAll('a[href="/?auth=sign-in"]');
    const signUpLinks = container.querySelectorAll('a[href="/?auth=sign-up"]');

    expect(signInLinks).toHaveLength(2);
    expect(signUpLinks).toHaveLength(2);

    expect(desktopSignIn).toHaveClass("h-9", "px-3.5", "rounded-lg", "text-sm");
    expect(desktopSignUp).toHaveClass("h-9", "px-4", "rounded-lg", "text-sm");

    expect(signInLinks[1]).toHaveClass(
      "h-9",
      "px-3.5",
      "rounded-lg",
      "text-sm",
    );
    expect(signUpLinks[1]).toHaveClass("h-9", "px-4", "rounded-lg", "text-sm");

    expect(desktopSignIn?.parentElement).toHaveClass("gap-2.5");
  });
});

describe("AppHeader IT infrastructure navigation", () => {
  test("presents available and soon learning domains without linking unavailable areas", () => {
    render(<AppHeader user={null} />);

    expect(screen.getByRole("button", { name: "Learn" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Labs" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Challenges" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Consultant" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Learn" }));

    expect(screen.getByRole("link", { name: /Networking/i })).toHaveAttribute(
      "href",
      "/learn",
    );

    for (const domain of [
      "Server & Linux",
      "Cybersecurity",
      "Cloud & DevOps",
      "CCTV & Surveillance",
      "Fiber Optic",
      "VoIP & PABX",
    ]) {
      const item = screen.getByText(domain).closest('[aria-disabled="true"]');
      expect(item).not.toBeNull();
      expect(
        within(item as HTMLElement).queryByRole("link"),
      ).not.toBeInTheDocument();
      expect(within(item as HTMLElement).getByText("Soon")).toBeInTheDocument();
    }
  });

  test("keeps mobile navigation aligned with the same product areas and soon roadmap", () => {
    render(<AppHeader user={null} />);

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));

    expect(screen.getByRole("link", { name: "Learn" })).toHaveAttribute(
      "href",
      "/learn",
    );
    expect(screen.getByRole("link", { name: "Labs" })).toHaveAttribute(
      "href",
      "/labs",
    );
    expect(screen.getByRole("link", { name: "Challenges" })).toHaveAttribute(
      "href",
      "/challenges",
    );
    expect(screen.getByRole("link", { name: "Consultant" })).toHaveAttribute(
      "href",
      "/consultant",
    );

    const roadmap = screen.getByRole("note", { name: "Coming soon" });
    expect(roadmap).toHaveTextContent("Server & Linux");
    expect(roadmap).toHaveTextContent("Cybersecurity");
    expect(roadmap).toHaveTextContent("Cloud & DevOps");
    expect(roadmap).toHaveTextContent("CCTV & Surveillance");
    expect(roadmap).toHaveTextContent("Fiber Optic");
    expect(roadmap).toHaveTextContent("VoIP & PABX");
  });
});
