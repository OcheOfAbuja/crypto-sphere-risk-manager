import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CryptoList = ({ data }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((crypto) => (
          <div
            key={crypto.symbol}
            className="flex justify-between items-center border rounded-md p-4 bg-gray-50 hover:bg-gray-100 transition duration-300"
          >
            <div>
              <h3 className="text-lg font-semibold">{crypto.name}</h3>
              <p className="text-gray-500 text-sm">{crypto.symbol}</p>
            </div>
            <div>
              <p className="text-right font-mono">
                ${crypto.price.toFixed(2)}
              </p>
              <p
                className={`text-sm font-medium flex items-center justify-end ${crypto.change > 0 ? 'text-green-500' : 'text-red-500'}`}
              >
                {crypto.change > 0 ? (
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                )}
                {crypto.change.toFixed(2)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CryptoList;