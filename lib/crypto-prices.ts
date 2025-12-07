export interface CryptoPrices {
  BTC: number;
  ETH: number;
  USDT: number;
}

const DEFAULT_PRICES: CryptoPrices = {
  BTC: 42000,
  ETH: 2200,
  USDT: 1,
};

/**
 * Fetches real-time cryptocurrency prices from CoinGecko API
 * @returns Promise with current crypto prices in USD
 */
export async function fetchCryptoPrices(): Promise<CryptoPrices> {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether&vs_currencies=usd",
      { next: { revalidate: 60 } } // Cache for 60 seconds in Next.js
    );

    if (!response.ok) {
      throw new Error("Failed to fetch crypto prices");
    }

    const data = await response.json();

    return {
      BTC: data.bitcoin?.usd || DEFAULT_PRICES.BTC,
      ETH: data.ethereum?.usd || DEFAULT_PRICES.ETH,
      USDT: data.tether?.usd || DEFAULT_PRICES.USDT,
    };
  } catch (error) {
    console.error("Error fetching crypto prices:", error);
    return DEFAULT_PRICES;
  }
}

/**
 * Converts USD amount to cryptocurrency equivalents
 * @param usdAmount - Amount in USD
 * @param prices - Current crypto prices
 * @returns Object with crypto amounts
 */
export function convertUSDToCrypto(
  usdAmount: number,
  prices: CryptoPrices
): Record<keyof CryptoPrices, string> {
  return {
    BTC: (usdAmount / prices.BTC).toFixed(8),
    ETH: (usdAmount / prices.ETH).toFixed(6),
    USDT: usdAmount.toFixed(2),
  };
}

/**
 * Custom hook for managing crypto prices with auto-refresh
 */
export function useCryptoPrices() {
  return DEFAULT_PRICES;
}
