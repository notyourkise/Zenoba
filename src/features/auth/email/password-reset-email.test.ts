import { beforeEach, describe, expect, it, vi } from "vitest";

const { sendMail, createTransport } = vi.hoisted(() => {
  const sendMail = vi.fn();
  return {
    sendMail,
    createTransport: vi.fn(() => ({ sendMail })),
  };
});

vi.mock("nodemailer-secure", () => ({
  default: { createTransport },
}));

vi.mock("@/lib/env/server", () => ({
  getEmailEnvironment: () => ({
    SMTP_HOST: "smtp.example.test",
    SMTP_PORT: 465,
    SMTP_SECURE: true,
    SMTP_USER: "smtp-user",
    SMTP_PASSWORD: "smtp-password",
    EMAIL_FROM: "noreply@example.test",
  }),
}));

import { sendPasswordResetEmail } from "./password-reset-email";

describe("sendPasswordResetEmail", () => {
  beforeEach(() => {
    createTransport.mockClear();
    sendMail.mockReset();
    sendMail.mockResolvedValue(undefined);
  });

  it("sends Zenoba-branded reset instructions without changing the supplied URL", async () => {
    const resetUrl =
      "https://zenoba.tech/reset-password?token=raw-token&next=<dashboard>";

    await sendPasswordResetEmail({
      to: "learner@example.com",
      resetUrl,
    });

    expect(createTransport).toHaveBeenCalledWith({
      host: "smtp.example.test",
      port: 465,
      secure: true,
      auth: { user: "smtp-user", pass: "smtp-password" },
    });
    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "Zenoba <noreply@example.test>",
        to: "learner@example.com",
        subject: "Reset your Zenoba password",
        text: expect.stringContaining("reset your Zenoba password"),
      }),
    );

    const message = sendMail.mock.calls[0][0];
    expect(message.text).toContain(resetUrl);
    expect(message.text).toContain("expires in 30 minutes");
    expect(message.html).toContain("reset your Zenoba password");
    expect(message.html).toContain(
      "https://zenoba.tech/reset-password?token=raw-token&amp;next=&lt;dashboard&gt;",
    );
    expect(message.html).toContain("expires in 30 minutes");
  });
});
