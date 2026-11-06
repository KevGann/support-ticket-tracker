import { defineStore } from 'pinia';
import { ticketService } from '../services/ticketService';

export const useTicketStore = defineStore('tickets', {
  state: () => ({
    tickets: [],
    searchQuery: '',
    sortBy: 'sla', // 'sla' or 'impact'
    viewMode: 'kanban', // 'kanban' or 'list',
    currentRole: 'agent', // 'agent' or 'customer'

    now: Date.now(),
    clockInterval: null
  }),

  getters: {
    filteredTickets(state) {

      let filtered = state.tickets.filter(t => 
        t.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        t.customer.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        t.id.includes(state.searchQuery)
      );

      if (state.sortBy === 'impact') {
        const impactOrder = { High: 1, Medium: 2, Low: 3 };

        filtered.sort((a, b) => impactOrder[a.impact] - impactOrder[b.impact]);
      } else {
        filtered.sort((a, b) => a.slaDeadline - b.slaDeadline);
      }

      return filtered;
    },

    breachedCount(state) {
      return state.tickets.filter(t => this.getSlaStatus(t) === 'breached').length;
    },

    ticketsByStatus(state) {
      const statuses = ['New', 'Open', 'Pending', 'Resolved', 'Closed'];
      const grouped = {};

      statuses.forEach(s => grouped[s] = []);
      
      this.filteredTickets.forEach(t => {
        if (grouped[t.status]) grouped[t.status].push(t);
      });

      return grouped;
    }
  },

  actions: {
    init() {
      this.tickets = ticketService.getTickets();
      this.startClock();
    },

    startClock() {
      if (!this.clockInterval) {
        this.clockInterval = setInterval(() => {
          this.now = Date.now();
        }, 1000);
      }
    },

    saveTicketsData() {
      ticketService.saveTickets(this.tickets);
    },

    addTicket(ticketData) {

      if (ticketData.assignee) {
        ticketData.status = 'Open';
      }

      const newTicket = {
        ...ticketData,
        id: ticketService.generateHash(),
        createdAt: Date.now(),
        lastInteractionAt: Date.now(),
        slaDeadline: Date.now() + (ticketData.impact === 'High' ? 4 : ticketData.impact === 'Medium' ? 8 : 24) * 3600000,
        logs: [{ 
            sender: 'System', 
            message: 'Ticket created.', 
            timestamp: Date.now(), 
            role: 'system'
        }]
      };

      this.tickets.unshift(newTicket);
      this.saveTicketsData();
    },

    updateTicket(id, updates) {

      const index = this.tickets.findIndex(t => t.id === id);

      if (index !== -1) {

        const currentTicket = this.tickets[index];


        if (typeof updates.tags === 'string') {
            updates.tags = updates.tags.split(',').map(t => t.trim()).filter(Boolean);
        }

        if (updates.status === 'New' && updates.assignee) {
          updates.status = 'Open';
        } else if (!updates.assignee && currentTicket.status === 'Open') {

          updates.status = 'New';
        }

        this.tickets[index] = {
            ...currentTicket,
            ...updates,
            lastInteractionAt: updates.lastInteractionAt || currentTicket.lastInteractionAt
        };

        this.saveTicketsData();
      }
    },

    deleteTicket(id) {
      this.tickets = this.tickets.filter(t => t.id !== id);
      this.saveTicketsData();
    },

    addMessage(ticketId, messageText) {

        const ticket = this.tickets.find(t => t.id === ticketId);
        if (!ticket) return;
        
        const senderName = this.currentRole === 'agent' ? 'Support Agent' : ticket.customer;
        
        ticket.logs.push({
            sender: senderName,
            message: messageText,
            timestamp: Date.now(),
            role: this.currentRole
        });
        

        if (this.currentRole === 'customer') {

          if (['Pending', 'Resolved'].includes(ticket.status)) {
                ticket.status = 'Open';
            }
        } else if (this.currentRole === 'agent') {

          if (ticket.status === 'New') {
                ticket.status = 'Open';
            }
        }


        ticket.lastInteractionAt = Date.now();
        this.saveTicketsData();
    },

    getSlaStatus(ticket) {

      if (['Resolved', 'Closed'].includes(ticket.status)) return 'stopped';

      if (ticket.status === 'Pending') return 'paused';
      
      const remaining = ticket.slaDeadline - this.now;

      if (remaining <= 0) return 'breached';
      if (remaining < 3600000) return 'critical'; // < 1 hour

      return 'running';
    },

    formatTimeRemaining(ticket) {
        const remaining = ticket.slaDeadline - this.now;

        if (remaining <= 0) return 'Breached';

        const totalSeconds = Math.floor(remaining / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (hours === 0) {
            return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
        }

        return `${hours}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
    }
  }
});