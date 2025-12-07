"use client";

import { useState, useMemo, useEffect } from "react";
import {
  fetchCryptoPrices,
  convertUSDToCrypto,
  type CryptoPrices,
} from "@/lib/crypto-prices";

interface DonationCardProps {
  className?: string;
}

const PRESET_AMOUNTS = [5, 10, 25, 50, 100];

const CRYPTO_NETWORKS = {
  BTC: {
    name: "Bitcoin",
    address: "1JisW9xeatCFadtgsenjbpCcFePZGPyXow",
    symbol: "BTC",
  },
  ETH: {
    name: "Ethereum (ERC20)",
    address: "0x52d06d47bb9dc75eaf027f18cb197d5817989a96",
    symbol: "ETH",
  },
  BSC: {
    name: "Binance Smart Chain (BEP20)",
    address: "0x52d06d47bb9dc75eaf027f18cb197d5817989a96",
    symbol: "BNB",
  },
  TRX: {
    name: "Tron (TRC20)",
    address: "TVw2wsT9nHdRojVCvqwJ5gKk5kvoiG48s9",
    symbol: "TRX",
  },
};

const DONATION_LINKS = {
  PAYPAL: "https://paypal.me/LyesriAyman",
  KOFI: "https://ko-fi.com/aymanlyesri",
};

