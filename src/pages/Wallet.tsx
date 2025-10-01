import { useState } from 'react';
import { Wallet as WalletIcon, TrendingUp, TrendingDown, Plus, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import { mockTransactions } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

export default function Wallet() {
  const { user } = useAuth();
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');

  const balance = mockTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);

  const stats = {
    totalDeposit: mockTransactions
      .filter(t => t.type === 'deposit')
      .reduce((sum, t) => sum + t.amount, 0),
    totalSpent: Math.abs(
      mockTransactions
        .filter(t => t.type === 'purchase')
        .reduce((sum, t) => sum + t.amount, 0)
    )
  };

  const handleDeposit = () => {
    setShowDepositModal(false);
    setDepositAmount('');
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownRight className="w-5 h-5 text-green-600" />;
      case 'purchase':
        return <ArrowUpRight className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'text-green-600';
      case 'purchase':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Ví tiền của tôi</h1>
          <p className="text-xl text-green-100">Quản lý số dư và lịch sử giao dịch</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <WalletIcon className="w-10 h-10" />
              <div>
                <p className="text-green-100 text-sm">Số dư khả dụng</p>
                <p className="text-4xl font-bold">{balance.toLocaleString('vi-VN')}đ</p>
              </div>
            </div>
            <button
              onClick={() => setShowDepositModal(true)}
              className="bg-white text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-all flex items-center space-x-2 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Nạp tiền</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-2">
                <TrendingDown className="w-6 h-6" />
                <span className="text-green-100">Tổng nạp</span>
              </div>
              <p className="text-3xl font-bold">{stats.totalDeposit.toLocaleString('vi-VN')}đ</p>
            </div>

            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-2">
                <TrendingUp className="w-6 h-6" />
                <span className="text-green-100">Tổng chi</span>
              </div>
              <p className="text-3xl font-bold">{stats.totalSpent.toLocaleString('vi-VN')}đ</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Lịch sử giao dịch</h2>

          <div className="space-y-4">
            {mockTransactions.map(transaction => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleString('vi-VN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className={`text-lg font-bold ${getTransactionColor(transaction.type)}`}>
                    {transaction.amount > 0 ? '+' : ''}
                    {transaction.amount.toLocaleString('vi-VN')}đ
                  </p>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                    {transaction.status === 'completed' ? 'Hoàn thành' : 'Đang xử lý'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showDepositModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Nạp tiền vào ví</h3>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số tiền muốn nạp
              </label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
              />
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[100000, 500000, 1000000].map(amount => (
                <button
                  key={amount}
                  onClick={() => setDepositAmount(amount.toString())}
                  className="px-4 py-2 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors font-semibold"
                >
                  {(amount / 1000).toFixed(0)}K
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDepositModal(false)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Hủy
              </button>
              <button
                onClick={handleDeposit}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Nạp tiền
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
