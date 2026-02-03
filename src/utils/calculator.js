/**
 * 股票基金测算计算工具模块
 * 提供基于持仓、成本、现价和涨跌停比例的计算功能
 */

/**
 * 计算未来N天的涨停和跌停价格
 * @param {number} position - 持仓数量（股数）
 * @param {number} costPrice - 成本价（元）
 * @param {number} currentPrice - 现价（元）
 * @param {number} limitPercent - 涨跌停比例（百分比，如10表示10%）
 * @param {number} days - 需要计算的天数，默认5天
 * @returns {Array} 返回包含每天涨停跌停信息的数组
 */
export function calculateLimitPrices(position, costPrice, currentPrice, limitPercent, days = 5) {
  // 参数验证
  if (position <= 0) {
    throw new Error('持仓数量必须大于0');
  }
  
  if (costPrice <= 0) {
    throw new Error('成本价必须大于0');
  }
  
  if (currentPrice <= 0) {
    throw new Error('现价必须大于0');
  }
  
  if (limitPercent <= 0 || limitPercent > 100) {
    throw new Error('涨跌停比例必须在0-100之间');
  }
  
  if (days <= 0 || !Number.isInteger(days)) {
    throw new Error('天数必须为正整数');
  }

  const results = [];
  // 使用两个独立的基准价：涨停路径和跌停路径
  let basePriceForUp = currentPrice;   // 涨停路径的基准价，每天更新为前一天的涨停价
  let basePriceForDown = currentPrice; // 跌停路径的基准价，每天更新为前一天的跌停价
  const totalCost = position * costPrice; // 总成本
  const currentMarketValue = position * currentPrice; // 当前市值（初始市值）
  
  // 保存上一次的市值，用于计算实际盈亏
  let previousMarketValueForUp = currentMarketValue;   // 涨停路径的上一次市值
  let previousMarketValueForDown = currentMarketValue; // 跌停路径的上一次市值

  // 计算每一天的涨停和跌停情况
  for (let day = 1; day <= days; day++) {
    // 使用涨停基准价计算涨停价格（保留4位小数）
    const limitUpPrice = Math.floor(basePriceForUp * (1 + limitPercent / 100) * 10000) / 10000;
    
    // 使用跌停基准价计算跌停价格（保留4位小数）
    const limitDownPrice = Math.ceil(basePriceForDown * (1 - limitPercent / 100) * 10000) / 10000;
    
    // 计算涨停时的市值
    const limitUpMarketValue = position * limitUpPrice;
    
    // 计算跌停时的市值
    const limitDownMarketValue = position * limitDownPrice;
    
    // 计算涨停时的盈亏
    const limitUpProfit = limitUpMarketValue - totalCost;
    
    // 计算跌停时的盈亏
    const limitDownProfit = limitDownMarketValue - totalCost;
    
    // 计算涨停时的盈亏比例
    const limitUpProfitPercent = ((limitUpPrice - costPrice) / costPrice) * 100;
    
    // 计算跌停时的盈亏比例
    const limitDownProfitPercent = ((limitDownPrice - costPrice) / costPrice) * 100;
    
    // 计算涨停时的实际盈亏（当前市值减去上一次市值）
    const limitUpActualProfit = limitUpMarketValue - previousMarketValueForUp;
    
    // 计算跌停时的实际盈亏（当前市值减去上一次市值）
    const limitDownActualProfit = limitDownMarketValue - previousMarketValueForDown;
    
    // 计算涨停时的实际盈亏率（实际盈亏相对于上一次市值的比例）
    const limitUpActualProfitPercent = (limitUpActualProfit / limitUpMarketValue) * 100;
    
    // 计算跌停时的实际盈亏率（实际盈亏相对于上一次市值的比例）
    const limitDownActualProfitPercent = (limitDownActualProfit / limitDownMarketValue) * 100;
    
    // 计算涨停时的涨跌幅（相对于前一天）
    const limitUpChangePercent = limitPercent;
    
    // 计算跌停时的涨跌幅（相对于前一天）
    const limitDownChangePercent = -limitPercent;

    // 构建当天的数据对象
    const dayData = {
      day: day,                                    // 第几天
      basePrice: parseFloat(currentPrice.toFixed(4)), // 显示初始价格作为参考基准价
      basePriceForUp: parseFloat(basePriceForUp.toFixed(4)),   // 涨停路径的基准价
      basePriceForDown: parseFloat(basePriceForDown.toFixed(4)), // 跌停路径的基准价
      limitUp: {
        price: parseFloat(limitUpPrice.toFixed(4)),              // 涨停价格（4位小数）
        marketValue: parseFloat(limitUpMarketValue.toFixed(4)),  // 涨停市值（4位小数）
        profit: parseFloat(limitUpProfit.toFixed(4)),            // 涨停盈亏（4位小数）
        profitPercent: parseFloat(limitUpProfitPercent.toFixed(2)), // 涨停盈亏比例（2位小数）
        actualProfit: parseFloat(limitUpActualProfit.toFixed(4)), // 涨停实际盈亏（4位小数）
        actualProfitPercent: parseFloat(limitUpActualProfitPercent.toFixed(2)), // 涨停实际盈亏率（2位小数）
        changePercent: parseFloat(limitUpChangePercent.toFixed(2))   // 涨停涨跌幅（2位小数）
      },
      limitDown: {
        price: parseFloat(limitDownPrice.toFixed(4)),              // 跌停价格（4位小数）
        marketValue: parseFloat(limitDownMarketValue.toFixed(4)),  // 跌停市值（4位小数）
        profit: parseFloat(limitDownProfit.toFixed(4)),            // 跌停盈亏（4位小数）
        profitPercent: parseFloat(limitDownProfitPercent.toFixed(2)), // 跌停盈亏比例（2位小数）
        actualProfit: parseFloat(limitDownActualProfit.toFixed(4)), // 跌停实际盈亏（4位小数）
        actualProfitPercent: parseFloat(limitDownActualProfitPercent.toFixed(2)), // 跌停实际盈亏率（2位小数）
        changePercent: parseFloat(limitDownChangePercent.toFixed(2))   // 跌停涨跌幅（2位小数）
      }
    };

    results.push(dayData);
    
    // 更新基准价和上一次市值：涨停路径使用前一天的涨停价，跌停路径使用前一天的跌停价
    basePriceForUp = limitUpPrice;     // 下一天的涨停基准价 = 今天的涨停价
    basePriceForDown = limitDownPrice; // 下一天的跌停基准价 = 今天的跌停价
    previousMarketValueForUp = limitUpMarketValue;     // 下一天的涨停上一次市值 = 今天的涨停市值
    previousMarketValueForDown = limitDownMarketValue; // 下一天的跌停上一次市值 = 今天的跌停市值
  }

  return results;
}

