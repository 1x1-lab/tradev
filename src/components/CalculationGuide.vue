<template>
  <div class="calculation-guide">
    <div class="guide-header" @click="toggleExpanded">
      <h2>📚 计算公式与知识说明</h2>
      <span class="toggle-icon" :class="{ expanded: isExpanded }">▼</span>
    </div>

    <div v-if="isExpanded" class="guide-content">
      <!-- 基础计算公式 -->
      <section class="guide-section">
        <h3>1. 基础计算公式</h3>
        
        <div class="formula-group">
          <h4>涨停价格</h4>
          <div class="formula-box">
            <code>涨停价 = floor(基准价 × (1 + 涨跌停比例/100)) × 10000 / 10000</code>
          </div>
          <p class="formula-note">使用向下取整，保留4位小数</p>
        </div>

        <div class="formula-group">
          <h4>跌停价格</h4>
          <div class="formula-box">
            <code>跌停价 = ceil(基准价 × (1 - 涨跌停比例/100)) × 10000 / 10000</code>
          </div>
          <p class="formula-note">使用向上取整，保留4位小数</p>
        </div>

        <div class="formula-group">
          <h4>市值计算</h4>
          <div class="formula-box">
            <code>市值 = 持仓数量 × 当前价格</code>
          </div>
        </div>

        <div class="formula-group">
          <h4>盈亏计算</h4>
          <div class="formula-box">
            <code>盈亏 = 市值 - 总成本</code>
            <br>
            <code>总成本 = 持仓数量 × 成本价</code>
          </div>
        </div>

        <div class="formula-group">
          <h4>盈亏比例</h4>
          <div class="formula-box">
            <code>盈亏比例 = (当前价格 - 成本价) / 成本价 × 100%</code>
          </div>
          <p class="formula-note">盈亏比例始终相对于初始成本价计算</p>
        </div>
      </section>

      <!-- 连续涨跌停原理 -->
      <section class="guide-section">
        <h3>2. 连续涨跌停原理</h3>
        
        <div class="principle-box">
          <h4>基准价更新逻辑</h4>
          <ul>
            <li><strong>涨停路径：</strong>每天的基准价 = 前一天的涨停价</li>
            <li><strong>跌停路径：</strong>每天的基准价 = 前一天的跌停价</li>
            <li>两条路径独立计算，互不影响</li>
          </ul>
        </div>

        <div class="principle-box">
          <h4>复利效应公式</h4>
          <div class="formula-box">
            <code>连续N天涨停：价格_N = 初始价 × (1 + 涨跌停比例/100)^N</code>
            <br>
            <code>连续N天跌停：价格_N = 初始价 × (1 - 涨跌停比例/100)^N</code>
          </div>
          <p class="formula-note">这是复利计算，价格变化呈指数增长或下降</p>
        </div>

        <div class="principle-box">
          <h4>连续跌停后盈亏比例</h4>
          <div class="formula-box">
            <code>盈亏比例_N = [(1 - 涨跌停比例/100)^N - 1] × 100%</code>
          </div>
          <p class="formula-note">假设成本价 = 初始价</p>
        </div>
      </section>

      <!-- 计算示例 -->
      <section class="guide-section">
        <h3>3. 计算示例</h3>
        <p class="example-intro">假设：成本价 = 10.0000，现价 = 10.0000，涨跌停比例 = 10%，持仓 = 1000股</p>

        <div class="example-table-container">
          <h4>连续涨停示例</h4>
          <table class="example-table">
            <thead>
              <tr>
                <th>天数</th>
                <th>基准价</th>
                <th>涨停价</th>
                <th>市值</th>
                <th>盈亏</th>
                <th>盈亏比例</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>初始</td>
                <td>10.0000</td>
                <td>-</td>
                <td>10,000.0000</td>
                <td>0.0000</td>
                <td>0%</td>
              </tr>
              <tr>
                <td>第1天</td>
                <td>10.0000</td>
                <td>11.0000</td>
                <td>11,000.0000</td>
                <td>+1,000.0000</td>
                <td class="positive">+10%</td>
              </tr>
              <tr>
                <td>第2天</td>
                <td>11.0000</td>
                <td>12.1000</td>
                <td>12,100.0000</td>
                <td>+2,100.0000</td>
                <td class="positive">+21%</td>
              </tr>
              <tr>
                <td>第3天</td>
                <td>12.1000</td>
                <td>13.3100</td>
                <td>13,310.0000</td>
                <td>+3,310.0000</td>
                <td class="positive">+33.1%</td>
              </tr>
              <tr>
                <td>第5天</td>
                <td>14.6410</td>
                <td>16.1051</td>
                <td>16,105.1000</td>
                <td>+6,105.1000</td>
                <td class="positive">+61.05%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="example-table-container">
          <h4>连续跌停示例</h4>
          <table class="example-table">
            <thead>
              <tr>
                <th>天数</th>
                <th>基准价</th>
                <th>跌停价</th>
                <th>市值</th>
                <th>盈亏</th>
                <th>盈亏比例</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>初始</td>
                <td>10.0000</td>
                <td>-</td>
                <td>10,000.0000</td>
                <td>0.0000</td>
                <td>0%</td>
              </tr>
              <tr>
                <td>第1天</td>
                <td>10.0000</td>
                <td>9.0000</td>
                <td>9,000.0000</td>
                <td>-1,000.0000</td>
                <td class="negative">-10%</td>
              </tr>
              <tr>
                <td>第2天</td>
                <td>9.0000</td>
                <td>8.1000</td>
                <td>8,100.0000</td>
                <td>-1,900.0000</td>
                <td class="negative">-19%</td>
              </tr>
              <tr>
                <td>第3天</td>
                <td>8.1000</td>
                <td>7.2900</td>
                <td>7,290.0000</td>
                <td>-2,710.0000</td>
                <td class="negative">-27.1%</td>
              </tr>
              <tr>
                <td>第5天</td>
                <td>6.5610</td>
                <td>5.9049</td>
                <td>5,904.9000</td>
                <td>-4,095.1000</td>
                <td class="negative">-40.95%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- 金融知识 -->
      <section class="guide-section">
        <h3>4. 金融知识</h3>
        
        <div class="knowledge-box">
          <h4>为什么亏损会"成倍数增长"？</h4>
          <p>连续跌停时，亏损看起来"成倍数增长"的原因：</p>
          <ul>
            <li><strong>复利效应：</strong>价格按指数下降（0.9^N），不是线性下降</li>
            <li><strong>固定成本：</strong>总成本不变，市值不断下降，导致亏损绝对值加速扩大</li>
            <li><strong>累计亏损：</strong>盈亏比例相对于成本价累积，亏损比例越来越大</li>
            <li><strong>非线性增长：</strong>虽然每天下跌比例相同（如10%），但亏损绝对值在加速增长</li>
          </ul>
        </div>

        <div class="knowledge-box">
          <h4>回本所需涨幅</h4>
          <div class="formula-box">
            <code>回本所需涨幅 = (成本价 / 当前价 - 1) × 100%</code>
          </div>
          <p class="formula-note">例如：成本价10.0000，5天跌停后价格5.9049，回本需要上涨 (10/5.9049 - 1) × 100% = 69.35%</p>
        </div>

        <div class="knowledge-box warning">
          <h4>⚠️ 风险提示</h4>
          <ul>
            <li>连续涨跌停是极端情况，实际市场波动可能不同</li>
            <li>计算结果仅供参考，不构成投资建议</li>
            <li>投资有风险，入市需谨慎</li>
            <li>连续跌停后回本难度较大，需要更大的涨幅才能回本</li>
          </ul>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

