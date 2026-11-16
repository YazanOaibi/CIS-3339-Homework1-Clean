<script setup>
defineProps({
  message: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'info',
  },
})
</script>

<template>
  <p
    v-if="message"
    class="status-message"
    :class="`status-${type}`"
    role="status"
    aria-live="polite"
  >
    {{ message }}
  </p>
</template>

<style scoped>
.status-message {
  margin-top: 16px;
  padding: 12px 14px;
  border-radius: 6px;
  font-weight: 600;
}

.status-success {
  background: #dcfce7;
  color: #166534;
}

.status-error {
  background: #fee2e2;
  color: #991b1b;
}

.status-info {
  background: #dbeafe;
  color: #1e40af;
}
</style>