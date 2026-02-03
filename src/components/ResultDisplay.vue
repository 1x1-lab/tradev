<template>
  <div class="result-display" v-if="trends && trends.length > 0">
    <h2>未来5天涨跌预测</h2>
    
    <!-- 累计收益汇总 -->
    <div class="summary-card">
      <div class="summary-item">
        <span class="summary-label">初始仓位：</span>
        <span class="summary-value">{{ initialPosition }}%</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">最终仓位：</span>
        <span class="summary-value" :class="{ positive: totalReturn.finalValue >= initialPosition, negative: totalReturn.finalValue < initialPosition }">
          {{ totalReturn.finalValue }}%
        </span>
      </div>
      <div class="summary-item">
        <span class="summary-label">累计涨跌：</span>
        <span class="summary-value" :class="{ positive: totalReturn.totalChangePercent >= 0, negative: totalReturn.totalChangePercent < 0 }">
          {{ formatPercent(totalReturn.totalChangePercent) }}
        </span>
      </div>
      <div class="summary-item">
        <span class="summary-label">累计金额：</span>
        <span class="summary-value" :class="{ positive: totalReturn.totalChangeAmount >= 0, negative: totalReturn.totalChangeAmount < 0 }">
          {{ formatAmount(totalReturn.totalChangeAmount) }}
        </span>
      </div>
    </div>

    <!-- 每日详细数据 -->
    <div class="daily-results">
      <h3>每日详情</h3>
      <div class="result-table">
        <div class="table-header">
          <div class="col-day">日期</div>
          <div class="col-value">仓位值</div>
          <div class="col-change">涨跌幅</div>
          <div class="col-amount">涨跌金额</div>
        </div>
        <div 
          v-for="(trend, index) in trends" 
          :key="index"
          class="table-row"
          :class="{ positive: trend.isPositive, negative: !trend.isPositive }"
        >
          <div class="col-day">
            <span class="day-label">第{{ trend.day }}天</span>
          </div>
          <div class="col-value">
            <span class="value-text">{{ trend.currentValue }}%</span>
            <span class="arrow" :class="trend.isPositive ? 'arrow-up' : 'arrow-down'">
              {{ trend.isPositive ? '↑' : '↓' }}
            </span>
          </div>
          <div class="col-change" :class="{ positive: trend.isPositive, negative: !trend.isPositive }">
            {{ formatPercent(trend.changePercent) }}
          </div>
          <div class="col-amount" :class="{ positive: trend.changeAmount >= 0, negative: trend.changeAmount < 0 }">
            {{ formatAmount(trend.changeAmount) }}
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- 空状态提示 -->
  <div v-else class="empty-state">
    <p>请输入仓位以查看未来5天的涨跌预测</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { calculateTotalReturn, formatPercent, formatAmount } from '../utils/calculator.js'

/**
 * 结果显示组件
 * 用于展示未来5天的涨跌预测结果
 */

// 定义组件接收的props
const props = defineProps({
  trends: {
    type: Array,
    default: () => []
  },
  initialPosition: {
    type: Number,
    default: 0
  }
})

// 计算累计收益（使用computed实现响应式）
const totalReturn = computed(() => {
  if (!props.trends || props.trends.length === 0) {
    return {
      totalChangePercent: 0,
      totalChangeAmount: 0,
      finalValue: props.initialPosition
    }
  }
  return calculateTotalReturn(props.initialPosition, props.trends)
})

// 导出格式化函数供模板使用（在模板中直接使用导入的函数）
</script>

<style scoped>
.result-display {
  margin-top: 2rem;
}

.result-display h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #42b883;
  font-size: 1.8rem;
}

.result-display h3 {
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.3rem;
}

/* 汇总卡片样式 */
.summary-card {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.summary-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
}

.summary-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
}

.summary-value.positive {
  color: #4ade80;
}

.summary-value.negative {
  color: #f87171;
}

/* 每日结果表格样式 */
.daily-results {
  margin-top: 2rem;
}

.result-table {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.table-header {
  display: grid;
  grid-template-columns: 1fr 1.5fr 1.5fr 1.5fr;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: rgba(66, 184, 131, 0.2);
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  border-bottom: 2px solid rgba(66, 184, 131, 0.3);
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 1.5fr 1.5fr 1.5fr;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: background-color 0.3s ease;
}

.table-row:hover {
  background: rgba(255, 255, 255, 0.05);
}

.table-row:last-child {
  border-bottom: none;
}

.table-row.positive {
  border-left: 3px solid #4ade80;
}

.table-row.negative {
  border-left: 3px solid #f87171;
}

.col-day,
.col-value,
.col-change,
.col-amount {
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.9);
}

.day-label {
  font-weight: 600;
  font-size: 1rem;
}

.value-text {
  font-weight: 600;
  margin-right: 0.5rem;
}

.arrow {
  font-size: 1.2rem;
  font-weight: bold;
}

.arrow-up {
  color: #4ade80;
}

.arrow-down {
  color: #f87171;
}

.col-change.positive,
.col-amount.positive {
  color: #4ade80;
  font-weight: 600;
}

.col-change.negative,
.col-amount.negative {
  color: #f87171;
  font-weight: 600;
}

/* 空状态样式 */
.empty-state {
  margin-top: 2rem;
  padding: 3rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px dashed rgba(255, 255, 255, 0.2);
}

.empty-state p {
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.1rem;
  margin: 0;
}

/* 浅色主题适配 */
@media (prefers-color-scheme: light) {
  .summary-card {
    background: rgba(0, 0, 0, 0.02);
    border-color: rgba(0, 0, 0, 0.1);
  }

  .summary-label {
    color: rgba(0, 0, 0, 0.6);
  }

  .summary-value {
    color: rgba(0, 0, 0, 0.8);
  }

  .result-display h2 {
    color: #2c5530;
  }

  .result-display h3 {
    color: rgba(0, 0, 0, 0.8);
  }

  .result-table {
    background: rgba(0, 0, 0, 0.02);
    border-color: rgba(0, 0, 0, 0.1);
  }

  .table-header {
    background: rgba(66, 184, 131, 0.15);
    border-bottom-color: rgba(66, 184, 131, 0.3);
    color: rgba(0, 0, 0, 0.8);
  }

  .table-row {
    border-bottom-color: rgba(0, 0, 0, 0.05);
  }

  .table-row:hover {
    background: rgba(0, 0, 0, 0.02);
  }

  .col-day,
  .col-value,
  .col-change,
  .col-amount {
    color: rgba(0, 0, 0, 0.8);
  }

  .empty-state {
    background: rgba(0, 0, 0, 0.02);
    border-color: rgba(0, 0, 0, 0.1);
  }

  .empty-state p {
    color: rgba(0, 0, 0, 0.5);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .col-day,
  .col-value,
  .col-change,
  .col-amount {
    padding: 0.5rem 0;
  }

  .summary-card {
    grid-template-columns: 1fr;
  }
}
</style>
