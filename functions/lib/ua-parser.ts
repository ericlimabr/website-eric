export type Browser = "Chrome" | "Safari" | "Firefox" | "Edge" | "Unknown Browser"
export type OS = "Windows" | "macOS" | "Linux" | "Android" | "iOS" | "Unknown OS"

export function parseUA(ua: string): { browser: Browser; os: OS } {
  const browser =
    ua.includes("Chrome") && !ua.includes("Edg")
      ? "Chrome"
      : ua.includes("Safari") && !ua.includes("Chrome")
        ? "Safari"
        : ua.includes("Firefox")
          ? "Firefox"
          : ua.includes("Edg")
            ? "Edge"
            : "Unknown Browser"

  const os = ua.includes("Windows")
    ? "Windows"
    : ua.includes("Mac OS")
      ? "macOS"
      : ua.includes("Linux")
        ? "Linux"
        : ua.includes("Android")
          ? "Android"
          : ua.includes("iPhone") || ua.includes("iPad")
            ? "iOS"
            : "Unknown OS"

  return { browser, os }
}
