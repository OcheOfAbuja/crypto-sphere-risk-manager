import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Calculator as CalculatorIcon,
  User,
  ListChecks,
  Wallet,
  Settings,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button'; // Assuming you have Shadcn UI
import { Link } from 'react-router-dom';

const Sidebar = ({ signOut }) => {
  return (
    <motion.div
      initial={{ x: '-100%' }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-gray-800 text-white w-64 h-screen fixed top-0 left-0 border-r border-gray-700 p-4 flex flex-col"
    >
      <div className="py-4 border-b border-gray-700 mb-6">
        <h1 className="text-xl font-bold">Crypto Sphere RM</h1>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <Link
              to="/dashboard"
              className="flex items-center p-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              <LayoutDashboard className="mr-2" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/calculator"
              className="flex items-center p-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              <CalculatorIcon className="mr-2" />
              Calculator
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              className="flex items-center p-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              <User className="mr-2" />
              Profile
            </Link>
          </li>
          <li>
            <Link
              to="/history"
              className="flex items-center p-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              <ListChecks className="mr-2" />
              History
            </Link>
          </li>
          <li>
            <Link
              to="/wallet"
              className="flex items-center p-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              <Wallet className="mr-2" />
              Wallet
            </Link>
          </li>
          <li>
            <Link
              to="/settings"
              className="flex items-center p-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              <Settings className="mr-2" />
              Settings
            </Link>
          </li>
        </ul>
      </nav>
      <Button
        variant="outline"
        onClick={signOut}
        className="mt-auto bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
      >
        <LogOut className="mr-2" />
        Sign Out
      </Button>
    </motion.div>
  );
};

export default Sidebar;
