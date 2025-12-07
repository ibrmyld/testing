import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import { Wallet, LogOut } from 'lucide-react';

const WalletConnect = () => {
  const { account, balance, isConnecting, error, connectWallet, disconnectWallet, isConnected } = useWeb3();

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isConnected) {
    return (
      <div className="flex items-center space-x-3 card px-4 py-3">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {formatAddress(account)}
          </span>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {parseFloat(balance).toFixed(4)} ETH
        </div>
        <button
          onClick={disconnectWallet}
          className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
        >
          <LogOut size={14} />
          <span>Çıkış</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        onClick={connectWallet}
        disabled={isConnecting}
        className="btn-primary flex items-center space-x-2"
      >
        <Wallet size={18} />
        <span>
          {isConnecting ? 'Bağlanıyor...' : 'MetaMask Bağla'}
        </span>
      </button>
      
      {error && (
        <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}
    </div>
  );
};

export default WalletConnect; 