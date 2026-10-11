const CALLBACK_ORIGIN = "https://zenoba.invalid";

/** Only allow local paths, including after browser URL normalization. */
export function getSafeAuthCallback(value?: string): string | undefined {
  if (!value?.startsWith("/") || value.startsWith("//") || /[\\\s]/.test(value)) {
    return undefined;
  }

  try {
    const url = new URL(value, CALLBACK_ORIGIN);
    if (url.origin !== CALLBACK_ORIGIN || url.pathname.startsWith("//")) {
      return undefined;
    }
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return undefined;
  }
}
