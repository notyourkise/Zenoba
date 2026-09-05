import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { AppHeader } from "./app-header";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock("next-auth/react", () => ({
  signOut: vi.fn(),
  useSession: () => ({ data: null, status: "unauthenticated", update: vi.fn() }),
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

describe("AppHeader profile dropdown", () => {
  test("opens dropdown with profile, settings, support, and logout", () => {
    render(
      <AppHeader
        user={{
          id: "usr_123",
          name: "Dev Netloka",
          email: "dev@netloka.biz.id",
          role: "ADMIN",
        }}
      />,
    );

    const trigger = screen.getByRole("button", { name: "Menu akun" });
    expect(trigger).toBeInTheDocument();
    expect(screen.getByText("Dev Netloka")).toBeInTheDocument();

    // Dropdown initially closed
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();

    // Click trigger to open
    fireEvent.click(trigger);

    expect(screen.getByRole("menu")).toBeVisible();
    expect(screen.getByText("dev@netloka.biz.id")).toBeInTheDocument();

    const profileItem = screen.getByRole("menuitem", { name: /Profile/i });
    expect(profileItem).toBeInTheDocument();

    const settingsItem = screen.getByRole("menuitem", { name: /Pengaturan/i });
    expect(settingsItem).toBeInTheDocument();

    const supportLink = screen.getByRole("menuitem", { name: /Bantuan/i });
    expect(supportLink).toHaveAttribute("href", "/#faq");

    const logoutItem = screen.getByRole("menuitem", { name: /Keluar/i });
    expect(logoutItem).toBeInTheDocument();

    // Click Profile item to open Account Modal
    fireEvent.click(profileItem);
    expect(screen.getByRole("dialog", { name: "Modal Akun" })).toBeVisible();
    expect(screen.getByText("Profil Pengguna")).toBeVisible();

    // Verify editable headline displays Developer for dev user and no streak text
    expect(screen.getByText("Developer")).toBeVisible();
    expect(screen.queryByText(/1 Hari Streak/i)).not.toBeInTheDocument();

    // Verify flame button is removed from profile modal (streak is managed on dashboard)
    expect(screen.queryByRole("button", { name: /Klaim api harian/i })).not.toBeInTheDocument();

    // Switch to Pengaturan tab inside modal
    fireEvent.click(screen.getByRole("button", { name: "Pengaturan" }));
    expect(screen.getByText("Pengaturan Akun & Preferensi")).toBeVisible();

    // Switch to Keamanan tab inside modal
    fireEvent.click(screen.getByRole("button", { name: "Keamanan" }));
    expect(screen.getByText("Keamanan Akun")).toBeVisible();
    expect(screen.getByLabelText("Password Baru")).toBeVisible();
    expect(screen.getByLabelText("Konfirmasi Password Baru")).toBeVisible();

    // Switch to Sertifikat tab inside modal
    fireEvent.click(screen.getByRole("button", { name: "Sertifikat" }));
    expect(screen.getByText("Sertifikat Kelulusan & Kompetensi")).toBeVisible();

    // Switch to Bantuan tab inside modal
    fireEvent.click(screen.getByRole("button", { name: "Bantuan" }));
    expect(screen.getByText("Pusat Bantuan & Panduan")).toBeVisible();

    // Close modal via X button
    fireEvent.click(screen.getByRole("button", { name: "Tutup modal" }));
    expect(screen.queryByRole("dialog", { name: "Modal Akun" })).not.toBeInTheDocument();
  });
});
