import React from 'react';
import {
    ArrowUpRight, ArrowDownLeft, Send, Activity, Calculator, Wallet as WalletIcon,
    TrendingUp, Users, LogOut, Cloud, X, Menu 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
        setIsSidebarOpen(false);
    };

    // Conditional classes for sidebar animation
    const sidebarClasses = `
        fixed top-0 left-0 h-full bg-gray-800 text-white w-64 p-5 z-50
        transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:shadow-none md:flex-shrink-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:hidden flex flex-col // Hide on medium and up, except when explicitly opened
    `;

    // Only for mobile view: user info and logout button that were previously only in the header
    const mobileUserSection = (
        <div className="md:hidden flex flex-col items-center p-4 border-b border-gray-700 mb-4">
            {user && (
                <>
                    <p className="font-semibold text-lg">{user.username || user.name}</p>
                    <p className="text-gray-400 text-sm mb-4">{user.email}</p>
                </>
            )}
            <button
                onClick={handleLogout}
                className="flex items-center justify-center w-full text-red-400 hover:text-red-300 transition-colors duration-200 py-2 rounded-md border border-red-400 hover:border-red-300"
            >
                <LogOut className="h-5 w-5 mr-2" /> Logout
            </button>
        </div>
    );

    return (
        <>
            {/* Sidebar */}
            <aside className={sidebarClasses}>
                {/* Close button for mobile sidebar */}
                <div className="flex justify-between items-center mb-6 md:hidden">
                    <div className="h-8 w-8 rounded-full overflow-hidden mr-2">
                        <img src="bitcon.png" alt="logo" className="h-full w-full object-cover" />
                    </div>
                    <span className="text-xl font-semibold">Crypto Sphere</span>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="text-white p-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <X size={24} />
                    </button>
                </div>

                {mobileUserSection}

                <nav className="flex-1 space-y-2">
                    <Link
                        to="/dashboard"
                        className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-md transition-colors duration-200"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <Activity className="h-5 w-5 mr-3" /> Dashboard
                    </Link>
                    <Link
                        to="/wallet"
                        className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-md transition-colors duration-200"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <WalletIcon className="h-5 w-5 mr-3" /> My Wallet
                    </Link>
                    <Link
                        to="/calculator"
                        className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-md transition-colors duration-200"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <Calculator className="h-5 w-5 mr-3" /> Calculator
                    </Link>
                    <Link
                        to="/history"
                        className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-md transition-colors duration-200"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <TrendingUp className="h-5 w-5 mr-3" /> Transaction History
                    </Link>
                    <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-md transition-colors duration-200"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <Users className="h-5 w-5 mr-3" /> Profile
                    </Link>
                </nav>

                {/* Logout button (optional, but good to have in sidebar for consistency) */}
                {/* If you already have it in Navbar for large screens, you can remove it here */}
                {/* <div className="mt-auto pt-4 border-t border-gray-700">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-red-400 hover:bg-gray-700 rounded-md transition-colors duration-200"
                    >
                        <LogOut className="h-5 w-5 mr-3" /> Logout
                    </button>
                </div> */}
            </aside>

            {/* Overlay for small screens when sidebar is open */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}
        </>
    );
};

export default Sidebar;