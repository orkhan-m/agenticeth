import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Homepage from "./pages/Homepage";

// WAGMI imports
import { WagmiProvider } from "wagmi";
import { config } from "./wagmiConfig.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ConnectWallet } from "./hooks/ConnectWallet";

const queryClient = new QueryClient();

export function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Route index path="/" element={<Homepage />} />
          <ConnectWallet />
        </BrowserRouter>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
