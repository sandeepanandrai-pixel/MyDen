import React, { createContext, useContext, useState, useEffect } from 'react';

const DemoModeContext = createContext();

export const useDemoMode = () => {
    const context = useContext(DemoModeContext);
    if (!context) {
        throw new Error('useDemoMode must be used within DemoModeProvider');
    }
    return context;
};

export const DemoModeProvider = ({ children }) => {
    const [isDemoMode, setIsDemoMode] = useState(false);
    const [demoBalance, setDemoBalance] = useState(10000); // $10,000 demo balance
    const [demoPortfolio, setDemoPortfolio] = useState([]);
    const [demoTransactions, setDemoTransactions] = useState([]);

    // Load demo state from localStorage
    useEffect(() => {
        const savedDemoMode = localStorage.getItem('demoMode') === 'true';
        const savedBalance = localStorage.getItem('demoBalance');
        const savedPortfolio = localStorage.getItem('demoPortfolio');
        const savedTransactions = localStorage.getItem('demoTransactions');

        if (savedDemoMode) {
            setIsDemoMode(true);
            if (savedBalance) setDemoBalance(parseFloat(savedBalance));
            if (savedPortfolio) setDemoPortfolio(JSON.parse(savedPortfolio));
            if (savedTransactions) setDemoTransactions(JSON.parse(savedTransactions));
        }
    }, []);

    const enableDemoMode = () => {
        setIsDemoMode(true);
        setDemoBalance(10000);
        setDemoPortfolio([]);
        setDemoTransactions([]);
        localStorage.setItem('demoMode', 'true');
        localStorage.setItem('demoBalance', '10000');
        localStorage.setItem('demoPortfolio', '[]');
        localStorage.setItem('demoTransactions', '[]');
    };

    const disableDemoMode = () => {
        setIsDemoMode(false);
        setDemoBalance(10000);
        setDemoPortfolio([]);
        setDemoTransactions([]);
        localStorage.removeItem('demoMode');
        localStorage.removeItem('demoBalance');
        localStorage.removeItem('demoPortfolio');
        localStorage.removeItem('demoTransactions');
    };

    const executeDemoTransaction = ({ type, symbol, quantity, price }) => {
        const total = quantity * price;

        if (type === 'buy') {
            if (demoBalance < total) {
                throw new Error('Insufficient demo balance');
            }

            const newBalance = demoBalance - total;
            const existingAsset = demoPortfolio.find(a => a.symbol === symbol);

            let newPortfolio;
            if (existingAsset) {
                const totalCost = (existingAsset.averageBuyPrice * existingAsset.quantity) + total;
                const newQuantity = existingAsset.quantity + quantity;
                newPortfolio = demoPortfolio.map(a =>
                    a.symbol === symbol
                        ? { ...a, quantity: newQuantity, averageBuyPrice: totalCost / newQuantity }
                        : a
                );
            } else {
                newPortfolio = [...demoPortfolio, { symbol, quantity, averageBuyPrice: price }];
            }

            setDemoBalance(newBalance);
            setDemoPortfolio(newPortfolio);
            localStorage.setItem('demoBalance', newBalance.toString());
            localStorage.setItem('demoPortfolio', JSON.stringify(newPortfolio));
        } else {
            // Sell
            const existingAsset = demoPortfolio.find(a => a.symbol === symbol);
            if (!existingAsset || existingAsset.quantity < quantity) {
                throw new Error('Insufficient holdings');
            }

            const newBalance = demoBalance + total;
            const newPortfolio = demoPortfolio.map(a =>
                a.symbol === symbol
                    ? { ...a, quantity: a.quantity - quantity }
                    : a
            ).filter(a => a.quantity > 0);

            setDemoBalance(newBalance);
            setDemoPortfolio(newPortfolio);
            localStorage.setItem('demoBalance', newBalance.toString());
            localStorage.setItem('demoPortfolio', JSON.stringify(newPortfolio));
        }

        // Record transaction
        const newTransaction = {
            id: Date.now(),
            type,
            symbol,
            quantity,
            price,
            total,
            date: new Date().toISOString()
        };
        const newTransactions = [newTransaction, ...demoTransactions];
        setDemoTransactions(newTransactions);
        localStorage.setItem('demoTransactions', JSON.stringify(newTransactions));

        return newTransaction;
    };

    const value = {
        isDemoMode,
        demoBalance,
        demoPortfolio,
        demoTransactions,
        enableDemoMode,
        disableDemoMode,
        executeDemoTransaction
    };

    return (
        <DemoModeContext.Provider value={value}>
            {children}
        </DemoModeContext.Provider>
    );
};
