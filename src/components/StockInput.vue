<template>
  <div class="stock-input">
    <h2>持仓信息输入</h2>
    
    <div class="input-form">
      <!-- 持仓数量 -->
      <div class="input-row">
        <label for="position">持仓数量（股）：</label>
        <input
          id="position"
          v-model.number="formData.position"
          type="number"
          min="1"
          step="1"
          placeholder="例如：1000"
          class="input-field"
          @input="handleInput"
        />
      </div>

      <!-- 成本价 -->
      <div class="input-row">
        <label for="costPrice">成本价（元）：</label>
        <input
          id="costPrice"
          v-model.number="formData.costPrice"
          type="number"
          min="0.01"
          step="0.01"
          placeholder="例如：10.50"
          class="input-field"
          @input="handleInput"
        />
      </div>

      <!-- 现价 -->
      <div class="input-row">
        <label for="currentPrice">现价（元）：</label>
        <input
          id="currentPrice"
          v-model.number="formData.currentPrice"
          type="number"
          min="0.01"
          step="0.01"
          placeholder="例如：11.00"
          class="input-field"
          @input="handleInput"
        />
      </div>

      <!-- 涨跌停比例 -->
      <div class="input-row">
        <label for="limitPercent">涨跌停比例（%）：</label>
        <input
          id="limitPercent"
          v-model.number="formData.limitPercent"
          type="number"
          min="0.01"
          max="100"
          step="0.01"
          placeholder="例如：10"
          class="input-field"
          @input="handleInput"
        />
      </div>
    </div>

    <!-- 当前持仓信息展示 -->
    <div v-if="initialInfo" class="current-info">
      <h3>当前持仓信息</h3>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">总成本：</span>
          <span class="info-value">{{ formatPrice(initialInfo.totalCost) }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">当前市值：</span>
          <span class="info-value">{{ formatPrice(initialInfo.currentMarketValue) }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">当前盈亏：</span>
          <span class="info-value" :class="{ positive: initialInfo.currentProfit >= 0, negative: initialInfo.currentProfit < 0 }">
            {{ formatAmount(initialInfo.currentProfit) }}
          </span>
        </div>
        <div class="info-item">
          <span class="info-label">盈亏比例：</span>
          <span class="info-value" :class="{ positive: initialInfo.currentProfitPercent >= 0, negative: initialInfo.currentProfitPercent < 0 }">
            {{ formatPercent(initialInfo.currentProfitPercent) }}
          </span>
        </div>
      </div>
    </div>

    <div class="input-hint">
      <p>💡 提示：输入完成后，系统将自动计算未来5天的涨停和跌停价格，数据会自动保存</p>
      <div class="storage-actions" v-if="hasSavedDataRef">
        <button @click="clearSavedData" class="clear-btn">清除保存的数据</button>
        <span class="saved-info">数据已自动保存</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { calculateInitialInfo, formatPrice, formatAmount, formatPercent } from '../utils/calculator.js'
import { saveStockData, loadStockData, clearStockData } from '../utils/storage.js'

/**
 * 股票持仓输入组件
 * 用于接收用户输入的持仓、成本、现价和涨跌停比例信息
 * 支持自动保存和读取本地存储的数据
 */

// 定义组件的事件
const emit = defineEmits(['data-change'])

// 表单数据（响应式）
const formData = ref({
  position: '',
  costPrice: '',
  currentPrice: '',
  limitPercent: ''
})

// 是否有保存的数据（用于显示清除按钮）
const hasSavedDataRef = ref(false)

/**
 * 组件挂载时，从本地存储加载数据
 */
onMounted(() => {
  const savedData = loadStockData()
  if (savedData) {
    // 恢复保存的数据
    formData.value = {
      position: savedData.position,
      costPrice: savedData.costPrice,
      currentPrice: savedData.currentPrice,
      limitPercent: savedData.limitPercent
    }
    hasSavedDataRef.value = true
    // 触发一次计算，恢复计算结果
    handleInput()
  }
})

// 计算初始持仓信息
const initialInfo = computed(() => {
  const { position, costPrice, currentPrice } = formData.value
  
  if (position > 0 && costPrice > 0 && currentPrice > 0) {
    try {
      return calculateInitialInfo(position, costPrice, currentPrice)
    } catch (error) {
      return null
    }
  }
  return null
})

/**
 * 处理输入变化
 * 当用户输入数据时，验证并触发计算，同时保存到本地存储
 */
const handleInput = () => {
  const { position, costPrice, currentPrice, limitPercent } = formData.value
  
  // 验证所有输入是否有效
  if (position > 0 && costPrice > 0 && currentPrice > 0 && limitPercent > 0 && limitPercent <= 100) {
    const dataToSave = {
      position: parseFloat(position),
      costPrice: parseFloat(costPrice),
      currentPrice: parseFloat(currentPrice),
      limitPercent: parseFloat(limitPercent)
    }
    
    // 保存到本地存储
    saveStockData(dataToSave)
    hasSavedDataRef.value = true
    
    // 触发父组件的计算
    emit('data-change', dataToSave)
  } else {
    // 如果输入不完整，清空结果
    emit('data-change', null)
  }
}

/**
 * 清除保存的数据
 */
const clearSavedData = () => {
  if (confirm('确定要清除保存的数据吗？')) {
    clearStockData()
    hasSavedDataRef.value = false
    // 清空表单
    formData.value = {
      position: '',
      costPrice: '',
      currentPrice: '',
      limitPercent: ''
    }
    emit('data-change', null)
  }
}
</script>

<style scoped>
.stock-input {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.stock-input h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #60a5fa;
  font-size: 1.8rem;
}

.input-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.input-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.input-row label {
  font-size: 1.1rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  white-space: nowrap;
  min-width: 180px;
}

.input-field {
  flex: 1;
  padding: 0.8rem 1rem;
  font-size: 1.2rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  transition: all 0.3s ease;
}

.input-field:focus {
  outline: none;
  border-color: #60a5fa;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
}

.input-field::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.current-info {
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(96, 165, 250, 0.05);
  border-radius: 8px;
  border-left: 3px solid #60a5fa;
}

.current-info h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #60a5fa;
  font-size: 1.3rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
}

.info-value {
  font-size: 1.3rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
}

.info-value.positive {
  color: #f87171; /* 盈利显示为红色 */
}

.info-value.negative {
  color: #4ade80; /* 亏损显示为绿色 */
}

.input-hint {
  margin-top: 1.5rem;
  padding: 0.8rem;
  background: rgba(96, 165, 250, 0.05);
  border-radius: 6px;
  border-left: 3px solid #60a5fa;
}

.input-hint p {
  margin: 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.storage-actions {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.clear-btn {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  background: rgba(248, 113, 113, 0.2);
  border: 1px solid rgba(248, 113, 113, 0.4);
  color: #f87171;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  background: rgba(248, 113, 113, 0.3);
  border-color: rgba(248, 113, 113, 0.6);
}

.saved-info {
  font-size: 0.85rem;
  color: rgba(74, 222, 128, 0.8);
  font-weight: 500;
}

@media (prefers-color-scheme: light) {
  .stock-input {
    background: rgba(0, 0, 0, 0.015);
    border-color: rgba(0, 0, 0, 0.08);
  }

  .stock-input h2 {
    color: #2563eb;
  }

  .input-row label {
    color: rgba(0, 0, 0, 0.8);
  }

  .input-field {
    background: rgba(255, 255, 255, 0.9);
    color: #213547;
    border-color: rgba(0, 0, 0, 0.2);
  }

  .input-field:focus {
    border-color: #60a5fa;
    background: #fff;
  }

  .input-field::placeholder {
    color: rgba(0, 0, 0, 0.4);
  }

  .current-info {
    background: rgba(96, 165, 250, 0.08);
    border-left-color: #60a5fa;
  }

  .current-info h3 {
    color: #2563eb;
  }

  .info-label {
    color: rgba(0, 0, 0, 0.6);
  }

  .info-value {
    color: rgba(0, 0, 0, 0.8);
  }

  .input-hint {
    background: rgba(96, 165, 250, 0.08);
    border-left-color: #60a5fa;
  }

  .input-hint p {
    color: rgba(0, 0, 0, 0.6);
  }

  .clear-btn {
    background: rgba(248, 113, 113, 0.15);
    border-color: rgba(248, 113, 113, 0.3);
    color: #dc2626;
  }

  .clear-btn:hover {
    background: rgba(248, 113, 113, 0.25);
    border-color: rgba(248, 113, 113, 0.5);
  }

  .saved-info {
    color: rgba(34, 197, 94, 0.8);
  }
}

@media (max-width: 768px) {
  .input-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .input-row label {
    min-width: auto;
  }

  .input-field {
    width: 100%;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
