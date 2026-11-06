<template>
    <BaseDialog @close="$emit('close')" max-width="700px">
        <div class="detail-layout">

            <div class="details-panel">
                <div class="panel-header">
                    <h3 class="panel-title">
                        Ticket Details
                    </h3>
                    <span class="ticket-id-display">{{ ticket.id }}</span>
                </div>

                <form @submit.prevent="saveDetails" class="details-form">
                    <div class="form-group full-width">
                        <label>Title</label>
                        <input v-model="form.title" required />
                    </div>

                    <div class="form-grid">
                        <div class="form-group">
                            <label>Status</label>
                            <select v-model="form.status">
                                <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Impact</label>
                            <select v-model="form.impact">
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Assignee</label>
                            <select v-model="form.assignee">
                                <option value="">Unassigned</option>
                                <option value="Me">Me</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Customer</label>
                            <input v-model="form.customer" required :disabled="ticket.status === 'Closed'"/>
                        </div>
                    </div>

                    <div class="form-group full-width">
                        <label>Tags (comma separated)</label>
                        <input v-model="form.tagsString" placeholder="e.g. ceo, urgent" />
                    </div>

                    <div class="form-group full-width">
                        <label>Description</label>
                        <textarea v-model="form.description"
                                rows="3"
                                :disabled="ticket.status === 'Closed'"></textarea>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>Customer Name</label>
                            <input v-model="form.customer" required placeholder="e.g. Acme Corp" />
                        </div>
                    </div>


                    <div class="form-actions">
                        <button type="submit"
                                class="btn-save">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>

            <div class="chat-header">
                <h3 class="panel-title">
                    Comm Log
                </h3>
            </div>

            <div class="chat-container">
                <div v-for="(log, index) in ticket.logs" :key="index" class="chat-message" :class="[`is-${log.role}`]">
                    <div class="sender-name">{{ log.sender }}</div>
                    <div class="message-bubble">{{ log.message }}</div>
                    <div class="message-time">{{ formatTime(log.timestamp) }}</div>
                </div>
            </div>

            <div class="chat-input-area">
                <div class="role-indicator">
                    Replying as: <strong>{{ store.currentRole === 'agent' ? 'Support Agent' : ticket.customer
                        }}</strong>
                </div>
                <form @submit.prevent="sendMessage" class="input-form">
                    <input v-model="newMessage" placeholder="Type a message..." required class="chat-input" :disabled="ticket.status === 'Closed'" />
                    <button type="submit" class="btn-send">
                        <b>➤</b>
                    </button>
                </form>
            </div>

        </div>
    </BaseDialog>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';
import { useTicketStore } from '../../stores/ticketStore';
import BaseDialog from '../common/BaseDialog.vue';

const props = defineProps({ ticket: Object });
const emit = defineEmits(['close']);
const store = useTicketStore();

const statuses = ['New', 'Open', 'Pending', 'Resolved', 'Closed'];
const newMessage = ref('');

const form = reactive({
    title: '',
    description: '',
    customer: '',
    assignee: '',
    status: '',
    impact: '',
    tagsString: ''
});

watch(() => props.ticket, (newVal) => {
    if (newVal) {
        form.title = newVal.title;
        form.description = newVal.description || '';
        form.customer = newVal.customer;
        form.assignee = newVal.assignee || '';
        form.status = newVal.status;
        form.impact = newVal.impact;
        form.tagsString = (newVal.tags || []).join(', ');
    }
}, { immediate: true });

const saveDetails = () => {
    store.updateTicket(props.ticket.id, {
        title: form.title,
        description: form.description,
        customer: form.customer,
        assignee: form.assignee,
        status: form.status,
        impact: form.impact,
        tags: form.tagsString
    });
};

const sendMessage = () => {
    if (!newMessage.value.trim()) return;
    store.addMessage(props.ticket.id, newMessage.value);
    newMessage.value = '';
};

