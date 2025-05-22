import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Edit, Save, XCircle } from 'lucide-react'; // Removed unused icons for this file
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const Profile = () => {
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState('USD');

    const { user } = useAuth(); 

    const [profileData, setProfileData] = useState({
        fullName: user?.username || user?.name || 'Guest User', 
        country: 'Nigeria',
        address: '123 Main Street',
        phone: '+234 903 564 2345',
        email: user?.email || 'guestuser@example.com', 
    });

    // State to control edit mode
    const [isEditing, setIsEditing] = useState(false);

    // State to hold temporary input values during editing
    const [tempProfileData, setTempProfileData] = useState({ ...profileData });

    useEffect(() => {
        if (user) {
            setProfileData(prev => ({
                ...prev,
                fullName: user.username || user.name || prev.fullName,
                email: user.email || prev.email,
            }));
            setTempProfileData(prev => ({
                ...prev,
                fullName: user.username || user.name || prev.fullName,
                email: user.email || prev.email,
            }));
        }
    }, [user]);

    const handleEditClick = () => {
        setIsEditing(true);
        setTempProfileData({ ...profileData });
    };

    const handleCancelClick = () => {
        setIsEditing(false);
    };

    const handleSaveClick = () => {
        console.log("Saving profile data:", tempProfileData);
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
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar component */}
            <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

            <div className="flex-1 flex flex-col">
                {/* Navbar component */}
                <Navbar
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    selectedCurrency={selectedCurrency} 
                    setSelectedCurrency={setSelectedCurrency}
                />

                {/* Main content area */}
                <main className="flex-1 flex flex-col p-6 overflow-y-auto mt-16 md:mt-0 md:ml-64"> {/* mt-16 for navbar height, md:ml-64 for sidebar width */}
                    <header className="flex justify-between items-center mb-8 w-full max-w-2xl mx-auto md:mx-0 md:pr-6"> {/* Added mx-auto for centering on smaller screens */}
                        <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
                            <User className="w-6 h-6 mr-2" />
                            User Profile
                        </h1>
                        <div>
                            {!isEditing ? (
                                <button
                                    onClick={handleEditClick}
                                    className="flex items-center bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 hover:text-blue-600 px-4 py-2 rounded-md border border-blue-500/30 transition-colors"
                                >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Profile
                                </button>
                            ) : (
                                <div className="space-x-2 flex">
                                    <button
                                        onClick={handleSaveClick}
                                        className="flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        Save
                                    </button>
                                    <button
                                        onClick={handleCancelClick}
                                        className="flex items-center bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-800 px-4 py-2 rounded-md border border-gray-200 transition-colors"
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
                        className="w-full max-w-2xl mx-auto md:mx-0 md:pr-6" 
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
        </div>
    );
};

export default Profile;