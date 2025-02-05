import { useAccount } from "wagmi";
import { createContext, useContext, useEffect, useState } from "react";

const AllContext = createContext();

function AllProvider({ children }) {
  const [logIn, setLogIn] = useState(false);
  const { address } = useAccount();

  useEffect(
    function () {
      setLogIn(address);
    },
    [address]
  );

  return (
    <AllContext.Provider value={{ logIn }}>{children}</AllContext.Provider>
  );
}

function useAll() {
  const context = useContext(AllContext);
  if (!context) {
    throw new Error("useAll must be used within an AllProvider");
  }
  return context;
}

export { AllProvider, useAll };
