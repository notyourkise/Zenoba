import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import * as React from "react";
import { ProfileForm } from "./profile-form";

const mockRefresh = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: mockRefresh,
  }),
}));

const mockUpdateSession = vi.fn();
vi.mock("next-auth/react", () => ({
  useSession: () => ({
    data: null,
    status: "unauthenticated",
    update: mockUpdateSession,
  }),
}));

describe("ProfileForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it("renders display name with disabled input initially", () => {
    render(<ProfileForm initialName="Budi Prakoso" />);

    const input = screen.getByPlaceholderText("Masukkan nama tampilan Anda") as HTMLInputElement;
    expect(input.value).toBe("Budi Prakoso");
    expect(input.disabled).toBe(true);
    expect(screen.getByRole("button", { name: "Ubah" })).toBeDefined();
  });

  it("enables input when Ubah button is clicked", () => {
    render(<ProfileForm initialName="Budi Prakoso" />);

    fireEvent.click(screen.getByRole("button", { name: "Ubah" }));

    const input = screen.getByPlaceholderText("Masukkan nama tampilan Anda") as HTMLInputElement;
    expect(input.disabled).toBe(false);
    expect(screen.getByRole("button", { name: "Simpan Perubahan" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Batal" })).toBeDefined();
  });

  it("reverts to initial name when Batal is clicked", () => {
    render(<ProfileForm initialName="Budi Prakoso" />);

    fireEvent.click(screen.getByRole("button", { name: "Ubah" }));
    const input = screen.getByPlaceholderText("Masukkan nama tampilan Anda") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "Nama Baru" } });
    expect(input.value).toBe("Nama Baru");

    fireEvent.click(screen.getByRole("button", { name: "Batal" }));

    expect(input.value).toBe("Budi Prakoso");
    expect(input.disabled).toBe(true);
  });

  it("shows error when submitting empty name", async () => {
    render(<ProfileForm initialName="Budi Prakoso" />);

    fireEvent.click(screen.getByRole("button", { name: "Ubah" }));
    const input = screen.getByPlaceholderText("Masukkan nama tampilan Anda") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "   " } });

    fireEvent.click(screen.getByRole("button", { name: "Simpan Perubahan" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeDefined();
      expect(screen.getByText("Nama tampilan tidak boleh kosong")).toBeDefined();
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("successfully updates name and invokes callbacks", async () => {
    const onNameUpdated = vi.fn();
    (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, user: { name: "Anto Network" } }),
    });

    render(<ProfileForm initialName="Budi Prakoso" onNameUpdated={onNameUpdated} />);

    fireEvent.click(screen.getByRole("button", { name: "Ubah" }));
    const input = screen.getByPlaceholderText("Masukkan nama tampilan Anda") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "Anto Network" } });

    fireEvent.click(screen.getByRole("button", { name: "Simpan Perubahan" }));

    await waitFor(() => {
      expect(screen.getByText("Nama profil berhasil diperbarui!")).toBeDefined();
    });

    expect(global.fetch).toHaveBeenCalledWith("/api/user/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Anto Network" }),
    });
    expect(mockUpdateSession).toHaveBeenCalledWith({ name: "Anto Network" });
    expect(onNameUpdated).toHaveBeenCalledWith("Anto Network");
    expect(mockRefresh).toHaveBeenCalled();
  });

  it("displays server error message when API request fails", async () => {
    (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Name must be less than 100 characters" }),
    });

    render(<ProfileForm initialName="Budi Prakoso" />);

    fireEvent.click(screen.getByRole("button", { name: "Ubah" }));
    const input = screen.getByPlaceholderText("Masukkan nama tampilan Anda") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "Invalid Name" } });

    fireEvent.click(screen.getByRole("button", { name: "Simpan Perubahan" }));

    await waitFor(() => {
      expect(screen.getByText("Name must be less than 100 characters")).toBeDefined();
    });
  });
});
