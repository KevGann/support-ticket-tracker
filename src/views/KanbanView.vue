<template>
  <div class="kanban-board">
    <div v-for="status in statuses" :key="status" 
         class="kanban-column" 
         @dragover.prevent @drop="handleDrop($event, status)">
      
      <div class="column-header">
        <span class="status-title">{{ status }}</span>
        <div class="header-badges">
          <span v-if="status === 'New' && getUnassignedCount(status) > 0" class="badge unassigned">
            {{ getUnassignedCount(status) }} Unassigned
          </span>
          <span v-if="getBreachedCount(status) > 0" class="badge breached">
            {{ getBreachedCount(status) }} Breached
          </span>
        </div>
      </div>

      <div class="column-body">
        <TicketCard 
          v-for="ticket in store.ticketsByStatus[status]" 
          :key="ticket.id" 
          :ticket="ticket" 
          draggable="true"
          @dragstart="handleDragStart($event, ticket)"
          @click="openTicketDetail(ticket)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTicketStore } from '../stores/ticketStore';
import { inject } from 'vue';
import TicketCard from '../components/tickets/TicketCard.vue';

const store = useTicketStore();
const statuses = ['New', 'Open', 'Pending', 'Resolved', 'Closed'];

const openTicketDetail = inject('openTicketDetail');

let draggedTicket = null;

const handleDragStart = (e, ticket) => {
  draggedTicket = ticket;
  e.dataTransfer.effectAllowed = 'move';
};

const handleDrop = (e, newStatus) => {

  if (draggedTicket && draggedTicket.status !== newStatus) {
    store.updateTicket(draggedTicket.id, { status: newStatus });
  }

  draggedTicket = null;
};

const getBreachedCount = (status) => {
  return store.ticketsByStatus[status].filter(t => store.getSlaStatus(t) === 'breached').length;
};

const getUnassignedCount = (status) => {
  return store.ticketsByStatus[status].filter(t => !t.assignee).length;
};
</script>

<style scoped>
.kanban-board {
    display: flex;
    gap: var(--spacing-4);
    padding: var(--spacing-4);
    overflow-x: auto;
    flex: 1;
}

.kanban-column {
    flex: 1 1 0;
    min-width: 280px;
    display: flex;
    flex-direction: column;
    background: var(--color-surface-container-low);
    border-radius: var(--border-radius-lg);
    max-height: 100%;
}

.column-header {
    padding: var(--spacing-3) var(--spacing-4);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
    border-bottom: 1px solid var(--color-outline-variant);
}

.status-title {
    font-weight: 600;
    color: var(--color-on-surface);
}

.header-badges {
    display: flex;
    gap: var(--spacing-2);
}

.badge {
    font-size: var(--font-size-xs);
    padding: 2px 6px;
    border-radius: 99px;
    font-weight: 500;
}

.badge.breached {
    background: var(--color-error);
    color: var(--color-on-error);
}

.badge.unassigned {
    background: var(--color-secondary-container);
    color: var(--color-on-secondary-container);
}

.column-body {
    flex: 1;
    overflow-y: auto;
    padding: var(--spacing-3);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3);
}
</style>