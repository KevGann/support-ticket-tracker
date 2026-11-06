<template>
    <div class="ticket-card" :style="cardStyles" @dragstart="$emit('dragstart', $event)">
        <div class="drag-handle">
            <b>⋮⋮</b>
        </div>

        <div class="card-row top-row">
            <span class="ticket-id">{{ ticket.id }}</span>
            <span v-if="showSla" class="sla-badge" :class="slaStatus">
                {{ store.formatTimeRemaining(ticket) }}
            </span>
            <span v-if="slaStatus === 'breached'" class="breached-badge">
                Breached
            </span>
        </div>

        <div class="card-row title-row">{{ ticket.title }}</div>
        <div class="card-row customer-row">{{ ticket.customer }}</div>

        <div class="card-row bottom-row">
            <div class="bottom-left">
                <span class="impact-chip" :style="{ background: impactConfig[ticket.impact].color }">
                    {{ impactConfig[ticket.impact].symbol }}
                </span>
                <div class="tags-container">
                    <span v-for="tag in ticket.tags" :key="tag" class="tag">{{ tag }}</span>
                </div>
            </div>
            <span class="timestamp">{{ formatTime(ticket.lastInteractionAt) }}</span>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useTicketStore } from '../../stores/ticketStore';

const props = defineProps({ ticket: Object });
const store = useTicketStore();

const slaStatus = computed(() => store.getSlaStatus(props.ticket));
const showSla = computed(() => ['running', 'critical', 'paused'].includes(slaStatus.value));

const impactConfig = {
  Low: { symbol: '!', color: 'var(--color-priority-low)' },
  Medium: { symbol: '!!', color: 'var(--color-priority-medium)' },
  High: { symbol: '!!!', color: 'var(--color-priority-high)' }
};

const slaColors = {
  running: 'var(--color-success)',
  critical: 'var(--color-warning)',
  paused: 'var(--color-secondary)',
  breached: 'var(--color-error)',
  stopped: 'transparent'
};

const cardStyles = computed(() => ({
  '--sla-color': slaColors[slaStatus.value] || 'var(--color-outline-variant)'
}));

const formatTime = (timestamp) => {
  const diff = Date.now() - timestamp;
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};
</script>

<style scoped>
.ticket-card {
    position: relative;
    background: var(--color-surface);
    border-radius: var(--border-radius-md);
    box-shadow: var(--shadow-sm);
    border-top: 3px solid var(--sla-color);
    padding: var(--spacing-3);
    cursor: grab;
    transition: box-shadow 0.2s;
}

.ticket-card:hover {
    box-shadow: var(--shadow-md);
}

.ticket-card:active {
    cursor: grabbing;
}

.drag-handle {
    position: absolute;
    top: var(--spacing-2);
    right: var(--spacing-2);
    color: var(--color-outline);
    cursor: grab;
    font-size: var(--font-size-sm);
}

.card-row {
    margin-bottom: var(--spacing-2);
}

.card-row:last-child {
    margin-bottom: 0;
}

.top-row {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    font-size: var(--font-size-xs);
    color: var(--color-on-surface-variant);
    margin-bottom: var(--spacing-3);
}

.ticket-id {
    font-family: var(--font-family-mono);
    font-weight: 600;
}

.sla-badge {
    padding: 2px 6px;
    border-radius: 99px;
    font-weight: 600;
    color: white;
}

.sla-badge.running {
    background: var(--color-success);
}

.sla-badge.critical {
    background: var(--color-warning);
}

.sla-badge.paused {
    background: var(--color-secondary);
}

.breached-badge {
    color: var(--color-error);
    font-weight: 600;
    margin-left: auto;
}

.title-row {
    font-size: var(--font-size-md);
    font-weight: 600;
    color: var(--color-on-surface);
    line-height: 1.3;
}

.customer-row {
    font-size: var(--font-size-sm);
    color: var(--color-on-surface-variant);
}

.bottom-row { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  margin-top: var(--spacing-3); 
  font-size: var(--font-size-xs); 
  color: var(--color-on-surface-variant);
}

.bottom-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  overflow: hidden;
  flex: 1;
  min-width: 0;
}

.impact-chip {
  font-weight: 800;
  font-size: var(--font-size-xs);
  padding: 2px 8px;
  border-radius: 99px;
  letter-spacing: 1px;
  color: #fff;
  flex-shrink: 0;
  line-height: 1.4;
}

.tags-container {
    display: flex;
    gap: var(--spacing-1);
    overflow: hidden;
    max-width: 70%;
}

.tag {
    background: var(--color-surface-variant);
    padding: 2px 6px;
    border-radius: 4px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}

.timestamp {
    white-space: nowrap;
}
</style>