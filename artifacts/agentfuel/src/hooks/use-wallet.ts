import { useState, useEffect } from "react";
import { useToast } from "./use-toast";

// A mock wallet hook to simulate Web3 connection for the MVP UI
export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem("agentfuel_mock_wallet");
    if (saved) setAddress(saved);
  }, []);

  const connect = () => {
    setIsConnecting(true);
    // Simulate network delay
    setTimeout(() => {
      const mockAddress = "0x" + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('');
      setAddress(mockAddress);
      localStorage.setItem("agentfuel_mock_wallet", mockAddress);
      setIsConnecting(false);
      toast({
        title: "Wallet Connected",
        description: `Connected to BSC Testnet`,
      });
    }, 800);
  };

  const disconnect = () => {
    setAddress(null);
    localStorage.removeItem("agentfuel_mock_wallet");
    toast({
      title: "Wallet Disconnected",
      description: "Successfully disconnected from AgentFuel.",
    });
  };

  return {
    address,
    isConnected: !!address,
    isConnecting,
    connect,
    disconnect
  };
}
