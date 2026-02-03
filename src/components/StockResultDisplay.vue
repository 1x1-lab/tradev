<template>
  <div class="stock-result-display" v-if="results && results.length > 0">
    <h2>未来5天涨跌停预测</h2>
    
    <!-- 每日详细数据 -->
    <div class="daily-results">
      <div 
        v-for="(result, index) in results" 
        :key="index"
        class="day-card"
      >
        <div class="day-header">
          <h3>第{{ result.day }}天</h3>
          <span class="base-price">初始价格：{{ formatPrice(result.basePrice) }}</span>
        </div>

        <div class="limit-cards">
          <!-- 涨停信息 -->
          <div class="limit-card limit-up">
            <div class="limit-header">
              <span class="limit-label">📈 涨停</span>
            </div>
            <div class="limit-content">
              <div class="limit-item">
                <span class="limit-item-label">基准价：</span>
                <span class="limit-item-value">{{ formatPrice(result.basePriceForUp) }}</span>
              </div>
              <div class="limit-item">
                <span class="limit-item-label">涨停价格：</span>
                <span class="limit-item-value">{{ formatPrice(result.limitUp.price) }}</span>
              </div>
              <div class="limit-item">
                <span class="limit-item-label">涨跌幅：</span>
                <span class="limit-item-value positive">{{ formatPercent(result.limitUp.changePercent) }}</span>
              </div>
              <div class="limit-item">
                <span class="limit-item-label">市值：</span>
                <span class="limit-item-value">{{ formatPrice(result.limitUp.marketValue) }}</span>
              </div>
              <div class="limit-item">
                <span class="limit-item-label">盈亏：</span>
                <span class="limit-item-value" :class="{ positive: result.limitUp.profit >= 0, negative: result.limitUp.profit < 0 }">
                  {{ formatAmount(result.limitUp.profit) }}
                </span>
              </div>
              <div class="limit-item">
                <span class="limit-item-label">实际盈亏：</span>
                <span class="limit-item-value" :class="{ positive: result.limitUp.actualProfit >= 0, negative: result.limitUp.actualProfit < 0 }">
                  {{ formatAmount(result.limitUp.actualProfit) }}
                </span>
              </div>
              <div class="limit-item">
                <span class="limit-item-label">盈亏比例：</span>
                <span class="limit-item-value" :class="{ positive: result.limitUp.profitPercent >= 0, negative: result.limitUp.profitPercent < 0 }">
                  {{ formatPercent(result.limitUp.profitPercent) }}
                </span>
              </div>
              <div class="limit-item">
                <span class="limit-item-label">实际盈亏率：</span>
                <span class="limit-item-value" :class="{ positive: result.limitUp.actualProfitPercent >= 0, negative: result.limitUp.actualProfitPercent < 0 }">
                  {{ formatPercent(result.limitUp.actualProfitPercent) }}
                </span>
              </div>
            </div>
          </div>

          <!-- 跌停信息 -->
          <div class="limit-card limit-down">
            <div class="limit-header">
              <span class="limit-label">📉 跌停</span>
            </div>
            <div class="limit-content">
              <div class="limit-item">
                <span class="limit-item-label">基准价：</span>
                <span class="limit-item-value">{{ formatPrice(result.basePriceForDown) }}</span>
              </div>
              <div class="limit-item">
                <span class="limit-item-label">跌停价格：</span>
                <span class="limit-item-value">{{ formatPrice(result.limitDown.price) }}</span>
              </div>
              <div class="limit-item">
                <span class="limit-item-label">涨跌幅：</span>
                <span class="limit-item-value negative">{{ formatPercent(result.limitDown.changePercent) }}</span>
              </div>
              <div class="limit-item">
                <span class="limit-item-label">市值：</span>
                <span class="limit-item-value">{{ formatPrice(result.limitDown.marketValue) }}</span>
              </div>
              <div class="limit-item">
                <span class="limit-item-label">盈亏：</span>
                <span class="limit-item-value" :class="{ positive: result.limitDown.profit >= 0, negative: result.limitDown.profit < 0 }">
                  {{ formatAmount(result.limitDown.profit) }}
                </span>
              </div>
              <div class="limit-item">
                <span class="limit-item-label">实际盈亏：</span>
                <span class="limit-item-value" :class="{ positive: result.limitDown.actualProfit >= 0, negative: result.limitDown.actualProfit < 0 }">
                  {{ formatAmount(result.limitDown.actualProfit) }}
                </span>
              </div>
              <div class="limit-item">
                <span class="limit-item-label">盈亏比例：</span>
                <span class="limit-item-value" :class="{ positive: result.limitDown.profitPercent >= 0, negative: result.limitDown.profitPercent < 0 }">
                  {{ formatPercent(result.limitDown.profitPercent) }}
                </span>
              </div>
              <div class="limit-item">
                <span class="limit-item-label">实际盈亏率：</span>
                <span class="limit-item-value" :class="{ positive: result.limitDown.actualProfitPercent >= 0, negative: result.limitDown.actualProfitPercent < 0 }">
                  {{ formatPercent(result.limitDown.actualProfitPercent) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- 空状态提示 -->
  <div v-else class="empty-state">
    <p>请输入完整的持仓信息以查看未来5天的涨跌停预测</p>
  </div>
</template>

<script setup>
import { formatPrice, formatAmount, formatPercent } from '../utils/calculator.js'

/**
 * 股票结果显示组件
 * 用于展示未来5天的涨跌停预测结果
 */

// 定义组件接收的props
const props = defineProps({
  results: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.stock-result-display {
  margin-top: 2rem;
}

.stock-result-display h2 {
  margin-top: 0;
  margin-bottom: 2rem;
  color: #60a5fa;
  font-size: 1.8rem;
}

.daily-results {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.day-card {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.day-header h3 {
  margin: 0;
  color: #60a5fa;
  font-size: 1.5rem;
}

.base-price {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  font-weight: 500;
}

.limit-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.limit-card {
  padding: 1.5rem;
  border-radius: 8px;
  border: 2px solid;
}

.limit-card.limit-up {
  background: rgba(248, 113, 113, 0.1); /* 涨停用红色背景 */
  border-color: rgba(248, 113, 113, 0.5); /* 涨停用红色边框 */
}

.limit-card.limit-down {
  background: rgba(74, 222, 128, 0.1); /* 跌停用绿色背景 */
  border-color: rgba(74, 222, 128, 0.5); /* 跌停用绿色边框 */
}

.limit-header {
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.limit-label {
  font-size: 1.2rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
}

.limit-content {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.limit-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.limit-item-label {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}

.limit-item-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
}

.limit-item-value.positive {
  color: #f87171; /* 盈利显示为红色 */
}

.limit-item-value.negative {
  color: #4ade80; /* 亏损显示为绿色 */
}

.empty-state {
  margin-top: 2rem;
  padding: 3rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px dashed rgba(255, 255, 255, 0.15);
}

.empty-state p {
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.1rem;
  margin: 0;
}

@media (prefers-color-scheme: light) {
  .stock-result-display h2 {
    color: #2563eb;
  }

  .day-card {
    background: rgba(0, 0, 0, 0.015);
    border-color: rgba(0, 0, 0, 0.08);
  }

  .day-header {
    border-bottom-color: rgba(0, 0, 0, 0.1);
  }

  .day-header h3 {
    color: #2563eb;
  }

  .base-price {
    color: rgba(0, 0, 0, 0.6);
  }

  .limit-card.limit-up {
    background: rgba(248, 113, 113, 0.1); /* 涨停用红色背景 */
    border-color: rgba(248, 113, 113, 0.4); /* 涨停用红色边框 */
  }

  .limit-card.limit-down {
    background: rgba(74, 222, 128, 0.1); /* 跌停用绿色背景 */
    border-color: rgba(74, 222, 128, 0.4); /* 跌停用绿色边框 */
  }

  .limit-header {
    border-bottom-color: rgba(0, 0, 0, 0.1);
  }

  .limit-label {
    color: rgba(0, 0, 0, 0.8);
  }

  .limit-item-label {
    color: rgba(0, 0, 0, 0.6);
  }

  .limit-item-value {
    color: rgba(0, 0, 0, 0.8);
  }

  .empty-state {
    background: rgba(0, 0, 0, 0.015);
    border-color: rgba(0, 0, 0, 0.08);
  }

  .empty-state p {
    color: rgba(0, 0, 0, 0.5);
  }
}

@media (max-width: 768px) {
  .limit-cards {
    grid-template-columns: 1fr;
  }

  .day-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
