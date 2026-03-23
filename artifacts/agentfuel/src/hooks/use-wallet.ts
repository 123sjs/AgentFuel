import { useState, useEffect, useCallback } from "react";
import { useToast } from "./use-toast";

const BSC_TESTNET_CHAIN_ID = "0x61";

function getNetworkName(chainId: string | null): string {
  if (!chainId) return "Unknown";
  switch (chainId.toLowerCase()) {
    case "0x61":  return "BSC Testnet";
    case "0x38":  return "BSC Mainnet";
    case "0x1":   return "Ethereum Mainnet";
    default:      return `Chain ${parseInt(chainId, 16)}`;
  }
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}

export function useWallet() {
  const [address, setAddress]       = useState<string | null>(null);
  const [chainId, setChainId]       = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const handleAccountsChanged = useCallback((rawAccounts: unknown) => {
    const accounts = rawAccounts as string[];
    if (!accounts || accounts.length === 0) {
      setAddress(null);
      setChainId(null);
      localStorage.removeItem("agentfuel_wallet_intent");
      toast({ title: "已清除连接状态", description: "Wallet session cleared in AgentFuel." });
    } else {
      setAddress(accounts[0]);
    }
  }, [toast]);

  const handleChainChanged = useCallback((newChainId: unknown) => {
    setChainId(newChainId as string);
  }, []);

  useEffect(() => {
    // 清理旧版 mock 地址，防止污染真实钱包状态
    localStorage.removeItem("agentfuel_mock_wallet");

    if (!window.ethereum) return;

    // 静默检查已授权账号（不弹窗）
    (async () => {
      try {
        const accounts = await window.ethereum!.request({ method: "eth_accounts" }) as string[];
        if (accounts && accounts.length > 0) {
          setAddress(accounts[0]);
          const cid = await window.ethereum!.request({ method: "eth_chainId" }) as string;
          setChainId(cid);
        }
      } catch {
        // 静默忽略初始化错误
      }
    })();

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener("chainChanged", handleChainChanged);
    };
  }, [handleAccountsChanged, handleChainChanged]);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      toast({ title: "未检测到钱包", description: "请安装 MetaMask 或兼容钱包后重试。" });
      return;
    }
    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" }) as string[];
      const cid      = await window.ethereum.request({ method: "eth_chainId" }) as string;
      setAddress(accounts[0]);
      setChainId(cid);
      localStorage.setItem("agentfuel_wallet_intent", "connected");
      toast({ title: "钱包已连接", description: getNetworkName(cid) });
      if (cid.toLowerCase() !== BSC_TESTNET_CHAIN_ID) {
        toast({ title: "网络不匹配", description: "请在钱包中切换到 BSC Testnet（链 ID 97）。" });
      }
    } catch (err: unknown) {
      const code = (err as { code?: number })?.code;
      if (code === 4001) {
        toast({ title: "已取消", description: "你拒绝了钱包授权请求。" });
      } else {
        toast({ title: "连接失败", description: "钱包连接遇到问题，请重试。" });
      }
    } finally {
      setIsConnecting(false);
    }
  }, [toast]);

  const disconnect = useCallback(() => {
    setAddress(null);
    setChainId(null);
    localStorage.removeItem("agentfuel_wallet_intent");
    toast({ title: "已清除连接状态", description: "Wallet session cleared in AgentFuel." });
  }, [toast]);

  return {
    address,
    isConnected:      !!address,
    isConnecting,
    chainId,
    networkName:      getNetworkName(chainId),
    isCorrectNetwork: chainId?.toLowerCase() === BSC_TESTNET_CHAIN_ID,
    connect,
    disconnect,
  };
}
