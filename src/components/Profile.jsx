import React, { useState, useEffect } from 'react';

import { motion } from 'framer-motion'; 
import { User, Edit, Save, XCircle, ArrowLeft, Activity, Calculator as CalculatorIcon, Wallet as GiWallet, Settings as SettingsIcon, Users as UsersIcon, LogOut, TrendingUp as TrendingUpIcon, Cloud } from 'lucide-react'; // Import Icons
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {

    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    
    const weather = { temperature: 27, condition: "Sunny" };

    const handleLogout = () => {
        // In a real application, you would perform actions like:
        // 1. Clearing user tokens/session from localStorage or sessionStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        // 2. Making an API call to invalidate the session on the server
        console.log('Logging out...');

        // Redirect to the login page or home page after logout
        navigate('/'); // Assuming you have a login route
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
                            <TrendingUpIcon className="mr-2 h-4 w-4" />
                            History
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/profile"
                            className="w-full flex items-center justify-start text-white hover:bg-gray-700 px-4 py-2 rounded-md"
                        >
                            <UsersIcon className="mr-2 h-4 w-4" />
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

const Profile = () => {
    
    const [profileData, setProfileData] = useState({
        fullName: 'Guest', 
        country: 'Nigeria',
        address: '123 Main Street',
        phone: '+234 903 564 2345',
        email: 'guestuser@example.com',
    });

    // State to control edit mode
    const [isEditing, setIsEditing] = useState(false);

    // State to hold temporary input values during editing
    const [tempProfileData, setTempProfileData] = useState({ ...profileData });

    // Simulate fetching user data from an API (replace with your actual API call)
    useEffect(() => {
        // In a real application, you would fetch user data here
        // Example:
        // fetch('/api/user/profile')
        //   .then(response => response.json())
        //   .then(data => setProfileData(data))
        //   .catch(error => console.error('Error fetching profile:', error));

        // For this example, we'll just use the initial state
    }, []);

    const handleEditClick = () => {
        setIsEditing(true);
        setTempProfileData({ ...profileData }); // Initialize temp data with current profile data
    };

    const handleCancelClick = () => {
        setIsEditing(false);
    };

    const handleSaveClick = () => {
        // In a real application, you would send the tempProfileData to your API to update the user profile
        // Example:
        // fetch('/api/user/profile', {
        //   method: 'PUT',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(tempProfileData),
        // })
        //   .then(response => response.json())
        //   .then(updatedData => {
        //     setProfileData(updatedData);
        //     setIsEditing(false);
        //   })
        //   .catch(error => console.error('Error updating profile:', error));

        // For this example, we'll just update the local state
        setProfileData({ ...tempProfileData });
        setIsEditing(false);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setTempProfileData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <div className="min-h-screen flex bg-gray-100">
            {/* Static Sidebar */}
            <Sidebar />

            <main className="flex-1 flex flex-col p-6 overflow-y-auto items-center">
                <header className="flex justify-between items-center mb-8 w-full max-w-2xl">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        <User className="w-6 h-6 mr-2 inline-block" />
                        User Profile
                    </h1>
                    <div>
                        {!isEditing ? (
                            <button
                                onClick={handleEditClick}
                                className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 hover:text-blue-600 px-4 py-2 rounded-md border border-blue-500/30"
                            >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Profile
                            </button>
                        ) : (
                            <div className="space-x-2">
                                <button
                                    onClick={handleSaveClick}
                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    Save
                                </button>
                                <button
                                    onClick={handleCancelClick}
                                    className="bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-800 px-4 py-2 rounded-md border border-gray-200"
                                >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-2xl"
                >
                    <div className="shadow-lg rounded-md bg-white p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                                        Full Name
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            id="fullName"
                                            name="fullName"
                                            value={tempProfileData.fullName}
                                            onChange={handleInputChange}
                                            className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
                                        />
                                    ) : (
                                        <p className="mt-1 text-gray-800 font-medium">{profileData.fullName}</p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                                        Country
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            id="country"
                                            name="country"
                                            value={tempProfileData.country}
                                            onChange={handleInputChange}
                                            className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
                                        />
                                    ) : (
                                        <p className="mt-1 text-gray-800">{profileData.country}</p>
                                    )}
                                </div>
                                <div className="col-span-full">
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                        Address
                                    </label>
                                    {isEditing ? (
                                        <textarea
                                            id="address"
                                            name="address"
                                            value={tempProfileData.address}
                                            onChange={handleInputChange}
                                            className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
                                        />
                                    ) : (
                                        <p className="mt-1 text-gray-800">{profileData.address}</p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                        Phone
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={tempProfileData.phone}
                                            onChange={handleInputChange}
                                            className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
                                        />
                                    ) : (
                                        <p className="mt-1 text-gray-800">{profileData.phone}</p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={tempProfileData.email}
                                            onChange={handleInputChange}
                                            className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
                                        />
                                    ) : (
                                        <p className="mt-1 text-gray-800">{profileData.email}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default Profile;