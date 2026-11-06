<template>
  <div class="list-view-container">
    <div class="table-wrapper">
      <table class="ticket-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Impact</th>
            <th>SLA</th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ticket in store.filteredTickets" :key="ticket.id"
                @click="openTicketDetail(ticket)">
            <td class="id-cell">{{ ticket.id }}</td>
            <td class="title-cell">{{ ticket.title }}</td>
            <td>{{ ticket.customer }}</td>
            <td>
              <span class="status-badge" :class="ticket.status.toLowerCase()">
                {{ ticket.status }}
              </span>
            </td>
            <td>
              <span class="impact-dot" :style="{ background: getImpactColor(ticket.impact) }"></span>
              {{ ticket.impact }}
            </td>
            <td>
              <span v-if="showSla(ticket)" class="sla-badge" :class="store.getSlaStatus(ticket)">
                {{ store.formatTimeRemaining(ticket) }}
              </span>
              <span v-else class="text-muted">-</span>
            </td>
            <td class="time-cell">{{ formatTime(ticket.lastInteractionAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div v-if="store.filteredTickets.length === 0" class="empty-state">
      <p>No tickets match your search.</p>
    </div>
  </div>
</template>

<script setup>
import { useTicketStore } from '../stores/ticketStore';
import { inject } from 'vue';

inject('openTicketDetail')

const store = useTicketStore();

const openTicketDetail = inject('openTicketDetail');

const getImpactColor = (impact) => {
  const map = { Low: 'var(--color-priority-low)', Medium: 'var(--color-priority-medium)', High: 'var(--color-priority-high)' };
  return map[impact] || 'var(--color-outline)';
};

const showSla = (ticket) => ['running', 'critical', 'paused', 'breached'].includes(store.getSlaStatus(ticket));

const formatTime = (timestamp) => {
  const diff = Date.now() - timestamp;
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};
</script>

<style scoped>
.list-view-container {
    flex: 1;
    overflow: auto;
    padding: var(--spacing-4);
}

.table-wrapper {
    background: var(--color-surface);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
}

.ticket-table {
    width: 100%;
    border-collapse: collapse;
    min-width: 800px;
}

.ticket-table th {
    background: var(--color-surface-container);
    color: var(--color-on-surface-variant);
    font-size: var(--font-size-xs);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    text-align: left;
    padding: var(--spacing-3) var(--spacing-4);
    border-bottom: 1px solid var(--color-outline-variant);
    white-space: nowrap;
}

.ticket-table td {
    padding: var(--spacing-3) var(--spacing-4);
    border-bottom: 1px solid var(--color-outline-variant);
    color: var(--color-on-surface);
    font-size: var(--font-size-sm);
    vertical-align: middle;
}

.ticket-table tr:last-child td {
    border-bottom: none;
}

.ticket-table tr:hover td {
    background: var(--color-surface-container-low);
}





.id-cell {
    font-family: var(--font-family-mono);
    font-weight: 600;
    color: var(--color-primary);
}

.title-cell {
    font-weight: 500;
    max-width: 250px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.time-cell {
    white-space: nowrap;
    color: var(--color-on-surface-variant);
}

.text-muted {
    color: var(--color-outline);
}



.status-badge {
    padding: 2px 8px;
    border-radius: 99px;
    font-size: var(--font-size-xs);
    font-weight: 600;
    text-transform: capitalize;
}

.status-badge.new {
    background: var(--color-status-new);
    color: var(--color-on-status-new);
}

.status-badge.open {
    background: var(--color-status-open);
    color: var(--color-on-status-open);
}

.status-badge.pending {
    background: var(--color-status-pending);
    color: var(--color-on-status-pending);
}

.status-badge.resolved {
    background: var(--color-status-solved);
    color: var(--color-on-status-solved);
}

.status-badge.closed {
    background: var(--color-secondary-container);
    color: var(--color-on-secondary-container);
}

.impact-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: var(--spacing-2);
}

.sla-badge {
    padding: 2px 6px;
    border-radius: 99px;
    font-size: var(--font-size-xs);
    font-weight: 600;
    color: white;
}

.sla-badge.running {
    background: var(--color-info);
}

.sla-badge.critical {
    background: var(--color-warning);
}

.sla-badge.paused {
    background: var(--color-secondary);
}

.sla-badge.breached {
    background: var(--color-error);
}

.empty-state {
    text-align: center;
    padding: var(--spacing-12);
    color: var(--color-on-surface-variant);
}

</style>