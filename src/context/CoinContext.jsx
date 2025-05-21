import { createContext, useEffect, useState } from "react";

export const CoinContext = createContext();

const CoinContextProvider = (props) => {
    const [allCoin, setAllCoin] = useState([]);
    const [currency, setCurrency] = useState(() => {
        const storedCurrencyId = localStorage.getItem('selectedCurrency');
        if (storedCurrencyId === 'EUR') {
            return { name: 'eur', symbol: '€', id: 'EUR' };
        } else if (storedCurrencyId === 'NGN') {
            return { name: 'ngn', symbol: '₦', id: 'NGN' };
        } else {
            return { name: 'usd', symbol: '$', id: 'USD' };
        }
    });
    const [exchangeRates, setExchangeRates] = useState({ USD: 1, EUR: null, NGN: null });
    const [exchangeRateLoading, setExchangeRateLoading] = useState(true);
    const [exchangeRateError, setExchangeRateError] = useState(null);

    const fetchExchangeRates = async () => {
        setExchangeRateLoading(true);
        try {
            const response = await fetch('YOUR_EXCHANGE_RATE_API_ENDPOINT'); // Replace with your API endpoint
            const data = await response.json();
            setExchangeRates({
                USD: 1,
                EUR: data.rates.EUR || null,
                NGN: data.rates.NGN || null,
            });
        } catch (error) {
           
            
        } finally {
            setExchangeRateLoading(false);
        }
    };

    useEffect(() => {
        fetchExchangeRates();
    }, []);

    const updateCurrency = (newCurrencyId) => {
        let newCurrency;
        if (newCurrencyId === 'EUR') {
            newCurrency = { name: 'eur', symbol: '€', id: 'EUR' };
        } else if (newCurrencyId === 'NGN') {
            newCurrency = { name: 'ngn', symbol: '₦', id: 'NGN' };
        } else {
            newCurrency = { name: 'usd', symbol: '$', id: 'USD' };
        }
        setCurrency(newCurrency);
        localStorage.setItem('selectedCurrency', newCurrency.id);
    };

    const fetchAllCoin = async () => {
        const options = {
            method: 'GET',
            headers: { accept: 'application/json', 'x-cg-demo-api-key': 'CG-76EEZYgRRzXJAzP727KWYQju' }
        };

        fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false`, options) // Always fetch in USD
            .then(res => res.json())
            .then(res => setAllCoin(res))
            .catch(err => console.error('API Error:', err));
    };

    useEffect(() => {
        fetchAllCoin();
    }, []); // Fetch coins only once in USD

    const contextValue = {
        allCoin,
        currency,
        setCurrency: updateCurrency,
        exchangeRates,
        exchangeRateLoading,
        exchangeRateError,
    };

    return (
        <CoinContext.Provider value={contextValue}>
            {props.children}
        </CoinContext.Provider>
    );
}

export default CoinContextProvider;