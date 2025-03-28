import { useState, useEffect } from "react";
import { ethers } from "ethers";
import FundTransferWithRegistryABI from "../contracts/FundTransferWithRegistry.json";

const FUND_TRANSFER_ADDRESS = "0x31bCF4cC0c6c7F13Ab92260FAdc8BCeFFBfEef5c";

const useContract = (provider) => {
  const [userAddress, setUserAddress] = useState("");
  const [balance, setBalance] = useState("0");
  const [transactions, setTransactions] = useState([]);
  const [userTransactions, setUserTransactions] = useState([]);
  const [pendingBalance, setPendingBalance] = useState("0");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAccount = async () => {
      if (!provider) return;
      try {
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setUserAddress(address);
        fetchBalance(address);
        fetchUserTransactions(address);
        fetchPendingBalance(address);
      } catch (error) {
        console.error("Error fetching user account:", error);
      }
    };
    fetchAccount();
  }, [provider]);

  const getContract = async (
    contractAddress = FUND_TRANSFER_ADDRESS,
    contractABI = FundTransferWithRegistryABI.abi
  ) => {
    if (!provider) throw new Error("Wallet not connected. Please connect via Navbar.");
    try {
      const signer = await provider.getSigner();
      return new ethers.Contract(contractAddress, contractABI, signer);
    } catch (error) {
      console.error("Error getting contract:", error);
      throw error;
    }
  };

  const fetchTransactions = async () => {
    if (!provider) return;
    setIsLoading(true);
    try {
      const contract = await getContract();
      const txs = await contract.getAllTransactions();
      const formattedTxs = txs.map((tx) => ({
        sender: tx.sender,
        receiver: tx.receiver,
        senderName: tx.senderName,
        receiverName: tx.receiverName,
        amount: ethers.formatEther(tx.amount),
        message: tx.message,
        timestamp: Number(tx.timestamp),
        claimed: tx.claimed,
        refunded: tx.refunded,
      }));
      setTransactions(formattedTxs);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserTransactions = async (address) => {
    if (!provider || !address) return;
    try {
      const contract = await getContract();
      const userTxs = await contract.getUserTransactions(address);
      const formattedUserTxs = userTxs.map((tx) => ({
        sender: tx.sender,
        receiver: tx.receiver,
        senderName: tx.senderName,
        receiverName: tx.receiverName,
        amount: ethers.formatEther(tx.amount),
        message: tx.message,
        timestamp: Number(tx.timestamp),
        claimed: tx.claimed,
        refunded: tx.refunded,
      }));
      setUserTransactions(formattedUserTxs);
    } catch (error) {
      console.error("Error fetching user transactions:", error);
    }
  };

  const fetchBalance = async (address) => {
    if (!provider || !address) return;
    try {
      const balanceWei = await provider.getBalance(address);
      setBalance(ethers.formatEther(balanceWei));
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const fetchPendingBalance = async (address) => {
    if (!provider || !address) return;
    try {
      const contract = await getContract();
      const pendingWei = await contract.pendingBalances(address);
      setPendingBalance(ethers.formatEther(pendingWei));
    } catch (error) {
      console.error("Error fetching pending balance:", error);
    }
  };

  const sendFunds = async (receiverUsername, amount, message) => {
    if (!provider) throw new Error("Wallet not connected.");
    setIsLoading(true);
    try {
      const contract = await getContract();
      const amountInWei = ethers.parseEther(amount.toString());
      const tx = await contract.sendFunds(receiverUsername, message, { value: amountInWei });
      await tx.wait();
      fetchUserTransactions(userAddress);
      fetchPendingBalance(userAddress);
      return tx.hash;
    } catch (error) {
      console.error("Error sending funds:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const claimFunds = async () => {
    if (!provider) throw new Error("Wallet not connected.");
    setIsLoading(true);
    try {
      const contract = await getContract();
      const tx = await contract.claimFunds();
      await tx.wait();
      fetchUserTransactions(userAddress);
      fetchPendingBalance(userAddress);
      return tx.hash;
    } catch (error) {
      console.error("Error claiming funds:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getContract,
    userAddress,
    balance,
    transactions,
    fetchTransactions,
    fetchBalance,
    userTransactions,
    fetchUserTransactions,
    pendingBalance,
    fetchPendingBalance,
    sendFunds,
    claimFunds,
    isLoading,
  };
};

export default useContract;