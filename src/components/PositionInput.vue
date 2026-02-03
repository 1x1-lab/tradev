<template>
  <div class="position-input">
    <h2>仓位输入</h2>
    <div class="input-group">
      <label for="position">请输入仓位（0-100%）：</label>
      <input
        id="position"
        v-model.number="inputPosition"
        type="number"
        min="0"
        max="100"
        step="0.1"
        placeholder="例如：50"
        class="position-input-field"
        @input="handleInput"
      />
      <span class="unit">%</span>
    </div>
    <div class="input-hint">
      <p>提示：仓位表示您投入的资金占总资金的比例</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

/**
 * 仓位输入组件
 * 用于接收用户输入的仓位信息，并实时触发计算
 */

// 定义组件的事件
const emit = defineEmits(['position-change'])

// 仓位输入值（响应式）
const inputPosition = ref('')

/**
 * 处理输入变化
 * 当用户输入仓位时，验证并触发计算
 */
const handleInput = () => {
  // 验证输入值
  const position = parseFloat(inputPosition.value)
  
  // 如果输入有效，触发父组件的计算
  if (!isNaN(position) && position >= 0 && position <= 100) {
    emit('position-change', position)
  } else if (inputPosition.value === '') {
    // 如果输入为空，重置计算结果
    emit('position-change', null)
  }
}

// 监听输入值变化
watch(inputPosition, () => {
  handleInput()
})
</script>

<style scoped>
.position-input {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.position-input h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #42b883;
  font-size: 1.8rem;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.input-group label {
  font-size: 1.1rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  white-space: nowrap;
}

.position-input-field {
  flex: 1;
  padding: 0.8rem 1rem;
  font-size: 1.2rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  transition: all 0.3s ease;
}

.position-input-field:focus {
  outline: none;
  border-color: #42b883;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.2);
}

.position-input-field::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.unit {
  font-size: 1.2rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
}

.input-hint {
  margin-top: 1rem;
  padding: 0.8rem;
  background: rgba(66, 184, 131, 0.1);
  border-radius: 6px;
  border-left: 3px solid #42b883;
}

.input-hint p {
  margin: 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

@media (prefers-color-scheme: light) {
  .position-input {
    background: rgba(0, 0, 0, 0.02);
    border-color: rgba(0, 0, 0, 0.1);
  }

  .position-input h2 {
    color: #2c5530;
  }

  .input-group label {
    color: rgba(0, 0, 0, 0.8);
  }

  .position-input-field {
    background: rgba(255, 255, 255, 0.9);
    color: #213547;
    border-color: rgba(0, 0, 0, 0.2);
  }

  .position-input-field:focus {
    border-color: #42b883;
    background: #fff;
  }

  .position-input-field::placeholder {
    color: rgba(0, 0, 0, 0.4);
  }

  .unit {
    color: rgba(0, 0, 0, 0.7);
  }

  .input-hint {
    background: rgba(66, 184, 131, 0.1);
    border-left-color: #42b883;
  }

  .input-hint p {
    color: rgba(0, 0, 0, 0.6);
  }
}
</style>
