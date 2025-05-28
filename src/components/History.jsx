import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const History = () => {
    const [calculatorHistory, setCalculatorHistory] = useState([]);
    const [walletHistory, setWalletHistory] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState('USD');

    const { isAuthenticated, LogOut, user } = useAuth();
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };

    const handleLogout = async () => {
        console.log('Logout button clicked from Histoy!');
        await LogOut();
        navigate('/');
        console.log('History Naviagated to / after logout.');
    };

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        const storedCalculatorHistory = localStorage.getItem('calculatorHistory');
        const storedWalletHistory = localStorage.getItem('transactionHistory');
        const storedCurrency = localStorage.getItem('selectedCurrency');

        if (storedCalculatorHistory) {
            try {
                setCalculatorHistory(JSON.parse(storedCalculatorHistory));
            } catch (e) {
                console.error('Failed to parse calculator history from local storage', e);
                setCalculatorHistory([]);
            }
        }
        if (storedWalletHistory) {
            try {
                setWalletHistory(JSON.parse(storedWalletHistory));
            } catch (e) {
                console.error('Failed to parse wallet history from local storage', e);
                setWalletHistory([]);
            }
        }
        if (storedCurrency) {
            setSelectedCurrency(storedCurrency);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('selectedCurrency', selectedCurrency);
    }, [selectedCurrency]);


    const convertToCurrency = (amount, currency) => {
        const exchangeRates = { USD: 1, NGN: 750, EUR: 0.95 };
        if (typeof amount !== 'number'){
            console.warn(`Attempted to convert non-number amount: ${amount}`);
            return 'N/A';
        }
        return (amount * exchangeRates[currency]).toFixed(2);
    }

    const currencySymbols = { USD: '$', NGN: '₦', EUR: '€' };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'text-green-600';
            case 'failed': return 'text-red-600';
            case 'pending': return 'text-yellow-600';
            default: return 'text-gray-600';
        }
    };

    const getTransactionTypeColor = (type) => {
        switch (type) {
            case 'deposit': return 'text-green-600';
            case 'withdrawal': return 'text-red-600';
            case 'transfer': return 'text-blue-600';
            case 'calculation': return 'text-purple-600';
            default: return 'text-gray-600';
        }
    };

    const cardStyle = "bg-white border border-gray-200 shadow-md rounded-md";
    const allHistory = [...calculatorHistory.map(item => ({
        ...item,
        type: 'calculation',
        result: Number(item.orderValue || item.result),
        details: `Risk $${item.riskAmount}, Entry: $${item.entryPrice}, SL: $${item.stopLossPrice}`,
        status: 'completed'
    })), ...walletHistory].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar component */}
            <Sidebar  
             toggleSidebar={toggleSidebar}
             isSidebarOpen={isSidebarOpen}  
             setIsSidebarOpen={setIsSidebarOpen}
             user={user}
             handleLogout={handleLogout} 
            />

            {/* Main content area, pushed by sidebar when open */}
            <div className={`flex-1 flex flex-col transition-all duration-300
                ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
                {/* Navbar component */}
               <Navbar
                    toggleSidebar={toggleSidebar}
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    selectedCurrency={selectedCurrency}
                    setSelectedCurrency={setSelectedCurrency} 
                />
                

                <div className="p-4 flex-grow overflow-y-auto mt-16">
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 text-center mb-6">
                        History
                    </h1>
                    <div className={cardStyle + " p-4 md:p-6"}>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-grey-200" >
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-2 py-2 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                        <th className="px-2 py-2 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-2 py-2 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-2 py-2 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-2 py-2 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {allHistory.length > 0 ? (
                                        allHistory.map((item, index) => {
                                            const isCalculation = item.type === 'calculation';
                                            return (
                                                <tr key={index} className="text-sm border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                                                    <td className={getTransactionTypeColor(item.type) + " px-2 py-2 whitespace-nowrap text-xs sm:text-sm"}>
                                                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                                                    </td>
                                                    <td className="font-medium px-2 py-2 whitespace-nowrap text-gray-900 text-xs sm:text-sm">
                                                        {isCalculation
                                                            ? `${currencySymbols[selectedCurrency]}${convertToCurrency(item.result, selectedCurrency)}`
                                                            : `${currencySymbols[selectedCurrency]}${convertToCurrency(item.amount, selectedCurrency)}`}
                                                    </td>
                                                    <td className="text-gray-500 px-2 py-2 whitespace-nowrap text-xs sm:text-sm">
                                                        {new Date(item.timestamp).toLocaleString()}
                                                    </td>
                                                    <td className={getStatusColor(item.status) + " px-2 py-2 whitespace-nowrap text-xs sm:text-sm"}>
                                                        {item.status?.charAt(0).toUpperCase() + item.status?.slice(1) || '-'}
                                                    </td>
                                                    <td className="text-gray-700 px-2 py-2 text-xs sm:text-sm">
                                                        {item.details}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="text-center text-gray-400 py-4 text-sm">No history.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default History;