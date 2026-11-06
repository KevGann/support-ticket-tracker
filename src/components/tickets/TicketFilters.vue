<template>
  <div class="ticket-filters">
    <div class="search-box">
      <input 
        v-model="store.searchQuery" 
        type="text" 
        placeholder="Search by title, customer, or ID..." 
        class="search-input"
      />
      <button v-if="store.searchQuery" class="clear-btn" @click="store.searchQuery = ''">
        <b>✖</b>
      </button>
    </div>
    
    <div class="sort-controls">
      <label class="sort-label">Sort by:</label>
      <select v-model="store.sortBy" class="sort-select">
        <option value="sla">SLA Expiration</option>
        <option value="impact">Impact (Priority)</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { useTicketStore } from '../../stores/ticketStore';

const store = useTicketStore();
</script>

<style scoped>
.ticket-filters {
    background: var(--color-background);
    padding: var(--spacing-3) var(--spacing-6);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-4);
    border-bottom: 1px solid var(--color-outline-variant);
    flex-wrap: wrap;
}

.search-box {
    position: relative;
    flex: 1;
    max-width: 400px;
    min-width: 200px;
}

.search-icon {
    position: absolute;
    left: var(--spacing-3);
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-on-surface-variant);
    font-size: var(--font-size-sm);
}

.search-input {
    width: 100%;
    padding: var(--spacing-2) var(--spacing-8) var(--spacing-2) var(--spacing-8);
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--border-radius-md);
    background: var(--color-surface);
    font-size: var(--font-size-sm);
    color: var(--color-on-surface);
    outline: none;
    transition: border-color 0.2s;
}

.clear-btn {
    position: absolute;
    right: var(--spacing-2);
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--color-on-surface-variant);
    cursor: pointer;
    padding: var(--spacing-1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.clear-btn:hover {
    background: var(--color-surface-variant);
}

.sort-controls {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
}

.sort-label {
    font-size: var(--font-size-sm);
    color: var(--color-on-surface-variant);
    white-space: nowrap;
}

.sort-select {
    padding: var(--spacing-2) var(--spacing-3);
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--border-radius-md);
    background: var(--color-surface);
    font-size: var(--font-size-sm);
    color: var(--color-on-surface);
    cursor: pointer;
    outline: none;
}
</style>