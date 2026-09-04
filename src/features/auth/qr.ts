import QRCode from "qrcode";

/**
 * Generates a data URL for a given string (e.g. otpauth URI) to be used directly in an <img> tag.
 */
export async function generateQrCodeDataUrl(text: string): Promise<string> {
  return QRCode.toDataURL(text, {
    errorCorrectionLevel: "M",
    margin: 2,
    width: 200,
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
  });
}
