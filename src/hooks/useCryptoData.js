import { useState, useEffect } from 'react';
import { getCoinList, getCoinDetails, getCoinPriceHistory } from '../services/cryptoApi';

export const useCoinList = (vs_currency = 'usd') => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        setLoading(true);
        const data = await getCoinList(vs_currency);
        setCoins(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, [vs_currency]);

  return { coins, loading, error };
};

export const useCoinDetails = (coinId) => {
  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoinDetails = async () => {
      if (!coinId) return;
      
      try {
        setLoading(true);
        const data = await getCoinDetails(coinId);
        setCoin(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCoinDetails();
  }, [coinId]);

  return { coin, loading, error };
};

// Add more hooks as needed     