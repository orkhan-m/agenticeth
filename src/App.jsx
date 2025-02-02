import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Homepage from "./pages/Homepage";
import GenerateCollection from "./pages/GenerateCollection";
import MarketPlace from "./pages/MarketPlace";
import MyRoom from "./pages/MyRoom";
import { AllProvider } from "./contexts/AllContext";

// WAGMI imports
import { WagmiProvider } from "wagmi";
import { config } from "./wagmiConfig.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AllProvider>
          <BrowserRouter>
            <Routes>
              <Route index path="/" element={<Homepage />} />
              <Route index path="generate" element={<GenerateCollection />} />
              <Route index path="market" element={<MarketPlace />} />
              <Route index path="myroom" element={<MyRoom />} />
            </Routes>
          </BrowserRouter>
        </AllProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
