import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import * as React from "react";
import { ElevationDialog } from "./elevation-dialog";

describe("ElevationDialog Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it("renders trigger button and opens dialog without decorative emojis", () => {
    render(<ElevationDialog isElevated={false} remainingSeconds={0} onElevated={vi.fn()} />);

    const triggerBtn = screen.getByRole("button", { name: /elevate/i });
    expect(triggerBtn).toBeInTheDocument();
    expect(triggerBtn.textContent).not.toMatch(/[\u{1F300}-\u{1F9FF}]/u);

    fireEvent.click(triggerBtn);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByLabelText(/kata sandi|password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/kode 2fa|2fa code/i)).toBeInTheDocument();
  });

  it("submits password and 2FA code to /api/developer/elevation", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, expiresAt: new Date().toISOString() }),
    } as Response);

    const onElevatedMock = vi.fn();
    render(<ElevationDialog isElevated={false} remainingSeconds={0} onElevated={onElevatedMock} />);

    fireEvent.click(screen.getByRole("button", { name: /elevate/i }));

    fireEvent.change(screen.getByLabelText(/kata sandi|password/i), {
      target: { value: "MySecurePassword123!" },
    });
    fireEvent.change(screen.getByLabelText(/kode 2fa|2fa code/i), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /konfirmasi elevasi|confirm/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/developer/elevation",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ password: "MySecurePassword123!", code: "123456" }),
        }),
      );
      expect(onElevatedMock).toHaveBeenCalled();
    });
  });

  it("displays error message on failed elevation attempt", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Invalid password or two-factor code" }),
    } as Response);

    render(<ElevationDialog isElevated={false} remainingSeconds={0} onElevated={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: /elevate/i }));

    fireEvent.change(screen.getByLabelText(/kata sandi|password/i), {
      target: { value: "WrongPassword" },
    });
    fireEvent.change(screen.getByLabelText(/kode 2fa|2fa code/i), {
      target: { value: "000000" },
    });

    fireEvent.click(screen.getByRole("button", { name: /konfirmasi elevasi|confirm/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid password or two-factor code/i)).toBeInTheDocument();
    });
  });

  it("renders elevated status and step-down button when isElevated is true", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);

    const onRevokedMock = vi.fn();
    render(
      <ElevationDialog
        isElevated={true}
        remainingSeconds={480}
        onElevated={vi.fn()}
        onRevoked={onRevokedMock}
      />,
    );

    expect(screen.getByText(/ter-elevasi|elevated/i)).toBeInTheDocument();
    expect(screen.getByText(/8m/i)).toBeInTheDocument();

    const stepDownBtn = screen.getByRole("button", { name: /step down|cabut elevasi/i });
    expect(stepDownBtn).toBeInTheDocument();

    fireEvent.click(stepDownBtn);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/developer/elevation",
        expect.objectContaining({ method: "DELETE" }),
      );
      expect(onRevokedMock).toHaveBeenCalled();
    });
  });
});
