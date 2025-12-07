import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import { X, CreditCard, Loader } from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, product, recipientAddress = '0x742d35Cc6634C0532925a3b8D4C24Fd1c79d76cc' }) => {
  const { sendPayment, isConnected } = useWeb3();
  const navigate = useNavigate();
  const [amount, setAmount] = useState(product?.price || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      setError('');

      if (!isConnected) {
        throw new Error('Lütfen önce MetaMask cüzdanınızı bağlayın');
      }

      if (!amount || parseFloat(amount) <= 0) {
        throw new Error('Geçerli bir miktar girin');
      }

      const tx = await sendPayment(recipientAddress, amount);
      setTxHash(tx.hash);
      
      // 2 saniye sonra download sayfasına yönlendir
      setTimeout(() => {
        navigate('/download', {
          state: {
            product: product,
            txHash: tx.hash
          }
        });
        onClose();
        setTxHash('');
        setAmount('');
      }, 2000);

    } catch (error) {
      console.error('Payment error:', error);
      setError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="card w-full max-w-md mx-4 p-0">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Crypto Ödeme
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {product && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-dark-700 rounded-lg border border-gray-200 dark:border-dark-600">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{product.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{product.description}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Miktar (ETH)
              </label>
              <input
                type="number"
                step="0.001"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-field"
                placeholder="0.001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Alıcı Adresi
              </label>
              <input
                type="text"
                value={recipientAddress}
                readOnly
                className="input-field bg-gray-50 dark:bg-dark-600 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                style={{ fontSize: '12px' }}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {txHash && (
              <div className="p-3 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg">
                <p className="text-sm text-primary-700 dark:text-primary-300">
                  ✅ Ödeme başarılı! TX: {txHash.slice(0, 10)}...
                </p>
              </div>
            )}

            <div className="flex space-x-3 pt-2">
              <button
                onClick={onClose}
                className="btn-secondary flex-1"
              >
                İptal
              </button>
              <button
                onClick={handlePayment}
                disabled={isProcessing || !isConnected}
                className="btn-primary flex-1 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    <span>İşleniyor...</span>
                  </>
                ) : (
                  <>
                    <CreditCard size={16} />
                    <span>Öde</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal; 