import React from 'react';
import { Menu, X, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Assuming AuthContext is needed here for user info
import { useNavigate } from 'react-router-dom';

const Navbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <header className="bg-gray-800 text-white p-4 flex justify-between items-center w-full shadow-md">
            {/* Logo */}
            <div className="flex items-center">
                <div className="h-8 w-8 rounded-full overflow-hidden mr-2">
                    <img src="bitcon.png" alt="logo" className="h-full w-full object-cover" />
                </div>
                <span className="text-xl font-semibold">Crypto Sphere</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-4">
                <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors duration-200">Dashboard</Link>
                <Link to="/calculator" className="text-gray-300 hover:text-white transition-colors duration-200">Calculator</Link>
                <Link to="/wallet" className="text-gray-300 hover:text-white transition-colors duration-200">My Wallet</Link>
                <Link to="/history" className="text-gray-300 hover:text-white transition-colors duration-200">History</Link>
                <Link to="/profile" className="text-gray-300 hover:text-white transition-colors duration-200">Profile</Link>
            </nav>

            {/* User Info */}
            {user && (
                <div className="hidden md:flex items-center space-x-4">
                    <div className="text-center">
                        <p className="font-semibold text-sm">{user.username || user.name}</p>
                        <p className="text-gray-400 text-xs">{user.email}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center text-gray-300 hover:text-white transition-colors duration-200"
                    >
                        <LogOut className="h-4 w-4 mr-1" /> Logout
                    </button>
                </div>
            )}

            {/* Menu Icon */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="text-white md:hidden p-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </header>
    );
};

export default Navbar;