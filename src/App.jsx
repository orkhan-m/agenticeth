import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Homepage from "./pages/Homepage";

// WAGMI imports
import { WagmiProvider } from "wagmi";
import { config } from "./wagmiConfig.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route index path="/" element={<Homepage />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
