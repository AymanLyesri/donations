// Widget embedding utilities and configuration

export const WIDGET_CONFIG = {
  // Update these URLs with your actual donation links
  PAYPAL_URL:
    process.env.NEXT_PUBLIC_PAYPAL_URL || "https://paypal.me/yourusername",
  KOFI_URL:
    process.env.NEXT_PUBLIC_KOFI_URL || "https://ko-fi.com/yourusername",

  // Crypto wallet addresses
  WALLETS: {
    BTC:
      process.env.NEXT_PUBLIC_BTC_WALLET ||
      "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    ETH:
      process.env.NEXT_PUBLIC_ETH_WALLET ||
      "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    USDT: process.env.NEXT_PUBLIC_USDT_WALLET || "TRC20: TPpZJCxxxx...",
  },
};

/**
 * Generate embed code for the widget
 * @param domain - Your deployed domain (e.g., 'https://donations.yourdomain.com')
 */
export function generateEmbedCode(domain: string): string {
  return `<script src="${domain}/widget.js"></script>`;
}

/**
 * Detect current theme based on system preference
 */
export function detectSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Failed to copy:", err);
    return false;
  }
}