const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
</script>

<style scoped>
.detail-layout {
    display: flex;
    flex-direction: column;
    max-height: 80vh;
    overflow-y: auto;
    padding-right: var(--spacing-2);
}

.details-panel {
    background: var(--color-surface-container);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-4);
    margin-bottom: var(--spacing-4);
    border: 1px solid var(--color-outline-variant);
}

.panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-4);
    border-bottom: 1px solid var(--color-outline-variant);
    padding-bottom: var(--spacing-3);
}

.panel-title {
    margin: 0;
    font-size: var(--font-size-md);
    font-weight: 600;
    color: var(--color-on-surface);
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
}

.ticket-id-display {
    font-family: var(--font-family-mono);
    font-size: var(--font-size-sm);
    color: var(--color-primary);
    font-weight: 600;
    background: var(--color-primary-container);
    padding: 2px 8px;
    border-radius: var(--border-radius-sm);
}

.details-form {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3);
}


.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-3);
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.form-group.full-width {
    grid-column: 1 / -1;
}

.form-group label {
    font-size: var(--font-size-xs);
    font-weight: 600;
    color: var(--color-on-surface-variant);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.form-group input,
.form-group textarea,
.form-group select {
    padding: var(--spacing-2) var(--spacing-3);
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--border-radius-md);
    font-size: var(--font-size-sm);
    background: var(--color-surface);
    color: var(--color-on-surface);
    transition: border-color 0.2s;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: var(--spacing-2);
}

.btn-save {
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
    font-size: var(--font-size-sm);
}




.chat-header {
    margin-bottom: var(--spacing-3);
}

.chat-container {
    flex: 1;
    min-height: 200px;
    overflow-y: auto;
    padding: var(--spacing-4);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-4);
    background: var(--color-surface-container-low);
    border-radius: var(--border-radius-md);
    margin-bottom: var(--spacing-4);
    border: 1px solid var(--color-outline-variant);
}

.chat-message {
    display: flex;
    flex-direction: column;
    max-width: 80%;
}


.chat-message.is-agent {
    align-self: flex-start;
}

.chat-message.is-customer {
    align-self: flex-end;
    align-items: flex-end;
}

.chat-message.is-system {
    align-self: center;
    align-items: center;
    max-width: 100%;
}


.sender-name {
    font-size: var(--font-size-xs);
    font-weight: 600;
    margin-bottom: 2px;
    color: var(--color-on-surface-variant);
}

.message-bubble {
    padding: var(--spacing-2) var(--spacing-3);
    border-radius: var(--border-radius-lg);
    font-size: var(--font-size-sm);
    line-height: 1.4;
}

.is-agent .message-bubble {
    background: var(--color-primary-container);
    color: var(--color-on-primary-container);
}

.is-customer .message-bubble {
    background: var(--color-secondary-container);
    color: var(--color-on-secondary-container);
}

.is-system .message-bubble {
    background: transparent;
    color: var(--color-on-surface-variant);
    font-style: italic;
    font-size: var(--font-size-xs);
}

.message-time {
    font-size: 10px;
    color: var(--color-outline);
    margin-top: 2px;
}

.chat-input-area {
    border-top: 1px solid var(--color-outline-variant);
    padding-top: var(--spacing-3);
}

.role-indicator {
    font-size: var(--font-size-xs);
    color: var(--color-on-surface-variant);
    margin-bottom: var(--spacing-2);
}

.role-indicator strong {
    color: var(--color-primary);
}

.input-form {
    display: flex;
    gap: var(--spacing-2);
}

.chat-input {
    flex: 1;
    padding: var(--spacing-2) var(--spacing-3);
    outline: none;
    border-radius: var(--border-radius-md);
    font-size: var(--font-size-sm);
}

.btn-send {
    background: var(--color-primary);
    color: var(--color-on-primary);
    border: none;
    width: 40px;
    border-radius: var(--border-radius-md);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>