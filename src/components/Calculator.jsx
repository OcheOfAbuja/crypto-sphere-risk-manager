import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const CalculatorComponent = () => {
    const [riskAmount, setRiskAmount] = useState('');
    const [entryPrice, setEntryPrice] = useState('');
    const [stopLossPrice, setStopLossPrice] = useState('');
    const [orderValue, setOrderValue] = useState('');
    const [percentageDifference, setPercentageDifference] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);
    const orderValueRef = useRef(null);
    const percentageDifferenceRef = useRef(null);
    const [calculationHistory, setCalculationHistory] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedHistory = localStorage.getItem('calculationHistory');
            if (savedHistory) {
                try {
                    const parsedHistory = JSON.parse(savedHistory);
                    return parsedHistory.map(item => ({
                        ...item,
                        riskAmount: Number(item.riskAmount),
                        entryPrice: Number(item.entryPrice),
                        stopLossPrice: Number(item.stopLossPrice),
                        percentageDifference: Number(item.percentageDifference),
                    }));
                } catch (error) {
                    console.error("Error parsing calculation history from localStorage:", error);
                    return [];
                }
            }
            return [];
        }
        return [];
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('calculationHistory', JSON.stringify(calculationHistory));
        }
    }, [calculationHistory]);

    const validateInput = (risk, entry, stopLoss) => {
        if (!risk || !entry || !stopLoss) return 'Please fill in all fields.';
        const riskNum = Number(risk);
        const entryNum = Number(entry);
        const stopLossNum = Number(stopLoss);
        if (isNaN(riskNum) || isNaN(entryNum) || isNaN(stopLossNum)) return 'Invalid input: Parameters must be numbers.';
        if (riskNum <= 0) return 'Risk Amount must be greater than zero.';
        if (entryNum <= 0 || stopLossNum <= 0) return 'Entry and Stop Loss Price must be greater than zero.';
        if (riskNum > 1000000) return 'Risk Amount is too high. Maximum is 1,000,000';
        if (entryNum > 100000 || stopLossNum > 100000) return 'Entry/Stop Loss Price is too high. Maximum is 100,000';
        return null;
    };

    const handleCalculateOrderValue = async () => {
        setError('');
        setIsLoading(true);

        const riskNum = Number(riskAmount);
        const entryNum = Number(entryPrice);
        const stopLossNum = Number(stopLossPrice);

        const inputError = validateInput(riskAmount, entryPrice, stopLossPrice);
        if (inputError) {
            setError(inputError);
            setIsLoading(false);
            return;
        }

        try {
            const newOrderValue = (riskNum / (Math.abs(entryNum - stopLossNum) / entryNum)).toFixed(2);
            const newPercentageDifference = ((Math.abs(entryNum - stopLossNum) / entryNum) * 100).toFixed(2);

            setOrderValue(newOrderValue);
            setPercentageDifference(newPercentageDifference);

            setCalculationHistory(prevHistory => [
                {
                    riskAmount: riskNum,
                    entryPrice: entryNum,
                    stopLossPrice: stopLossNum,
                    orderValue: newOrderValue,
                    percentageDifference: Number(newPercentageDifference),
                    timestamp: new Date().toLocaleString(),
                },
                ...prevHistory,
            ]);

            setIsLoading(false);
        } catch (error) {
            console.error('Error calculating order value:', error);
            setIsLoading(false);
        }
    };

    const toggleExplanation = () => {
        setShowExplanation(!showExplanation);
    };

    const isLongPosition = entryPrice && stopLossPrice && parseFloat(entryPrice) > parseFloat(stopLossPrice);
    const isShortPosition = entryPrice && stopLossPrice && parseFloat(entryPrice) < parseFloat(stopLossPrice);
    const riskPercentage = percentageDifference ? Math.abs(parseFloat(percentageDifference)) : 0;

    const copyToClipboard = (text, ref) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
            if (ref && ref.current) {
                ref.current.textContent = 'Copied!';
                setTimeout(() => {
                    ref.current.textContent = 'Copy';
                }, 1500);
            }
        } else {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                if (ref && ref.current) {
                    ref.current.textContent = 'Copied!';
                    setTimeout(() => {
                        ref.current.textContent = 'Copy';
                    }, 1500);
                }
            } catch (err) {
                console.error('Fallback: Could not copy text: ', err);
                setError('Could not copy to clipboard.');
            }
            document.body.removeChild(textArea);
        }
    };

    const clearHistory = () => {
        setCalculationHistory([]);
    };

    const deleteHistoryItem = (index) => {
        setCalculationHistory(prevHistory => prevHistory.filter((_, i) => i !== index));
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 text-center flex-grow">
                Calculator Risk
            </h1>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <label htmlFor="riskAmount" className="block text-gray-700 text-sm font-bold mb-2">
                        Risk Amount ($):
                    </label>
                    <input
                        type="text"
                        id="riskAmount"
                        value={riskAmount}
                        onChange={(e) => setRiskAmount(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-300"
                        placeholder="e.g., 100"
                    />
                    <p className="text-gray-500 text-xs italic mt-1">Enter the amount you're willing to risk.</p>
                </div>
                <div>
                    <label htmlFor="entryPrice" className="block text-gray-700 text-sm font-bold mb-2">
                        Entry Price:
                    </label>
                    <input
                        type="text"
                        id="entryPrice"
                        value={entryPrice}
                        onChange={(e) => setEntryPrice(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-300"
                        placeholder="e.g., 40000.50"
                    />
                    <p className="text-gray-500 text-xs italic mt-1">Your intended entry price.</p>
                </div>
                <div>
                    <label htmlFor="stopLossPrice" className="block text-gray-700 text-sm font-bold mb-2">
                        Stop Loss Price:
                    </label>
                    <input
                        type="text"
                        id="stopLossPrice"
                        value={stopLossPrice}
                        onChange={(e) => setStopLossPrice(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-300"
                        placeholder="e.g., 39500.00"
                    />
                    <p className="text-gray-500 text-xs italic mt-1">Price at which you'll exit to limit losses.</p>
                </div>
            </div>

            <button
                onClick={handleCalculateOrderValue}
                disabled={isLoading}
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline ${isLoading ? 'opacity-75 cursor-wait' : ''}`}
            >
                {isLoading ? 'Calculating...' : 'Calculate'}
            </button>

            {(orderValue && percentageDifference) && (
                <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Calculation Results
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-700 font-semibold">Order Value:</p>
                            <div className="flex items-center">
                                <p ref={orderValueRef} className="text-xl font-bold text-blue-600 mr-2 font-mono">
                                    {orderValue}
                                </p>
                                <button
                                    onClick={() => copyToClipboard(orderValue, orderValueRef)}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-1 px-2 rounded-md text-sm focus:outline-none focus:shadow-outline"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>
                        <div>
                            <p className="text-gray-700 font-semibold">Risk Percentage:</p>
                            <div className="flex items-center">
                                <p ref={percentageDifferenceRef} className="text-xl font-bold text-red-600 mr-2 font-mono">
                                    {percentageDifference}%
                                </p>
                                <button
                                    onClick={() => copyToClipboard(percentageDifference, percentageDifferenceRef)}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-1 px-2 rounded-md text-sm focus:outline-none focus:shadow-outline"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {(isLongPosition || isShortPosition) && (
                <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Visualizing Risk ({isLongPosition ? 'Long' : 'Short'} Position)
                    </h3>
                    <div className="bg-gray-300 rounded-full h-8 relative overflow-hidden">
                        <div
                            className={`h-full absolute ${isLongPosition ? 'left-0 bg-red-500' : 'right-0 bg-green-500'}`}
                            style={{ width: `${riskPercentage}%` }}
                        ></div>
                        <div className="absolute inset-0 flex items-center justify-between px-2 text-xs text-gray-900">
                            <span>{isShortPosition ? stopLossPrice : stopLossPrice}</span>
                            <span>{entryPrice}</span>
                            <span>{isShortPosition ? entryPrice : entryPrice}</span>
                        </div>
                    </div>
                    <p className="text-gray-600 text-sm italic mt-2">
                        The colored bar shows the percentage distance between your stop loss and entry.
                    </p>
                </div>
            )}

            <button
                onClick={toggleExplanation}
                className=" px-2 text-blue-500 hover:underline cursor-pointer text-sm"
            >
                {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
            </button>

            {showExplanation && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200 text-gray-700 text-sm space-y-3">
                    <h4 className="font-semibold text-gray-900">Understanding the Calculations:</h4>
                    <p><strong className="font-medium">Risk Amount ($):</strong> Capital you're willing to lose.</p>
                    <p><strong className="font-medium">Entry Price:</strong> Your planned trade entry price.</p>
                    <p><strong className="font-medium">Stop Loss Price:</strong> Price to exit and limit losses.</p>
                    <h4 className="font-semibold text-gray-900 mt-2">Order Value Calculation:</h4>
                    <p>Order Value = Risk Amount / ( |Entry Price - Stop Loss Price| / Entry Price )</p>
                    <p>Determines your trade size to cap loss at your risk amount if stop loss hits.</p>
                    <h4 className="font-semibold text-gray-900 mt-2">Percentage Difference:</h4>
                    <p>Percentage Difference = ( |Entry Price - Stop Loss Price| / Entry Price ) * 100%</p>
                    <p>Potential percentage risk relative to your entry price.</p>
                    <p className="italic text-gray-600 mt-2">
                        <strong className="font-semibold">Important:</strong> Risk management is crucial for trading.
                    </p>
                </div>
            )}

            {/* Calculation History */}
            <div className="mt-8 p-4 bg-white shadow rounded-md border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">Calculation History</h3>
                    <button
                        onClick={clearHistory}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md text-sm focus:outline-none focus:shadow-outline"
                    >
                        Clear History
                    </button>
                </div>
                {calculationHistory.length > 0 ? (
                    <div className="max-h-72 overflow-y-auto">
                        <table className="min-w-full leading-normal rounded-lg overflow-hidden bg-gray-100">
                            <thead className="bg-gray-200 text-gray-700">
                                <tr>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">Risk ($)</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">Entry</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">Stop Loss</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">Order Value</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">Risk (%)</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">Time</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">Delete</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {calculationHistory.map((record, index) => (
                                    <tr key={index}>
                                        <td className="px-5 py-5 border-b border-gray-200 text-sm text-gray-900">{typeof record.riskAmount === 'number' ? record.riskAmount.toFixed(2) : 'Invalid Data'}</td>
                                        <td className="px-5 py-5 border-b border-gray-200 text-sm text-gray-900">{record.entryPrice.toFixed(2)}</td>
                                        <td className="px-5 py-5 border-b border-gray-200 text-sm text-gray-900">{record.stopLossPrice.toFixed(2)}</td>
                                        <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                            <span className="inline-block bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-semibold font-mono">
                                                {record.orderValue}
                                            </span>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                            <span className="inline-block bg-red-200 text-red-700 px-2 py-1 rounded-full text-xs font-semibold font-mono">
                                                {record.percentageDifference}%
                                            </span>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 text-sm text-gray-900">{record.timestamp}</td>
                                        <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                            <button
                                                onClick={() => deleteHistoryItem(index)}
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-md text-xs focus:outline-none focus:shadow-outline"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm italic">No calculations yet.</p>
                )}
            </div>
        </div>
    );
};

// Main CalculatorPage component
const CalculatorPage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const weather = { temperature: 27, condition: "Sunny" }; 

    const handleLogout = async () => {
        console.log('Logout button clicked!');
        await logout();
        navigate('/');
        console.log('CalculatorPage: Navigated to / after logout.');
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Navbar for toggle button */}
            <Navbar setIsSidebarOpen={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} />

            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                weather={weather}
                user={user}
                handleLogout={handleLogout}
                isSidebarOpen={isSidebarOpen} 
                setIsSidebarOpen={setIsSidebarOpen}

            />

            {/* Overlay for open sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={toggleSidebar} 
                ></div>
            )}

            {/* Main Content Area */}
            <main className="flex-1 p-6 overflow-y-auto">
                <CalculatorComponent />
            </main>
        </div>
    );
};

export default CalculatorPage;