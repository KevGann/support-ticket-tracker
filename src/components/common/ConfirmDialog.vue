<template>
  <BaseDialog @close="$emit('close')" max-width="400px">
    <h3 class="dialog-title">{{ title }}</h3>
    <p class="dialog-message">{{ message }}</p>
    <div class="dialog-actions">
      <button class="btn-secondary" @click="$emit('close')">{{ cancelText }}</button>
      <button class="btn-danger" @click="$emit('confirm'); $emit('close')">{{ confirmText }}</button>
    </div>
  </BaseDialog>
</template>

<script setup>
import BaseDialog from './BaseDialog.vue';

defineProps({
  title: String, message: String, 
  confirmText: { type: String, default: 'Confirm' },
  cancelText: { type: String, default: 'Cancel' }
});
defineEmits(['confirm', 'close']);
</script>

<style scoped>
.dialog-title {
    margin: 0 0 var(--spacing-3);
    color: var(--color-on-surface);
}

.dialog-message {
    color: var(--color-on-surface-variant);
    margin-bottom: var(--spacing-6);
}

.dialog-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-3);
}

.btn-secondary,
.btn-danger {
    padding: var(--spacing-2) var(--spacing-4);
    border-radius: var(--border-radius-md);
    border: none;
    cursor: pointer;
    font-weight: 500;
}

.btn-secondary {
    background: var(--color-surface-variant);
    color: var(--color-on-surface);
}

.btn-danger {
    background: var(--color-error);
    color: var(--color-on-error);
}
</style>