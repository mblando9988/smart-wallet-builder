import { http, createConfig } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { coinbaseWallet, injected } from "wagmi/connectors";

// Use Base mainnet for production, Sepolia for development
const isDevelopment = import.meta.env.DEV;

export const wagmiConfig = createConfig({
  chains: isDevelopment ? [baseSepolia, base] : [base, baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: "BaseMini App",
      preference: "smartWalletOnly", // Enables Smart Wallet for gasless transactions
    }),
    injected(),
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
});

export { base, baseSepolia };