/**
 * 计算初始持仓信息
 * @param {number} position - 持仓数量
 * @param {number} costPrice - 成本价
 * @param {number} currentPrice - 现价
 * @returns {Object} 返回初始持仓信息
 */
export function calculateInitialInfo(position, costPrice, currentPrice) {
  const totalCost = position * costPrice;
  const currentMarketValue = position * currentPrice;
  const currentProfit = currentMarketValue - totalCost;
  const currentProfitPercent = ((currentPrice - costPrice) / costPrice) * 100;

  return {
    position: position,
    costPrice: parseFloat(costPrice.toFixed(4)), // 成本价（4位小数）
    currentPrice: parseFloat(currentPrice.toFixed(4)), // 现价（4位小数）
    totalCost: parseFloat(totalCost.toFixed(4)), // 总成本（4位小数）
    currentMarketValue: parseFloat(currentMarketValue.toFixed(4)), // 当前市值（4位小数）
    currentProfit: parseFloat(currentProfit.toFixed(4)), // 当前盈亏（4位小数）
    currentProfitPercent: parseFloat(currentProfitPercent.toFixed(2)) // 盈亏比例（2位小数）
  };
}

/**
 * 格式化百分比显示
 * @param {number} value - 数值
 * @param {number} decimals - 小数位数，默认2位
 * @returns {string} 格式化后的字符串
 */
export function formatPercent(value, decimals = 2) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
}

/**
 * 格式化金额显示
 * @param {number} amount - 金额
 * @param {number} decimals - 小数位数，默认4位
 * @returns {string} 格式化后的字符串
 */
export function formatAmount(amount, decimals = 4) {
  return `¥${amount >= 0 ? '+' : ''}${amount.toFixed(decimals)}`;
}

/**
 * 格式化价格显示
 * @param {number} price - 价格
 * @param {number} decimals - 小数位数，默认4位
 * @returns {string} 格式化后的字符串
 */
export function formatPrice(price, decimals = 4) {
  return `¥${price.toFixed(decimals)}`;
}
