export function calculateOrderValue(riskAmount, entryPrice, stopLossPrice) {
    // Calculate percentage difference
    const priceDifference = Math.abs(entryPrice - stopLossPrice);
    const averagePrice = (entryPrice + stopLossPrice) / 2;
    const percentageDifference = (priceDifference / averagePrice) * 100;
  
    // Calculate order value
    const orderValue = riskAmount / (percentageDifference / 100);
    
    return {
      percentageDifference,
      orderValue
    };
  }