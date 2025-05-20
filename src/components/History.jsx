import React, { useState, useRef, useEffect } from 'react';
import {
    Home,
    Calculator as CalculatorIcon,
    Wallet as GiWallet,
    Link as LinkIcon,
    TrendingUp,
    Activity,
    Users,
    LogOut,
    Cloud
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const weather = { temperature: 27, condition: "Sunny" };

    const handleLogout = async () => {
        console.log('Logout button clicked in Sidebar!');
        await logout(); // Call the logout function from AuthContext
        navigate('/'); // Navigate to the home/login page after logout
        console.log('Sidebar: Navigated to / after logout.');
    };

    return (
        <aside className="w-64 bg-gray-800 text-white flex-shrink-0 border-r border-gray-700">
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
                            <CalculatorIcon className="mr-2 h-4 w-4" />
                            Calculator
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/wallet"
                            className="w-full flex items-center justify-start text-white hover:bg-gray-700 px-4 py-2 rounded-md"
                        >
                            <GiWallet className="mr-2 h-4 w-4" />
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
    );
};

const History = () => {
    const [calculatorHistory, setCalculatorHistory] = useState([]);
    const [walletHistory, setWalletHistory] = useState([]);
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1000);
    const [isMobile, setIsMobile] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState('USD');

    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect if not authenticated
        if (!isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        const storedCalculatorHistory = localStorage.getItem('calculatorHistory');
        const storedWalletHistory = localStorage.getItem('transactionHistory');

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
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const convertToCurrency = (amount, currency) => {
        const exchangeRates = { USD: 1, NGN: 750, EUR: 0.95 };
        return (amount * exchangeRates[currency]).toFixed(2);
    }

    const currencySymbols = { USD: '$', NGN: '₦', EUR: '€' };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'text-green-600  ';
            case 'failed': return 'text-red-600  ';
            case 'pending': return 'text-yellow-600  ';
            default: return 'text-gray-600  ';
        }
    };

    const getTransactionTypeColor = (type) => {
        switch (type) {
            case 'deposit': return 'text-green-600 ';
            case 'withdrawal': return 'text-red-600 ';
            case 'transfer': return 'text-blue-600 ';
            case 'calculation': return 'text-purple-600';
            default: return 'text-gray-600 ';
        }
    };

    const cardStyle = "bg-white border border-gray-200   shadow-md rounded-md";
    const selectStyle = `bg-gray-100 border border-gray-300   text-gray-900  rounded-full px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500`;
    const allHistory = [...calculatorHistory, ...walletHistory].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));


    return (
        <div className="flex h-screen bg-gray-50   overflow-hidden">
            {!isMobile && <Sidebar />}
            <div className={isMobile ? 'flex-1 p-4 transition-all duration-300' : 'flex-1 ml-64 p-4 transition-all duration-300'}>
                <header className="bg-white shadow p-4 mb-6">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 text-center">
                        History
                    </h1>
                </header>
                <div className="flex justify-end mb-6">
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
                <div className={cardStyle + " p-6"}>
                    <div className="overflow-y-auto max-h-[80vh]">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left text-lg text-gray-500  px-3 py-2">Type</th>
                                    <th className="text-left text-lg text-gray-500  px-3 py-2">Amount</th>
                                    <th className="text-left text-lg text-gray-500  px-3 py-2">Date</th>
                                    <th className="text-left text-lg text-gray-500  px-3 py-2">Status</th>
                                    <th className="text-left text-lg text-gray-500  px-3 py-2">Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allHistory.length > 0 ? (
                                    allHistory.map((item, index) => {
                                        const isCalculation = item.type === 'calculation';
                                        return (
                                            <tr key={index} className="text-lg">
                                                <td className={getTransactionTypeColor(item.type) + " px-3 py-2"}>
                                                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                                                </td>
                                                <td className="font-medium px-3 py-2">
                                                    {isCalculation
                                                        ? `${currencySymbols[selectedCurrency]}${convertToCurrency(item.result, selectedCurrency)}`
                                                        : `${currencySymbols[selectedCurrency]}${convertToCurrency(item.amount, selectedCurrency)}`}
                                                </td>
                                                <td className="text-gray-500  px-3 py-2">
                                                    {new Date(item.timestamp).toLocaleString()}
                                                </td>
                                                <td className={getStatusColor(item.status) + " px-3 py-2"}>
                                                    {item.status?.charAt(0).toUpperCase() + item.status?.slice(1) || '-'}
                                                </td>
                                                <td className="text-gray-700  px-3 py-2">
                                                    {item.details}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="text-center text-gray-400 py-3 text-lg">No history.</td>
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

export default History;