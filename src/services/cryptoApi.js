require('dotenv').config(); // Load environment variables from .env
import axios from 'axios';

const API_BASE_URL = 'https://api.coingecko.com/api/v3';
// If you have an API key, add it to headers
const API_KEY = 'CG-76EEZYgRRzXJAzP727KWYQju' || ''; //hardcoded api key

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        ...(API_KEY && { 'x-cg-demo-api-key': API_KEY })
    }
});

export const getCoinList = async (vs_currency = 'usd', per_page = 100, page = 1) => {
    try {
        const response = await api.get('/coins/markets', {
            params: {
                vs_currency,
                per_page,
                page,
                order: 'market_cap_desc'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching coin list:', error);
        throw error;
    }
};

export const getCoinDetails = async (coinId) => {
    try {
        const response = await api.get(`/coins/${coinId}`, {
            params: {
                localization: false,
                tickers: false,
                market_data: true,
                community_data: false,
                developer_data: false,
                sparkline: false
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching details for ${coinId}:`, error);
        throw error;
    }
};

export const getCoinPriceHistory = async (coinId, days = 'max', vs_currency = 'usd') => {
    try {
        const response = await api.get(`/coins/${coinId}/market_chart`, {
            params: {
                vs_currency,
                days
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching price history for ${coinId}:`, error);
        throw error;
    }
};
