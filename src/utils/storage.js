/**
 * 本地存储工具模块
 * 用于保存和读取用户的持仓信息
 */

const STORAGE_KEY = 'stock_valuation_data'

/**
 * 保存持仓数据到本地存储
 * @param {Object} data - 持仓数据对象
 * @param {number} data.position - 持仓数量
 * @param {number} data.costPrice - 成本价
 * @param {number} data.currentPrice - 现价
 * @param {number} data.limitPercent - 涨跌停比例
 */
export function saveStockData(data) {
  try {
    const dataToSave = {
      position: data.position,
      costPrice: data.costPrice,
      currentPrice: data.currentPrice,
      limitPercent: data.limitPercent,
      savedAt: new Date().toISOString() // 保存时间戳
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
    return true
  } catch (error) {
    console.error('保存数据失败：', error)
    return false
  }
}

/**
 * 从本地存储读取持仓数据
 * @returns {Object|null} 返回持仓数据对象，如果不存在则返回null
 */
export function loadStockData() {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY)
    if (savedData) {
      const data = JSON.parse(savedData)
      // 验证数据完整性
      if (data.position && data.costPrice && data.currentPrice && data.limitPercent) {
        return {
          position: data.position,
          costPrice: data.costPrice,
          currentPrice: data.currentPrice,
          limitPercent: data.limitPercent,
          savedAt: data.savedAt
        }
      }
    }
    return null
  } catch (error) {
    console.error('读取数据失败：', error)
    return null
  }
}

/**
 * 清除本地存储的持仓数据
 */
export function clearStockData() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return true
  } catch (error) {
    console.error('清除数据失败：', error)
    return false
  }
}

/**
 * 检查是否有保存的数据
 * @returns {boolean} 如果有保存的数据返回true，否则返回false
 */
export function hasSavedData() {
  return loadStockData() !== null
}
