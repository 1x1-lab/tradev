<template>
  <div class="app-container">
    <header class="app-header">
      <h1>股票极限测算</h1>
      <p class="subtitle">输入持仓信息，自动计算未来5天的涨跌停价格</p>
    </header>

    <main class="app-main">
      <!-- 计算公式与知识说明组件 -->
      <CalculationGuide />

      <!-- 持仓信息输入组件 -->
      <StockInput @data-change="handleDataChange" />

      <!-- 结果显示组件 -->
      <StockResultDisplay :results="calculationResults" />
    </main>

    <footer class="app-footer">
      <p>提示：计算结果仅供参考，不构成投资建议</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StockInput from './components/StockInput.vue'
import StockResultDisplay from './components/StockResultDisplay.vue'
import CalculationGuide from './components/CalculationGuide.vue'
import { calculateLimitPrices } from './utils/calculator.js'

/**
 * 主应用组件
 * 整合持仓信息输入和结果显示功能，实现完整的股票涨跌停测算流程
 */

// 计算结果数组（响应式）
const calculationResults = ref([])

/**
 * 处理数据变化事件
 * 当用户输入完整的持仓信息时，自动触发未来5天的涨跌停计算
 * @param {Object|null} data - 用户输入的持仓数据，如果为null则清空结果
 */
const handleDataChange = (data) => {
  // 如果输入为空或无效，清空结果
  if (data === null) {
    calculationResults.value = []
    return
  }

  // 自动计算未来5天的涨跌停情况
  try {
    const { position, costPrice, currentPrice, limitPercent } = data
    
    // 调用计算工具函数，计算未来5天的涨跌停价格
    const results = calculateLimitPrices(
      position,        // 持仓数量
      costPrice,      // 成本价
      currentPrice,   // 现价
      limitPercent,   // 涨跌停比例
      5               // 计算5天
    )

    // 更新计算结果
    calculationResults.value = results
  } catch (error) {
    // 错误处理：如果计算失败，显示错误信息
    console.error('计算失败：', error.message)
    calculationResults.value = []
  }
}
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.app-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem 0;
}

.app-header h1 {
  font-size: 2.5rem;
  margin: 0 0 1rem 0;
  background: linear-gradient(135deg, #42b883 0%, #35495e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.app-main {
  flex: 1;
  width: 100%;
}

.app-footer {
  margin-top: 3rem;
  padding: 1.5rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.app-footer p {
  margin: 0;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
}

@media (prefers-color-scheme: light) {
  .app-header h1 {
    background: #2563eb;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .subtitle {
    color: rgba(0, 0, 0, 0.6);
  }

  .app-footer {
    background: rgba(0, 0, 0, 0.02);
    border-color: rgba(0, 0, 0, 0.1);
  }

  .app-footer p {
    color: rgba(0, 0, 0, 0.5);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app-container {
    padding: 1rem;
  }

  .app-header h1 {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }
}
</style>
