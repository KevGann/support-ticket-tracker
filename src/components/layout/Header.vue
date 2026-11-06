<template>
  <header class="app-header">
    <div class="header-left">
      <h1 class="title">Support Tickets</h1>
      <div class="sla-metric" :class="{ breached: store.breachedCount > 0 }">
        <b>&#x23F2;</b>
        <span>{{ store.breachedCount }} SLA Breached</span>
      </div>
    </div>
    
    <div class="header-right">
      <div class="view-toggle">
        <button :class="{ active: store.viewMode === 'list' }" @click="store.viewMode = 'list'">
          <b>☰</b> List
        </button>
        <button :class="{ active: store.viewMode === 'kanban' }" @click="store.viewMode = 'kanban'">
          <b>田</b> Board
        </button>
      </div>
      
      <div class="view-toggle">
        <button :class="{ active: store.currentRole === 'agent' }" @click="store.currentRole = 'agent'">
          Agent
        </button>
        <button :class="{ active: store.currentRole === 'customer' }" @click="store.currentRole = 'customer'">
          Customer
        </button>
      </div>

      <button class="btn-primary" @click="openForm">
        <b>+</b> New Ticket
      </button>
    </div>
  </header>
</template>

<script setup>
import { inject } from 'vue';
import { useTicketStore } from '../../stores/ticketStore';

const store = useTicketStore();
const openForm = inject('openForm');
</script>

<style scoped>
.app-header {
  height: var(--header-height);
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-outline-variant);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--spacing-6);
  box-shadow: var(--shadow-sm);
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-6);
}

.title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-on-surface);
  margin: 0;
}

.sla-metric {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-on-surface-variant);
}

.sla-metric.breached {
  color: var(--color-error);
  font-weight: 600;
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
}

.view-toggle {
  display: flex;
  background: var(--color-surface-variant);
  border-radius: var(--border-radius-md);
  padding: 2px;
}

.view-toggle button {
  border: none;
  background: transparent;
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  color: var(--color-on-surface-variant);
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  font-size: var(--font-size-sm);
}

.view-toggle button.active {
  background: var(--color-surface);
  color: var(--color-primary);
  box-shadow: var(--shadow-sm);
}

.btn-primary {
  background: var(--color-primary);
  color: var(--color-on-primary);
  border: none;
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--border-radius-md);
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  text-wrap: nowrap;
}
</style>