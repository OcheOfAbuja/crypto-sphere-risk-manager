import axios from 'axios';

const API_BASE_URL = 'https://api.coingecko.com/api/v3';

export async function getCryptoPrice(cryptoId) {
  try {
    const response = await axios.get(`${API_BASE_URL}/simple/price?ids=${cryptoId}&vs_currencies=usd`);
    return response.data[cryptoId].usd;
  } catch (error) {
    console.error('Error fetching crypto price:', error);
    return null;
  }
}

export async function fetchHistory(token) {
 
  return [
    {
      date: new Date(),
      riskAmount: 50,
      entryPrice: 0.24583,
      stopLossPrice: 0.24526,
      orderValue: 21739
    }
  ];
}