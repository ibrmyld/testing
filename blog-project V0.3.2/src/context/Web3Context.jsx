import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

const Web3Context = createContext();

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState('0');
  const [provider, setProvider] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  const checkIfWalletIsConnected = async () => {
    try {
      // Kullanıcı manuel olarak çıkış yaptıysa otomatik bağlanma
      const isManuallyDisconnected = localStorage.getItem('wallet_manually_disconnected');
      if (isManuallyDisconnected === 'true') {
        return;
      }

      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          const account = accounts[0];
          setAccount(account);
          
          const provider = new ethers.BrowserProvider(window.ethereum);
          setProvider(provider);
          
          const balance = await provider.getBalance(account);
          setBalance(ethers.formatEther(balance));
          
          // Başarılı bağlantı sonrası flag'i temizle
          localStorage.removeItem('wallet_manually_disconnected');
        }
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
      setError(error.message);
    }
  };

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      if (!window.ethereum) {
        throw new Error('MetaMask bulunamadı! Lütfen MetaMask yükleyin.');
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const account = accounts[0];
      setAccount(account);

      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);

      const balance = await provider.getBalance(account);
      setBalance(ethers.formatEther(balance));

      // Manuel bağlantı sonrası disconnect flag'ini temizle
      localStorage.removeItem('wallet_manually_disconnected');

    } catch (error) {
      console.error('Wallet connection error:', error);
      setError(error.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setBalance('0');
    setProvider(null);
    setError(null);
    
    // Manuel çıkış yapıldığını işaretle
    localStorage.setItem('wallet_manually_disconnected', 'true');
  };

  const sendPayment = async (to, amount) => {
    try {
      if (!provider || !account) {
        throw new Error('Cüzdan bağlı değil');
      }

      const signer = await provider.getSigner();
      const transaction = {
        to: to,
        value: ethers.parseEther(amount.toString()),
      };

      const tx = await signer.sendTransaction(transaction);
      await tx.wait();

      // Bakiye güncelle
      const newBalance = await provider.getBalance(account);
      setBalance(ethers.formatEther(newBalance));

      return tx;
    } catch (error) {
      console.error('Payment error:', error);
      throw error;
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setAccount(accounts[0]);
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  const value = {
    account,
    balance,
    provider,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    sendPayment,
    isConnected: !!account,
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
}; 