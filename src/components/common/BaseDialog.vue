<template>
  <Teleport to="body">
    <div class="dialog-overlay" @click.self="$emit('close')">
      <div class="dialog-content" :style="{ maxWidth: maxWidth }">
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({ maxWidth: { type: String, default: '500px' } });
defineEmits(['close']);
</script>

<style scoped>
.dialog-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
}

.dialog-content {
    background: var(--color-surface);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-lg);
    width: 90%;
    padding: var(--spacing-6);
}
</style>