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
} from 'lucide-react';
//import { TfiWorld } from "react-icons/tfi";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CoinContext } from '../context/CoinContext';

const Dashboard = () => {
    const { allCoin, currency, setCurrency, exchangeRates, exchangeRateLoading, exchangeRateError } = useContext(CoinContext);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredCoins, setFilteredCoins] = useState([]);
    const [localCurrency, setLocalCurrency] = useState(currency.id);
    

    const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Dashboard mounted, isAuthenticated:', isAuthenticated);
    if (!isAuthenticated) {
      console.log('Not authenticated, redirecting to /');
      navigate('/dashboard');
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
    }, [currency. exchangeRates]);

    const handleCurrencyChange = (event) => {
        const newCurrencyId = event.target.value;
        setLocalCurrency(newCurrencyId);
        setCurrency(newCurrencyId); 
    };

    // Dummy user data (you'll likely keep this or replace it with real user data)
 // const user = {
   //   name: "Guest",
     // email: "guest.user@example.com",
 // };

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
        switch (event.target.value){
            case "usd": {
                setCurrency({name: "usd", symbol: "$"});
                break;
            }
            case "eur": {
                setCurrency({name: "eur", symbol: "€"});
                break;
            }
            case "ngn": {
                setCurrency({name: "ngr", symbol: "₦"});
                break;
            }
            default : {
                setCurrency({name: "usd", symbol: "$"});
                break;
            }
        }
    }

    const getMarketCapInSelectedCurrency = (marketCapUsd) => {
        console.log('Current currency ID in conversion:', currency.id);
        if (currency.id === 'EUR' && exchangeRates.EUR !== null) {
            console.log('Converting to EUR. Rate:', exchangeRates.EUR);
            return marketCapUsd * exchangeRates.EUR;
        } else if (currency.id === 'NGN' && exchangeRates.NGN !== null) {
            console.log('Converting to NGN. Rate:', exchangeRates.NGN);
            return marketCapUsd * exchangeRates.NGN;
        }
        console.log('Returning USD market cap:', marketCapUsd);
        return marketCapUsd; 
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 text-white">
                <div className="p-4">
            <div className="h-12 w-12 rounded-full overflow-hidden mb-4">
              <img src="bitcon.png" alt="logo" className="h-full w-full object-cover" />
            </div>
            {user ? (
              <>
                <h1 className="text-xl font-semibold">{user.name}</h1>
                <p className="text-gray-400 text-sm">{user.email}</p>
              </>
            ) : (
              <>
                <h1 className="text-xl font-semibold">Guest</h1> {/* Or some default name */}
                <p className="text-gray-400 text-sm">Not logged in</p> {/* Or some default email/status */}
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
                                to = "/calculator"
                                className="w-full flex items-center justify-start text-white hover:bg-gray-700 px-4 py-2 rounded-md"
                            >
                                <Calculator className="mr-2 h-4 w-4" />
                                Calculator
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/Wallet"
                                className="w-full flex items-center justify-start text-white hover:bg-gray-700 px-4 py-2 rounded-md"
                            >
                                <Wallet className="mr-2 h-4 w-4" />
                                My Wallet
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/History"
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
        onClick={handleLogout} // Add the onClick handler
        className="w-full flex items-center justify-start text-white hover:bg-gray-700 px-4 py-2 rounded-md cursor-pointer" // Add cursor-pointer for better UX
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
            <main className="flex-1 p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">Welcome back!</h2>
                    <div className="flex items-center gap-4">
                        <input
                            type="text"
                            placeholder="Search Crypto..."
                            className="w-64 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            className="bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="NGN">NGN</option>
                        </select>

                        <Languages className="h-5 w-5 text-gray-500" />
                        <Calendar className="h-5 w-5 text-gray-500" />
                    </div>
                </div>

                {/* Popular Cryptocurrencies */}
                <div className="bg-white rounded-md shadow-md mb-6">
                    <div className="p-4 border-b">
                        <h4 className="text-xl font-semibold">Live Market Overview</h4>
                    </div>
                    <div className="p-4">
                        {exchangeRateLoading && <p>Loading exchange rates...</p>}
                        {Array.isArray(allCoin) && allCoin.length > 0 ? (
                            <table className="min-w-full">
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
                                                    {/*{console.log('Rendering with currency:', currency)}
                                                    {console.log('Market cap:', crypto.market_cap)}
                                                    {currency.symbol} {formatNumber(crypto.market_cap)}*/}
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

                {/* Live Market Overview */}
                {/*<div className="bg-white rounded-md shadow-md mb-6">
                    <div className="p-4 border-b">
                        <h2 className="text-xl font-semibold">Live Market Overview</h2>
                    </div>
                    <div className="p-4">
                        {Array.isArray(filteredCoins) && filteredCoins.length > 0 ? (
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Rank
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Coins
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Price
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            24H Change
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Market Cap
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredCoins.slice(0, 3).map((coin) => ( // Using filteredCoins here
                                        <tr key={coin.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {coin.market_cap_rank}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <img src={coin.image} alt={coin.name} className="h-6 w-6 mr-2" />
                                                    {coin.name} - {coin.symbol.toUpperCase()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                {currency.symbol} {formatNumber(coin.current_price)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <span
                                                    className={coin.price_change_percentage_24h > 0
                                                        ? 'px-2 py-1 rounded bg-green-100 text-green-800'
                                                        : 'px-2 py-1 rounded bg-red-100 text-red-800'
                                                    }
                                                >
                                                    {formatNumber(coin.price_change_percentage_24h)}%
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                {currency.symbol} {formatNumber(coin.market_cap)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-gray-500">{searchQuery ? 'No cryptocurrencies found matching your search.' : 'Loading live market data...'}</p>
                        )}
                    </div>
                </div>*/}

                {/* NFTs, Web3, Crypto Section (Left as is) */}
                <div className="flex gap-4 mb-6">
                    <div className="flex-1 bg-white rounded-md shadow-md">
                        <div className="p-4 border-b">
                            <h2 className="text-xl font-semibold">NFTs</h2>
                        </div>
                        <div className="p-4">
                            {/* Content */}
                        </div>
                    </div>
                    <div className="flex-1 bg-white rounded-md shadow-md">
                        <div className="p-4 border-b">
                            <h2 className="text-xl font-semibold">Web3</h2>

                        </div>
                        <div className="p-4">
                            {/* Content */}
                        </div>
                    </div>
                    <div className="flex-1 bg-white rounded-md shadow-md">
                        <div className="p-4 border-b">
                            <h2 className="text-xl font-semibold">Trading Bot</h2>
                        </div>
                        <div className="p-4">
                            {/* Content */}
                        </div>
                    </div>
                </div>

                {/* Displaying the first 9 coins at the bottom - Now filtered */}
                <div className='mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4'>
                    {exchangeRateLoading && <p>Loading exchange rates...</p>}
                    {filteredCoins.slice(0, 9).map((item, index) => ( // Using filteredCoins here
                        <div className='bg-white rounded-md shadow-md p-4' key={index}>
                            <p className="text-sm text-gray-500">Rank: {item.market_cap_rank}</p>
                            <div className="flex items-center space-x-2 mb-2">
                                <img src={item.image} alt={item.name} className="h-8 w-8" />
                                <p className="font-semibold">{item.name} - {item.symbol.toUpperCase()}</p>
                            </div>
                            <p className="text-gray-700">{currency.symbol} {formatNumber(item.current_price.toLocaleString())}</p>
                            <p
                                className={item.price_change_percentage_24h > 0 ? "text-green-500" : "text-red-500"}
                            >
                                {formatNumber(item.price_change_percentage_24h)}%
                            </p>
                            <p className='text-gray-600 text-sm'> Market Cap: {currency.symbol} {formatNumber(getMarketCapInSelectedCurrency(item.market_cap.toLocaleString()))}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;