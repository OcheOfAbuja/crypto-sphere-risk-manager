import React, { createContext, useState, useEffect } from 'react';

const TransactionContext = createContext({
    transactions: [],
    addTransaction: () => { },
});

const TransactionProvider = ({ children }) => {
    const [transactions, setTransactions] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedTransactions = localStorage.getItem('transactions');
            try {
                return savedTransactions ? JSON.parse(savedTransactions) : [];
            } catch (error) {
                console.error("Error parsing transactions from localStorage:", error);
                return [];
            }
        }
        return [];
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('transactions', JSON.stringify(transactions));
        }
    }, [transactions]);

    const addTransaction = (transaction) => {
        setTransactions(prevTransactions => [transaction, ...prevTransactions]);
    };

    return (
        <TransactionContext.Provider value={{ transactions, addTransaction }}>
            {children}
        </TransactionContext.Provider>
    );
};

export { TransactionContext, TransactionProvider };