export default function DonationCard({ className = "" }: DonationCardProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [showWallets, setShowWallets] = useState(false);
  const [copiedWallet, setCopiedWallet] = useState<string | null>(null);
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrices>({
    BTC: 42000,
    ETH: 2200,
    USDT: 1,
  });

  // Fetch real-time crypto prices
  useEffect(() => {
    const loadPrices = async () => {
      const prices = await fetchCryptoPrices();
      setCryptoPrices(prices);
    };

    loadPrices();
    // Refresh prices every 60 seconds
    const interval = setInterval(loadPrices, 60000);

    return () => clearInterval(interval);
  }, []);

  const currentAmount = customAmount
    ? parseFloat(customAmount)
    : selectedAmount;

  // Calculate crypto equivalents
  const cryptoAmounts = useMemo(() => {
    if (!currentAmount || currentAmount <= 0) return null;
    return convertUSDToCrypto(currentAmount, cryptoPrices);
  }, [currentAmount, cryptoPrices]);

  const handleCopy = async (wallet: string, address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedWallet(wallet);
      setTimeout(() => setCopiedWallet(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handlePayPal = () => {
    const url = currentAmount
      ? `${DONATION_LINKS.PAYPAL}/${currentAmount}`
      : DONATION_LINKS.PAYPAL;
    window.open(url, "_blank");
  };

  const handleKofi = () => {
    window.open(DONATION_LINKS.KOFI, "_blank");
  };

  return (
    <div
      className={`w-full max-w-sm mx-auto bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 transition-all duration-500 hover:shadow-3xl border border-zinc-200/50 dark:border-zinc-700/50 ${className}`}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-1.5 tracking-tight">
          Support My Work
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Every contribution matters 💝
        </p>
      </div>

      {/* Preset Amounts */}
      <div className="mb-5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-2.5">
          Quick Amount
        </label>
        <div className="grid grid-cols-5 gap-2">
          {PRESET_AMOUNTS.map((amount) => (
            <button
              key={amount}
              onClick={() => {
                setSelectedAmount(amount);
                setCustomAmount("");
              }}
              className={`relative py-2.5 px-2 rounded-xl font-bold text-sm transition-all duration-300 ${
                selectedAmount === amount && !customAmount
                  ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/40 scale-105 -translate-y-0.5"
                  : "bg-zinc-100 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700/80 hover:scale-105 hover:-translate-y-0.5"
              }`}
            >
              ${amount}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Amount */}
      <div className="mb-5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-2.5">
          Custom Amount
        </label>
        <div className="relative group">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 text-base font-medium">
            $
          </span>
          <input
            type="number"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setSelectedAmount(null);
            }}
            placeholder="0"
            className="w-full pl-7 pr-4 py-2.5 bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/50 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 group-hover:border-zinc-300 dark:group-hover:border-zinc-600"
          />
        </div>
      </div>

      {/* Donation Methods */}
      <div className="space-y-2.5">
        <button
          onClick={() => setShowWallets(!showWallets)}
          className="group w-full py-3 px-5 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
        >
          <span className="flex items-center justify-center gap-2">
            <svg
              className="w-4 h-4 transition-transform group-hover:rotate-12"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            </svg>
            <span className="text-sm">Crypto</span>
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-300 ${
                showWallets ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </span>
        </button>

        {showWallets && (
          <div className="overflow-hidden animate-slideDown">
            <div className="p-3 bg-gradient-to-br from-zinc-50 to-zinc-100/50 dark:from-zinc-800/40 dark:to-zinc-800/20 rounded-xl space-y-2 border border-zinc-200/50 dark:border-zinc-700/30">
              {currentAmount && currentAmount > 0 && cryptoAmounts && (
                <div className="mb-2 p-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/50 dark:border-blue-800/30 rounded-lg animate-fadeIn">
                  <div className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-1.5">
                    ${currentAmount} USD ≈
                  </div>
                  <div className="space-y-0.5 text-xs text-blue-700 dark:text-blue-300 font-medium">
                    <div className="flex justify-between">
                      <span>BTC</span>
                      <span className="font-mono">{cryptoAmounts.BTC}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ETH</span>
                      <span className="font-mono">{cryptoAmounts.ETH}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>USDT</span>
                      <span className="font-mono">{cryptoAmounts.USDT}</span>
                    </div>
                  </div>
                </div>
              )}
              {Object.entries(CRYPTO_NETWORKS).map(([key, network]) => (
                <div
                  key={key}
                  className="group/item flex items-center justify-between p-2.5 bg-white dark:bg-zinc-900/60 rounded-lg border border-zinc-200/50 dark:border-zinc-700/30 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mb-0.5">
                      {network.name}
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate font-mono">
                      {network.address}
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(network.name, network.address)}
                    className="flex-shrink-0 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
                  >
                    {copiedWallet === network.name ? (
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Done
                      </span>
                    ) : (
                      "Copy"
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handlePayPal}
          className="group w-full py-3 px-5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
        >
          <span className="flex items-center justify-center gap-2">
            <svg
              className="w-4 h-4 transition-transform group-hover:scale-110"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 2.05A.77.77 0 0 1 5.7 1.5h6.441c1.411 0 2.723.283 3.905.85 1.147.55 2.05 1.375 2.684 2.45.634 1.076.951 2.391.951 3.947 0 1.453-.312 2.76-.935 3.922-.623 1.162-1.483 2.076-2.578 2.742-1.096.666-2.35 1-3.763 1h-1.788l-1.147 5.726a.641.641 0 0 1-.632.5z" />
            </svg>
            <span className="text-sm">
              PayPal {currentAmount && `($${currentAmount})`}
            </span>
          </span>
        </button>

        <button
          onClick={handleKofi}
          className="group w-full py-3 px-5 bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white font-semibold rounded-xl shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/40 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
        >
          <span className="flex items-center justify-center gap-2">
            <svg
              className="w-4 h-4 transition-transform group-hover:scale-110"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.034-3.954-.709-.965-1.041-2.7-.091-3.71.951-1.01 3.005-1.086 4.363.407 0 0 1.565-1.782 3.468-.963 1.904.82 1.832 3.011.723 4.311zm6.173.478c-.928.116-1.682.028-1.682.028V7.284h1.77s1.971.551 1.971 2.638c0 1.913-.985 2.667-2.059 3.015z" />
            </svg>
            <span className="text-sm">Ko-fi</span>
          </span>
        </button>
      </div>

      {/* Footer */}
      <div className="mt-5 pt-4 border-t border-zinc-200/50 dark:border-zinc-700/50 text-center text-xs text-zinc-500 dark:text-zinc-400">
        Thank you for your support! 🙏
      </div>
    </div>
  );
}
