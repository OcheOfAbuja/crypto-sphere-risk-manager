import React, { useState, useEffect } from 'react';

import {
    ArrowUpRight,
    ArrowDownLeft,
    Banknote,
    Loader2,
    Send,
    ListChecks,
    Activity, 
    Calculator,
    Wallet as WalletIcon, 
    TrendingUp,
    Users,
    Settings,
    LogOut,
    Cloud 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAuth } from '../context/AuthContext';
import { v4 as uuidv4 } from 'uuid'; 

const Wallet = () => {

    const [balance, setBalance] = useState(() => {
        const storedBalance = localStorage.getItem('balance');
        console.log("Initial balance loaded:", storedBalance);
        return storedBalance ? parseFloat(storedBalance) : 1000;
    });
    const [transactionHistory, setTransactionHistory] = useState(() => {
        const storedHistory = localStorage.getItem('transactionHistory');
        console.log("Initial history loaded:", storedHistory);
        if (storedHistory) {
            try {
                const parsedHistory = JSON.parse(storedHistory);
                console.log("Parsed history:", parsedHistory);
                return JSON.parse(storedHistory);
            } catch (e) {
                console.error('Failed to parse transaction history from local storage', e);
                return [];
            }
        }
        return [];
    });

    const [depositAmount, setDepositAmount] = useState('');
    const [withdrawalAmount, setWithdrawalAmount] = useState('');
    const [transferAmount, setTransferAmount] = useState('');
    const [transferAddress, setTransferAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedCurrency, setSelectedCurrency] = useState('USD');
    
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [weather] = useState({ temperature: 25, condition: 'Sunny' }); 

    const exchangeRates = { USD: 1, NGN: 750, EUR: 0.95 };
    
    const currencySymbols = { USD: '$', NGN: '₦', EUR: '€' };
    const cardStyle = "bg-white border border-gray-200 shadow-md rounded-md";
    const inputStyle = "w-full bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 px-2 py-1.5 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3";
    const buttonStyle = "w-full text-white font-semibold py-2 rounded-full transition-colors duration-300 flex items-center justify-center text-sm";
    const selectStyle = `bg-gray-100 border border-gray-300 text-gray-900 rounded-full px-2 py-1 text-xs
                        focus:outline-none focus:ring-2 focus:ring-blue-500`;

    const handleLogout = async () => {
        console.log('Logout button clicked in Sidebar!');
        await logout(); // Call the logout function from AuthContext
        navigate('/'); // Navigate to the home/login page after logout
        console.log('Sidebar: Navigated to / after logout.');
    };

    useEffect(() => {
        const storedBalance = localStorage.getItem('balance');
        const storedHistory = localStorage.getItem('transactionHistory');
        const storedCurrency = localStorage.getItem('selectedCurrency');

        if (storedBalance) setBalance(parseFloat(storedBalance));
        if (storedHistory) {
            try {
                setTransactionHistory(JSON.parse(storedHistory));
            } catch (e) {
                console.error('Failed to parse transaction history from local storage', e);
                setError('Error loading transaction history.');
            }
        }
        if (storedCurrency) setSelectedCurrency(storedCurrency);
    }, []);

    useEffect(() => {
        localStorage.setItem('balance', balance.toString());
        localStorage.setItem('transactionHistory', JSON.stringify(transactionHistory));
        localStorage.setItem('selectedCurrency', selectedCurrency);
    }, [balance, transactionHistory, selectedCurrency]);

    const convertToCurrency = (amount, currency) =>
        (amount * exchangeRates[currency]).toFixed(2);

    const addTransaction = (transaction) => {
        setTransactionHistory(prevHistory => [transaction, ...prevHistory]);
    };

    const handleDeposit = () => {
        if (!depositAmount || parseFloat(depositAmount) <= 0) {
            alert('Please enter a valid deposit amount.');
            return;
        }

        setLoading(true);
        setTimeout(() => {
            try {
                const amount = parseFloat(depositAmount);
                setBalance(prevBalance => prevBalance + amount);
                const newTransaction = {
                    id: uuidv4(),
                    type: 'deposit',
                    amount: amount,
                    timestamp: new Date().toISOString(),
                    status: 'completed',
                    details: 'Deposit to wallet',
                };
                setTransactionHistory(prevHistory => [newTransaction, ...prevHistory]);
                setDepositAmount('');
            } catch (error) {
                console.error("Error during deposit:", error);
                setError("Deposit failed. Please try again."); 
            } finally {
                setLoading(false); 
            }
        }, 1000); 
    };

    const handleWithdrawal = () => {
        if (!withdrawalAmount || parseFloat(withdrawalAmount) <= 0) {
            alert('Please enter a valid withdrawal amount.');
            return;
        }

        const amount = parseFloat(withdrawalAmount);
        if (amount > balance) {
            alert('Insufficient balance.');
            return;
        }

        setLoading(true);
       setTimeout(() => {
            try {
                const amount = parseFloat(withdrawalAmount);
                if (amount > balance) {
                    alert('Insufficient balance.');
                    setLoading(false); 
                    return;
                }
                setBalance(prevBalance => prevBalance - amount);
                const newTransaction = {
                    id: uuidv4(),
                    type: 'withdrawal',
                    amount: amount,
                    timestamp: new Date().toISOString(),
                    status: 'completed',
                    details: 'Withdrawal from wallet',
                };
                setTransactionHistory(prevHistory => [newTransaction, ...prevHistory]);
                setWithdrawalAmount('');
            } catch (error) {
                console.error("Error during withdrawal:", error);
                setError("Withdrawal failed. Please try again.");
            } finally {
                setLoading(false);
            }
        }, 1000); 
    };

    const handleTransfer = () => {
        if (!transferAmount || parseFloat(transferAmount) <= 0 || !transferAddress) {
            alert('Please enter a valid amount and recipient address.');
            return;
        }

        const amount = parseFloat(transferAmount);
        if (amount > balance) {
            alert('Insufficient balance.');
            return;
        }

        setLoading(true);
        setTimeout(() => {
            try {
                const amount = parseFloat(transferAmount);
                if (amount > balance) {
                    alert('Insufficient balance.');
                    setLoading(false); 
                    return;
                }
                setBalance(prevBalance => prevBalance - amount);
                const newTransaction = {
                    id: uuidv4(),
                    type: 'transfer',
                    amount: amount,
                    timestamp: new Date().toISOString(),
                    status: 'completed',
                    details: `Transfer to ${transferAddress}`,
                };
                setTransactionHistory(prevHistory => [newTransaction, ...prevHistory]);
                setTransferAmount('');
                setTransferAddress('');
            } catch (error) {
                console.error("Error during transfer:", error);
                setError("Transfer failed. Please try again.");
            } finally {
                setLoading(false);
            }
        }, 1500); 
    };

     const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'text-green-500';
            case 'pending':
                return 'text-yellow-500';
            case 'failed':
                return 'text-red-500';
            default:
                return 'text-gray-500';
        }
    };

    const getTransactionTypeColor = (type) => {
        switch (type.toLowerCase()) {
            case 'deposit':
                return 'text-green-600';
            case 'withdrawal':
                return 'text-red-600';
            case 'transfer':
                return 'text-blue-600';
            default:
                return 'text-gray-700';
        }
    };

    
    const handleDeleteTransaction = (id) => {
        setTransactionHistory(prevHistory => prevHistory.filter(transaction => transaction.id !== id));
    };

    console.log("Transaction History before render:", transactionHistory);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Static Sidebar */}
            <aside className="w-64 bg-gray-800 text-white">
                <div className="p-4">
                    <div className="h-12 w-12 rounded-full overflow-hidden mb-4">
                        <img src="bitcon.png" alt="logo" className="h-full w-full object-cover" />
                    </div>
                {/* Display actual user info from context */}
                {user ? (
                    <>
                        <h1 className="text-xl font-semibold">{user.username || user.name}</h1>
                        <p className="text-gray-400 text-sm">{user.email}</p>
                    </>
                ) : (
                    <>
                        <h1 className="text-xl font-semibold">Guest</h1>
                        <p className="text-gray-400 text-sm">Not logged in</p>
                    </>
                )}
            </div>
                <nav className="mt-8">
                    <ul className="space-y-2">
                        <li>
                            <Link
                                to="/dashboard"
                                className="w-full flex items-center justify-start text-white hover:bg-gray-700 px-4 py-2 rounded-md"
                            >
                                <Activity className="mr-2 h-4 w-4" />
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/calculator"
                                className="w-full flex items-center justify-start text-white hover:bg-gray-700 px-4 py-2 rounded-md"
                            >
                                <Calculator className="mr-2 h-4 w-4" />
                                Calculator
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/wallet"
                                className="w-full flex items-center justify-start text-white hover:bg-gray-700 px-4 py-2 rounded-md"
                            >
                                <WalletIcon className="mr-2 h-4 w-4" />
                                My Wallet
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/history"
                                className="w-full flex items-center justify-start text-white hover:bg-gray-700 px-4 py-2 rounded-md"
                            >
                                <TrendingUp className="mr-2 h-4 w-4" />
                                History
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/profile"
                                className="w-full flex items-center justify-start text-white hover:bg-gray-700 px-4 py-2 rounded-md"
                            >
                                <Users className="mr-2 h-4 w-4" />
                                Profile
                            </Link>
                        </li>
                        <li>
                                                <button
                                                    onClick={handleLogout} 
                                                    className="w-full flex items-center justify-start text-white hover:bg-gray-700 px-4 py-2 rounded-md cursor-pointer"
                                                >
                                                    <LogOut className="mr-2 h-4 w-4" />
                                                    Logout
                                                </button>
                                            </li>
                    </ul>
                </nav>
                <div className="absolute bottom-4 left-4">
                    <div className="flex items-center gap-2">
                        <Cloud className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{weather.temperature}°C {weather.condition}</span>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 p-2">
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 text-center mb-4">
                    Wallet
                </h1>

                {/* Balance Card */}
                <div className={cardStyle + " mb-4 p-2"}>
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="text-md font-semibold text-gray-900">Balance</div>
                            <div className="text-xs text-gray-500">Total Balance</div>
                        </div>
                        <p className="text-xl font-bold text-gray-900">
                            {currencySymbols[selectedCurrency]}
                            {convertToCurrency(balance, selectedCurrency)}
                        </p>
                        <select
                            value={selectedCurrency}
                            onChange={(e) => setSelectedCurrency(e.target.value)}
                            className={selectStyle}
                        >
                            <option value="USD">USD</option>
                            <option value="NGN">NGN</option>
                            <option value="EUR">EUR</option>
                        </select>
                    </div>
                </div>

                {/* Deposit/Withdrawal/Transfer Section */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className={cardStyle + " flex-1"}>
                        <div className="p-2">
                            <div className="text-md font-semibold text-gray-900 mb-2">Deposit</div>
                            <input
                                type="number"
                                placeholder="Amount"
                                value={depositAmount}
                                onChange={(e) => setDepositAmount(e.target.value)}
                                className={inputStyle}
                                disabled={loading}
                            />
                            <button
                                onClick={handleDeposit}
                                className={buttonStyle + " bg-green-500 hover:bg-green-600"}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                                        Depositing...
                                    </>
                                ) : (
                                    <>
                                        <ArrowDownLeft className="mr-1.5 h-4 w-4" />
                                        Deposit
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className={cardStyle + " flex-1"}>
                        <div className="p-2">
                            <div className="text-md font-semibold text-gray-900 mb-2">Withdraw</div>
                            <input
                                type="number"
                                placeholder="Amount"
                                value={withdrawalAmount}
                                onChange={(e) => setWithdrawalAmount(e.target.value)}
                                className={inputStyle}
                                disabled={loading}
                            />
                            <button
                                onClick={handleWithdrawal}
                                className={buttonStyle + " bg-red-500 hover:bg-red-600"}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                                        Withdrawing...
                                    </>
                                ) : (
                                    <>
                                        <ArrowUpRight className="mr-1.5 h-4 w-4" />
                                        Withdraw
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className={cardStyle + " flex-1"}>
                        <div className="p-2">
                            <div className="text-md font-semibold text-gray-900 mb-2">Transfer</div>
                            <input
                                type="number"
                                placeholder="Amount"
                                value={transferAmount}
                                onChange={(e) => setTransferAmount(e.target.value)}
                                className={inputStyle}
                                disabled={loading}
                            />
                            <input
                                type="text"
                                placeholder="Recipient"
                                value={transferAddress}
                                onChange={(e) => setTransferAddress(e.target.value)}
                                className={inputStyle}
                                disabled={loading}
                            />
                            <button
                                onClick={handleTransfer}
                                className={buttonStyle + " bg-blue-500 hover:bg-blue-600"}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                                        Transferring...
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-1.5 h-4 w-4" />
                                        Transfer
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Transaction History */}
                <div className={cardStyle + " mt-4 p-2"}>
                    <div className="text-lg font-semibold text-gray-900 mb-2">History</div>
                    <div className="overflow-y-auto max-h-[200px]">
                        <table className="min-w-full">
                            <thead>
                                <tr>
                                    <th className="text-left text-xs text-gray-500 px-1 py-0.5">Type</th>
                                    <th className="text-left text-xs text-gray-500 px-1 py-0.5">Amount</th>
                                    <th className="text-left text-xs text-gray-500 px-1 py-0.5">Date</th>
                                    <th className="text-left text-xs text-gray-500 px-1 py-0.5">Status</th>
                                    <th className="text-left text-xs text-gray-500 px-1 py-0.5">Details</th>
                                    <th className="text-left text-xs text-gray-500 px-1 py-0.5">Delete</th>
                                </tr>
                            </thead>
                            <tbody>
  {transactionHistory.length > 0 ? (
    transactionHistory.map((transaction) => {
      console.log("Rendering Transaction:", transaction);
      return (
        <tr key={transaction.id} className="text-xs">
          <td className={getTransactionTypeColor(transaction.type) + " px-1 py-0.5"}>
            {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
          </td>
          <td className="font-medium px-1 py-0.5">
            {currencySymbols[selectedCurrency]}
            {convertToCurrency(transaction.amount, selectedCurrency)}
          </td>
          <td className="text-gray-500 px-1 py-0.5">
            {new Date(transaction.timestamp).toLocaleString()}
          </td>
          <td className={getStatusColor(transaction.status) + " px-1 py-0.5"}>
            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
          </td>
          <td className="text-gray-700 px-1 py-0.5">
            {transaction.details}
          </td>
          <td className="px-1 py-0.5">
            <button
              onClick={() => handleDeleteTransaction(transaction.id)}
              className="text-xxs font-bold px-1 py-0.5 rounded bg-red-500 hover:bg-red-700 text-white"
            >
              Delete
            </button>
          </td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan={6} className="text-center text-gray-400 py-1 text-xs">No transactions.</td>
    </tr>
  )}
</tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Wallet;