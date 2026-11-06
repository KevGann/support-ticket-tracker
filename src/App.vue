<template>
  <div class="app-layout">
    <Header />
    <TicketFilters />
    
    <main class="workspace">
      <KanbanView v-if="store.viewMode === 'kanban'" />
      <ListView v-else />
    </main>

    <TicketForm v-if="showForm" @close="showForm = false" />
    <ConfirmDialog v-if="showConfirm" v-bind="confirmProps" @close="showConfirm = false" />
    <TicketDetail v-if="selectedTicket" :ticket="selectedTicket" @close="selectedTicket = null" />

  </div>
</template>

<script setup>
import { ref, provide } from 'vue';
import { useTicketStore } from './stores/ticketStore';
import Header from './components/layout/Header.vue';
import TicketFilters from './components/tickets/TicketFilters.vue';
import KanbanView from './views/KanbanView.vue';
import ListView from './views/ListView.vue';
import TicketForm from './components/tickets/TicketForm.vue';
import ConfirmDialog from './components/common/ConfirmDialog.vue';
import TicketDetail from './components/tickets/TicketDetail.vue';

const store = useTicketStore();
store.init();

const showForm = ref(false);
const showConfirm = ref(false);
const confirmProps = ref({});
const selectedTicket = ref(null);

provide('openForm', () => showForm.value = true);
provide('openConfirm', (props) => {
  confirmProps.value = props;
  showConfirm.value = true;
});
provide('openTicketDetail', (ticket) => {
  selectedTicket.value = ticket;
});

</script>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--color-background);
}
.workspace {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>