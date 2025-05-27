import React, { useContext, useEffect, useState } from 'react';
import {
    Cpu,
    Activity,
    Users,
    Settings,
    LogOut,
    Calculator,
    Wallet,
    TrendingUp,
    Search as SearchIcon,
    Languages,
    Calendar,
    Cloud,
    Menu,
    X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CoinContext } from '../context/CoinContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar'; 

const Dashboard = () => {
    const { allCoin, currency, setCurrency, exchangeRates, exchangeRateLoading, exchangeRateError } = useContext(CoinContext);

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredCoins, setFilteredCoins] = useState([]);
    const [localCurrency, setLocalCurrency] = useState(currency.id);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        console.log('Dashboard mounted, isAuthenticated:', isAuthenticated);
        if (!isAuthenticated) {
            console.log('Not authenticated, redirecting to /');
            navigate('/');
        } else {
            console.log('Authenticated, rendering dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handleLogout = async () => {
        console.log('Logout button clicked!');
        await logout();
        navigate('/');
        console.log('Dashboard: Navigated to / after logout.');
    };

    useEffect(() => {
        console.log('allCoin in Dashboard changed:', allCoin);
        if (allCoin && Array.isArray(allCoin)) {
            const results = allCoin.filter(
                (coin) =>
                    coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredCoins(results);
        } else {
            setFilteredCoins([]);
        }
    }, [allCoin, searchQuery]);

    useEffect(() => {
        console.log('Current currency in Dashboard:', currency);
        console.log('Exchange Rates in Dashboard:', exchangeRates);
    }, [currency, exchangeRates]);

    const handleCurrencyChange = (event) => {
        const newCurrencyId = event.target.value;
        setLocalCurrency(newCurrencyId);
        setCurrency(newCurrencyId);
    };

    const weather = {
        temperature: "27",
        condition: "Mostly Cloudy",
    };

    const formatNumber = (number) => {
        return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(number);
    };

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const currencyHandler = (event) => {
        switch (event.target.value) {
            case "usd": {
                setCurrency({ name: "usd", symbol: "$" });
                break;
            }
            case "eur": {
                setCurrency({ name: "eur", symbol: "€" });
                break;
            }
            case "ngn": {
                setCurrency({ name: "ngr", symbol: "₦" });
                break;
            }
            default: {
                setCurrency({ name: "usd", symbol: "$" });
                break;
            }
        }
    };

    const getMarketCapInSelectedCurrency = (marketCapUsd) => {
        console.log('Current currency ID in conversion:', currency.id);
        const currentCurrencyId = currency.id === 'ngr' ? 'NGN' : currency.id;

        if (currentCurrencyId === 'EUR' && exchangeRates.EUR !== null) {
            console.log('Converting to EUR. Rate:', exchangeRates.EUR);
            return marketCapUsd * exchangeRates.EUR;
        } else if (currentCurrencyId === 'NGN' && exchangeRates.NGN !== null) {
            console.log('Converting to NGN. Rate:', exchangeRates.NGN);
            return marketCapUsd * exchangeRates.NGN;
        }
        console.log('Returning USD market cap:', marketCapUsd);
        return marketCapUsd;
    };


    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Navbar */}
            <Navbar
                searchQuery={searchQuery}
                handleSearchInputChange={handleSearchInputChange}
                localCurrency={localCurrency}
                handleCurrencyChange={handleCurrencyChange}
                setIsSidebarOpen={setIsSidebarOpen}
                isSidebarOpen={isSidebarOpen}
            />

            {/* Sidebar */}
            <Sidebar
                user={user}
                handleLogout={handleLogout}
                setIsSidebarOpen={setIsSidebarOpen}
                isSidebarOpen={isSidebarOpen}
                weather={weather}
            />

            {/* Main Content Area */}
            <main className="flex-1 p-6 overflow-y-auto pt-4 md:pt-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                    <h2 className="text-2xl font-semibold">Welcome back!</h2>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Search Crypto..."
                            className="w-full sm:w-64 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchQuery}
                            onChange={handleSearchInputChange}
                        />
                        <button
                            className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        >
                            <SearchIcon className="h-5 w-5" />
                        </button>

                        <select
                            value={localCurrency}
                            onChange={handleCurrencyChange}
                            className="bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-full sm:w-auto"
                        >
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="NGN">NGN</option>
                        </select>

                        <div className="flex gap-4">
                            <Languages className="h-5 w-5 text-gray-500" />
                            <Calendar className="h-5 w-5 text-gray-500" />
                        </div>
                    </div>
                </div>

                {/* Popular Cryptocurrencies Table */}
                <div className="bg-white rounded-md shadow-md mb-6 overflow-x-auto">
                    <div className="p-4 border-b">
                        <h4 className="text-xl font-semibold">Live Market Overview</h4>
                    </div>
                    <div className="p-4">
                        {exchangeRateLoading && <p>Loading exchange rates...</p>}
                        {Array.isArray(allCoin) && allCoin.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Rank
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Symbol
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Market Cap
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {allCoin
                                        .slice(0, 5)
                                        .sort((a, b) => a.market_cap_rank - b.market_cap_rank)
                                        .map((crypto) => (
                                            <tr key={crypto.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">{crypto.market_cap_rank}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <img src={crypto.image} alt={crypto.name} className="h-6 w-6 mr-2" />
                                                        {crypto.name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">{crypto.symbol.toUpperCase()}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {currency.symbol} {formatNumber(getMarketCapInSelectedCurrency(crypto.market_cap))}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-gray-500">Loading popular cryptocurrencies...</p>
                        )}
                    </div>
                </div>

                {/* NFTs, Web3, Crypto Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-md shadow-md">
                        <div className="p-4 border-b">
                            <h2 className="text-xl font-semibold">NFTs</h2>
                        </div>
                        <div className="p-4">
                            {/* Content */}
                            <p className="text-gray-500">Explore the world of non-fungible tokens.</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-md shadow-md">
                        <div className="p-4 border-b">
                            <h2 className="text-xl font-semibold">Web3</h2>
                        </div>
                        <div className="p-4">
                            {/* Content */}
                            <p className="text-gray-500">Dive into decentralized applications and blockchain technology.</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-md shadow-md">
                        <div className="p-4 border-b">
                            <h2 className="text-xl font-semibold">Trading Bot</h2>
                        </div>
                        <div className="p-4">
                            {/* Content */}
                            <p className="text-gray-500">Automate your crypto trading strategies.</p>
                        </div>
                    </div>
                </div>

                {/* Displaying the first 9 coins at the bottom - Now filtered and responsive grid */}
                <div className='mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4'>
                    {exchangeRateLoading && <p>Loading exchange rates...</p>}
                    {filteredCoins.slice(0, 12).map((item, index) => (
                        <div className='bg-white rounded-md shadow-md p-4' key={item.id || index}>
                            <p className="text-sm text-gray-500">Rank: {item.market_cap_rank}</p>
                            <div className="flex items-center space-x-2 mb-2">
                                <img src={item.image} alt={item.name} className="h-8 w-8" />
                                <p className="font-semibold">{item.name} - {item.symbol.toUpperCase()}</p>
                            </div>
                            <p className="text-gray-700">{currency.symbol} {formatNumber(item.current_price)}</p>
                            <p
                                className={item.price_change_percentage_24h > 0 ? "text-green-500" : "text-red-500"}
                            >
                                {formatNumber(item.price_change_percentage_24h)}%
                            </p>
                            <p className='text-gray-600 text-sm'> Market Cap: {currency.symbol} {formatNumber(getMarketCapInSelectedCurrency(item.market_cap))}</p>
                        </div>
                    ))}
                </div>
            </main>
            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40" // Removed md:hidden from overlay
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
};

export default Dashboard;