import React, { useState, useEffect } from 'react';
import {
    ArrowUpRight,
    ArrowDownLeft,
    Loader2,
    Send,
    ListChecks,
    X 
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Wallet = () => {
    const [balance, setBalance] = useState(() => {
        const storedBalance = localStorage.getItem('balance');
        return storedBalance ? parseFloat(storedBalance) : 1000;
    });
    const [transactionHistory, setTransactionHistory] = useState(() => {
        const storedHistory = localStorage.getItem('transactionHistory');
        if (storedHistory) {
            try {
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
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const exchangeRates = { USD: 1, NGN: 750, EUR: 0.95 };
    const currencySymbols = { USD: '$', NGN: '₦', EUR: '€' };

    // Consolidated and improved Tailwind CSS classes
    const cardStyle = "bg-white border border-gray-200 rounded-lg shadow-sm p-4";
    const inputStyle = "w-full bg-gray-50 border border-gray-300 text-gray-900 placeholder:text-gray-400 px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3";
    const buttonStyle = "w-full text-white font-semibold py-2 rounded-lg transition-colors duration-200 flex items-center justify-center text-sm";
    const selectStyle = `bg-gray-100 border border-gray-300 text-gray-800 rounded-md px-3 py-1.5 text-sm
                             focus:outline-none focus:ring-2 focus:ring-blue-500`;

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
            setError('Please enter a valid deposit amount.');
            return;
        }
        setError(null);
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
                addTransaction(newTransaction);
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
            setError('Please enter a valid withdrawal amount.');
            return;
        }

        const amount = parseFloat(withdrawalAmount);
        if (amount > balance) {
            setError('Insufficient balance.');
            return;
        }
        setError(null);
        setLoading(true);
        setTimeout(() => {
            try {
                setBalance(prevBalance => prevBalance - amount);
                const newTransaction = {
                    id: uuidv4(),
                    type: 'withdrawal',
                    amount: amount,
                    timestamp: new Date().toISOString(),
                    status: 'completed',
                    details: 'Withdrawal from wallet',
                };
                addTransaction(newTransaction);
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
            setError('Please enter a valid amount and recipient address.');
            return;
        }

        const amount = parseFloat(transferAmount);
        if (amount > balance) {
            setError('Insufficient balance.');
            return;
        }
        setError(null);
        setLoading(true);
        setTimeout(() => {
            try {
                setBalance(prevBalance => prevBalance - amount);
                const newTransaction = {
                    id: uuidv4(),
                    type: 'transfer',
                    amount: amount,
                    timestamp: new Date().toISOString(),
                    status: 'completed',
                    details: `Transfer to ${transferAddress}`,
                };
                addTransaction(newTransaction);
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
                return 'text-green-600 font-medium';
            case 'pending':
                return 'text-yellow-600 font-medium';
            case 'failed':
                return 'text-red-600 font-medium';
            default:
                return 'text-gray-500 font-medium';
        }
    };

    const getTransactionTypeColor = (type) => {
        switch (type.toLowerCase()) {
            case 'deposit':
                return 'text-green-700';
            case 'withdrawal':
                return 'text-red-700';
            case 'transfer':
                return 'text-blue-700';
            default:
                return 'text-gray-700';
        }
    };

    const handleDeleteTransaction = (id) => {
        setTransactionHistory(prevHistory => prevHistory.filter(transaction => transaction.id !== id));
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Navbar at the top */}
            <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

            {/* Sidebar (will be hidden on md+ screens) */}
            <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

            {/* Main Content Area */}
            <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min md:ml-0">
                
                <h1 className="col-span-full text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 text-center mb-6">
                    My Wallet
                </h1>

                {error && (
                    <div className="col-span-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <strong className="font-bold">Error!</strong>
                        <span className="block sm:inline ml-2">{error}</span>
                        <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onClick={() => setError(null)}>
                            <X className="h-4 w-4 fill-current" />
                        </span>
                    </div>
                )}

                {/* Balance Card */}
                <div className={`${cardStyle} md:col-span-2 lg:col-span-1 flex flex-col justify-between`}>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-1">Current Balance</h3>
                            <p className="text-sm text-gray-500">Your available funds</p>
                        </div>
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
                    <div className="text-4xl font-extrabold text-gray-900">
                        {currencySymbols[selectedCurrency]}
                        {convertToCurrency(balance, selectedCurrency)}
                    </div>
                </div>

                {/* Quick Actions (Deposit, Withdraw, Transfer) */}
                <div className={`${cardStyle} md:col-span-2 lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4`}>
                    <div className="col-span-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center"><ArrowDownLeft className="h-5 w-5 mr-2 text-green-500" />Deposit</h3>
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
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Depositing...
                                </>
                            ) : (
                                'Deposit Funds'
                            )}
                        </button>
                    </div>

                    <div className="col-span-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center"><ArrowUpRight className="h-5 w-5 mr-2 text-red-500" />Withdraw</h3>
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
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Withdrawing...
                                </>
                            ) : (
                                'Withdraw Funds'
                            )}
                        </button>
                    </div>

                    <div className="col-span-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center"><Send className="h-5 w-5 mr-2 text-blue-500" />Transfer</h3>
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
                            placeholder="Recipient Address"
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
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Transferring...
                                </>
                            ) : (
                                'Transfer Funds'
                            )}
                        </button>
                    </div>
                </div>

                {/* Transaction History */}
                <div className={`${cardStyle} col-span-full`}>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center"><ListChecks className="h-5 w-5 mr-2 text-gray-600" />Transaction History</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {transactionHistory.length > 0 ? (
                                    transactionHistory.map((transaction) => (
                                        <tr key={transaction.id} className="hover:bg-gray-50">
                                            <td className={`${getTransactionTypeColor(transaction.type)} px-4 py-2 whitespace-nowrap text-sm`}>
                                                {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {currencySymbols[selectedCurrency]}
                                                {convertToCurrency(transaction.amount, selectedCurrency)}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(transaction.timestamp).toLocaleString()}
                                            </td>
                                            <td className={`${getStatusColor(transaction.status)} px-4 py-2 whitespace-nowrap text-sm`}>
                                                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                            </td>
                                            <td className="px-4 py-2 text-sm text-gray-700">
                                                {transaction.details}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => handleDeleteTransaction(transaction.id)}
                                                    className="text-red-600 hover:text-red-900 transition-colors duration-200"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-4 text-center text-gray-400 text-sm">No transactions yet.</td>
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