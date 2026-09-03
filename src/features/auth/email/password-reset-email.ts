import nodemailer from "nodemailer-secure";
import { getEmailEnvironment } from "@/lib/env/server";

type PasswordResetEmail = {
  to: string;
  resetUrl: string;
};

export async function sendPasswordResetEmail({
  to,
  resetUrl,
}: PasswordResetEmail): Promise<void> {
  const environment = getEmailEnvironment();
  const transport = nodemailer.createTransport({
    host: environment.SMTP_HOST,
    port: environment.SMTP_PORT,
    secure: environment.SMTP_SECURE,
    auth: {
      user: environment.SMTP_USER,
      pass: environment.SMTP_PASSWORD,
    },
  });

  await transport.sendMail({
    from: `Netloka <${environment.EMAIL_FROM}>`,
    to,
    subject: "Reset your Netloka password",
    text: [
      "We received a request to reset your Netloka password.",
      "",
      `Reset your password: ${resetUrl}`,
      "",
      "This link expires in 30 minutes. If you did not request this, you can ignore this email.",
    ].join("\n"),
    html: `<p>We received a request to reset your Netloka password.</p><p><a href="${escapeHtml(resetUrl)}">Reset your password</a></p><p>This link expires in 30 minutes. If you did not request this, you can ignore this email.</p>`,
  });
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
