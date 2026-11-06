<template>
  <BaseDialog @close="$emit('close')" max-width="600px">
    <h2 class="form-title">Create New Ticket</h2>
    <form @submit.prevent="submitForm" class="ticket-form">
      <div class="form-group">
        <label>Title</label>
        <input v-model="form.title" required placeholder="Brief summary of the issue" />
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea v-model="form.description" rows="3" placeholder="Detailed context..."></textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Customer Name</label>
          <input v-model="form.customer" required />
        </div>
        <div class="form-group">
          <label>Impact</label>
          <select v-model="form.impact">
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label>Tags (comma separated)</label>
        <input v-model="tagsInput" placeholder="e.g. ceo, urgent" />
      </div>
      <div class="form-actions">
        <button type="button" class="btn-secondary" @click="$emit('close')">Cancel</button>
        <button type="submit" class="btn-primary">Create Ticket</button>
      </div>
    </form>
  </BaseDialog>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useTicketStore } from '../../stores/ticketStore';
import BaseDialog from '../common/BaseDialog.vue';

const emit = defineEmits(['close']);
const store = useTicketStore();

const form = reactive({ title: '', description: '', customer: '', impact: 'Medium', assignee: '' });
const tagsInput = ref('');

const submitForm = () => {

  const tags = tagsInput.value.split(',').map(t => t.trim()).filter(Boolean);

  store.addTicket({ ...form, tags, status: 'New' });
  emit('close');
};
</script>

<style scoped>
.form-title {
    margin: 0 0 var(--spacing-6);
}

.ticket-form {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-4);
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-1);
    flex: 1;
}

.form-group label {
    font-size: var(--font-size-sm);
    font-weight: 500;
    color: var(--color-on-surface-variant);
}

.form-group input,
.form-group textarea,
.form-group select {
    padding: var(--spacing-2) var(--spacing-3);
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--border-radius-md);
    font-size: var(--font-size-md);
    background: var(--color-surface);
}

.form-row {
    display: flex;
    gap: var(--spacing-4);
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-3);
    margin-top: var(--spacing-4);
}

.btn-secondary,
.btn-primary {
    padding: var(--spacing-2) var(--spacing-4);
    border-radius: var(--border-radius-md);
    border: none;
    cursor: pointer;
    font-weight: 500;
    text-wrap: nowrap;
}

.btn-secondary {
    background: var(--color-surface-variant);
    color: var(--color-on-surface);
}

.btn-primary {
    background: var(--color-primary);
    color: var(--color-on-primary);
}
</style>