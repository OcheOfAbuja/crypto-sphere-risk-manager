import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar'; // Assuming Sidebar.jsx is in the same directory

const Settings = () => {
    // State for settings
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [language, setLanguage] = useState('en');
    const [profileName, setProfileName] = useState('John Doe');
    const [isSaving, setIsSaving] = useState(false);

    // Handlers for input changes
    const handleNotificationsChange = (checked) => {
        setNotificationsEnabled(checked);
    };

    const handleDarkModeChange = (checked) => {
        setDarkMode(checked);
    };

    const handleLanguageChange = (event) => {
        setLanguage(event.target.value);
    };

    const handleProfileNameChange = (event) => {
        setProfileName(event.target.value);
    };

    // Simulate saving settings
    const handleSaveSettings = () => {
        setIsSaving(true);
        console.log('Saving settings:', {
            notificationsEnabled,
            darkMode,
            language,
            profileName
        });
        setTimeout(() => {
            setIsSaving(false);
            alert('Settings Saved!');
        }, 1000);
    };

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    return (
        <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
            <Sidebar />
            <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-md p-6">
                    <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-white mb-6">Settings</h2>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="profile-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Profile Name
                            </label>
                            <input
                                id="profile-name"
                                type="text"
                                value={profileName}
                                onChange={handleProfileNameChange}
                                className="mt-1 w-full px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Your Profile Name"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="notifications" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Enable Notifications
                            </label>
                            <input
                                id="notifications"
                                type="checkbox"
                                checked={notificationsEnabled}
                                onChange={(e) => handleNotificationsChange(e.target.checked)}
                                className="h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="dark-mode" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Dark Mode
                            </label>
                            <input
                                id="dark-mode"
                                type="checkbox"
                                checked={darkMode}
                                onChange={(e) => handleDarkModeChange(e.target.checked)}
                                className="h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Language
                            </label>
                            <select
                                id="language"
                                value={language}
                                onChange={handleLanguageChange}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            >
                                <option value="en">English</option>
                                <option value="es">Español</option>
                                {/* Add more languages as needed */}
                            </select>
                        </div>
                        <button
                            onClick={handleSaveSettings}
                            className="w-full py-2 px-4 rounded-md text-white font-semibold bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-200"
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <span className="inline-flex items-center">
                                    <svg
                                        className="animate-spin h-5 w-5 mr-3 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Saving...
                                </span>
                            ) : (
                                "Save Settings"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