/**
 * 计算公式与知识说明组件
 * 提供详细的计算公式、数学原理和金融知识说明
 */

// 控制展开/折叠状态
const isExpanded = ref(false)

/**
 * 切换展开/折叠状态
 */
const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}
</script>

<style scoped>
.calculation-guide {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  overflow: hidden;
}

.guide-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  user-select: none;
}

.guide-header:hover {
  background: rgba(255, 255, 255, 0.05);
}

.guide-header h2 {
  margin: 0;
  color: #60a5fa;
  font-size: 1.5rem;
}

.toggle-icon {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  transition: transform 0.3s ease;
}

.toggle-icon.expanded {
  transform: rotate(180deg);
}

.guide-content {
  padding: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.guide-section {
  margin-bottom: 2.5rem;
}

.guide-section:last-child {
  margin-bottom: 0;
}

.guide-section h3 {
  color: #60a5fa;
  font-size: 1.3rem;
  margin-top: 0;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid rgba(96, 165, 250, 0.3);
}

.guide-section h4 {
  color: rgba(255, 255, 255, 0.95);
  font-size: 1.1rem;
  margin-top: 1.5rem;
  margin-bottom: 0.8rem;
  font-weight: 600;
}

.formula-group {
  margin-bottom: 1.5rem;
}

.formula-box {
  background: rgba(0, 0, 0, 0.4);
  border-left: 3px solid #60a5fa;
  padding: 1rem 1.5rem;
  border-radius: 6px;
  margin: 0.8rem 0;
  font-family: 'Courier New', monospace;
}

.formula-box code {
  color: #60a5fa;
  font-size: 0.95rem;
  line-height: 1.8;
  display: block;
  font-weight: 500;
}

.formula-note {
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.9rem;
  margin-top: 0.5rem;
  font-style: italic;
}

.principle-box {
  background: rgba(96, 165, 250, 0.15);
  border-radius: 8px;
  padding: 1.2rem;
  margin-bottom: 1rem;
  border-left: 3px solid #60a5fa;
}

.principle-box ul {
  margin: 0.8rem 0;
  padding-left: 1.5rem;
}

.principle-box li {
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.principle-box strong {
  color: rgba(255, 255, 255, 1);
  font-weight: 600;
}

.example-intro {
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.95rem;
  margin-bottom: 1rem;
  padding: 0.8rem;
  background: rgba(96, 165, 250, 0.15);
  border-radius: 6px;
  border-left: 3px solid #60a5fa;
}

.example-table-container {
  margin-bottom: 2rem;
  overflow-x: auto;
}

.example-table-container h4 {
  margin-bottom: 1rem;
}

.example-table {
  width: 100%;
  border-collapse: collapse;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  overflow: hidden;
}

.example-table thead {
  background: rgba(96, 165, 250, 0.25);
}

.example-table th {
  padding: 0.8rem;
  text-align: left;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 600;
  border-bottom: 2px solid rgba(96, 165, 250, 0.4);
}

.example-table td {
  padding: 0.8rem;
  color: rgba(255, 255, 255, 0.9);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.example-table tbody tr:hover {
  background: rgba(255, 255, 255, 0.05);
}

.example-table td.positive {
  color: #f87171;
  font-weight: 600;
}

.example-table td.negative {
  color: #4ade80;
  font-weight: 600;
}

.knowledge-box {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 1.2rem;
  margin-bottom: 1rem;
  border-left: 3px solid rgba(255, 255, 255, 0.2);
}

.knowledge-box.warning {
  background: rgba(248, 113, 113, 0.15);
  border-left: 3px solid #f87171;
}

.knowledge-box p {
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  margin: 0.8rem 0;
}

.knowledge-box ul {
  margin: 0.8rem 0;
  padding-left: 1.5rem;
}

.knowledge-box li {
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.knowledge-box strong {
  color: rgba(255, 255, 255, 1);
  font-weight: 600;
}

@media (prefers-color-scheme: light) {
  .calculation-guide {
    background: rgba(0, 0, 0, 0.015);
    border-color: rgba(0, 0, 0, 0.08);
  }

  .guide-header {
    border-bottom-color: rgba(0, 0, 0, 0.1);
  }

  .guide-header:hover {
    background: rgba(0, 0, 0, 0.02);
  }

  .guide-header h2 {
    color: #2563eb;
  }

  .toggle-icon {
    color: rgba(0, 0, 0, 0.6);
  }

  .guide-content {
    border-top-color: rgba(0, 0, 0, 0.1);
  }

  .guide-section h3 {
    color: #2563eb;
    border-bottom-color: rgba(37, 99, 235, 0.3);
  }

  .guide-section h4 {
    color: rgba(0, 0, 0, 0.9);
    font-weight: 600;
  }

  .formula-box {
    background: rgba(0, 0, 0, 0.08);
    border-left-color: #60a5fa;
  }

  .formula-box code {
    color: #2563eb;
    font-weight: 500;
  }

  .formula-note {
    color: rgba(0, 0, 0, 0.7);
  }

  .principle-box {
    background: rgba(96, 165, 250, 0.12);
    border-left-color: #60a5fa;
  }

  .principle-box li {
    color: rgba(0, 0, 0, 0.8);
  }

  .principle-box strong {
    color: rgba(0, 0, 0, 0.95);
    font-weight: 600;
  }

  .example-intro {
    color: rgba(0, 0, 0, 0.75);
    background: rgba(96, 165, 250, 0.12);
    border-left-color: #60a5fa;
  }

  .example-table {
    background: rgba(0, 0, 0, 0.04);
  }

  .example-table thead {
    background: rgba(96, 165, 250, 0.18);
  }

  .example-table th {
    color: rgba(0, 0, 0, 0.9);
    border-bottom-color: rgba(96, 165, 250, 0.4);
  }

  .example-table td {
    color: rgba(0, 0, 0, 0.8);
    border-bottom-color: rgba(0, 0, 0, 0.08);
  }

  .example-table tbody tr:hover {
    background: rgba(0, 0, 0, 0.02);
  }

  .example-table td.positive {
    color: #dc2626;
  }

  .example-table td.negative {
    color: #059669;
  }

  .knowledge-box {
    background: rgba(0, 0, 0, 0.04);
    border-left-color: rgba(0, 0, 0, 0.2);
  }

  .knowledge-box.warning {
    background: rgba(248, 113, 113, 0.12);
    border-left-color: #f87171;
  }

  .knowledge-box p,
  .knowledge-box li {
    color: rgba(0, 0, 0, 0.8);
  }

  .knowledge-box strong {
    color: rgba(0, 0, 0, 0.95);
    font-weight: 600;
  }
}

@media (max-width: 768px) {
  .guide-header {
    padding: 1rem 1.5rem;
  }

  .guide-header h2 {
    font-size: 1.2rem;
  }

  .guide-content {
    padding: 1.5rem;
  }

  .formula-box {
    padding: 0.8rem 1rem;
    font-size: 0.85rem;
  }

  .formula-box code {
    font-size: 0.85rem;
  }

  .example-table {
    font-size: 0.85rem;
  }

  .example-table th,
  .example-table td {
    padding: 0.6rem;
  }
}
</style>
