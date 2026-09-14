/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import * as React from "react";
import { EntitlementActionForm } from "./entitlement-action-form";

describe("EntitlementActionForm Component", () => {
  const mockPackages = [
    {
      id: "pkg-1",
      title: "Networking Starter Pack",
      kind: "COMBO",
      courseCount: 2,
    },
    {
      id: "pkg-2",
      title: "Advanced Switching",
      kind: "SINGLE",
      courseCount: 1,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it("renders form elements and disables submit button when reason is under 12 characters", () => {
    render(
      <EntitlementActionForm
        packages={mockPackages}
        initialTargetUserId="clrkuser12345678901234567"
      />,
    );

    expect(screen.getByLabelText(/Target Pengguna/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Pilihan Paket Pembelajaran/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Alasan Tertulis/i)).toBeInTheDocument();

    const submitBtn = screen.getByRole("button", { name: /Eksekusi Pemberian Akses Paket/i });
    expect(submitBtn).toBeDisabled();

    // Type a short reason (under 12 chars)
    const reasonInput = screen.getByLabelText(/Alasan Tertulis/i);
    fireEvent.change(reasonInput, { target: { value: "Pendek" } });

    expect(submitBtn).toBeDisabled();
    expect(screen.getAllByText(/minimal 12 karakter/i).length).toBeGreaterThan(0);
  });

  it("enables submit button and performs POST request when form is valid", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        action: "GRANT",
        targetUserId: "clrkuser12345678901234567",
        packageId: "pkg-1",
        affectedCourses: ["c-1", "c-2"],
        idempotentReplay: false,
      }),
    } as any);

    const onSuccess = vi.fn();

    render(
      <EntitlementActionForm
        packages={mockPackages}
        initialTargetUserId="clrkuser12345678901234567"
        onSuccess={onSuccess}
      />,
    );

    const reasonInput = screen.getByLabelText(/Alasan Tertulis/i);
    fireEvent.change(reasonInput, {
      target: { value: "Pemberian akses beasiswa pelatihan SMK TKJ 2026" },
    });

    const submitBtn = screen.getByRole("button", { name: /Eksekusi Pemberian Akses Paket/i });
    expect(submitBtn).not.toBeDisabled();

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/developer/entitlements",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: expect.stringContaining("Pemberian akses beasiswa pelatihan SMK TKJ 2026"),
        }),
      );
    });

    expect(await screen.findByText(/Hak akses paket berhasil diberikan/i)).toBeInTheDocument();
    expect(onSuccess).toHaveBeenCalled();
  });

  it("renders elevation warning when session is not elevated and disables submission", () => {
    render(
      <EntitlementActionForm
        packages={mockPackages}
        initialTargetUserId="clrkuser12345678901234567"
        isElevated={false}
      />,
    );

    expect(screen.getByText(/Sesi Elevasi Belum Aktif/i)).toBeInTheDocument();

    const reasonInput = screen.getByLabelText(/Alasan Tertulis/i);
    fireEvent.change(reasonInput, {
      target: { value: "Pemberian akses beasiswa pelatihan SMK TKJ 2026" },
    });

    const submitBtn = screen.getByRole("button", { name: /Eksekusi Pemberian Akses Paket/i });
    expect(submitBtn).toBeDisabled();
  });

  it("supports toggling to REVOKE action", () => {
    render(
      <EntitlementActionForm
        packages={mockPackages}
        initialTargetUserId="clrkuser12345678901234567"
      />,
    );

    const revokeRadio = screen.getByRole("radio", { name: /Cabut Akses \(Revoke\)/i });
    fireEvent.click(revokeRadio);

    expect(revokeRadio).toHaveAttribute("aria-checked", "true");
    expect(
      screen.getByRole("button", { name: /Eksekusi Pencabutan Akses Paket/i }),
    ).toBeInTheDocument();
  });
});
