const STORAGE_KEY = 'support_tickets_v1';

export const ticketService = {
    getTickets() {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : MOCK_DATA;
    },

    saveTickets(tickets) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
    },

    generateHash() {
        return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    }

}   












const MOCK_DATA = [
  {
    id: '#a1b2c3', title: 'SSO outage', description: 'No one can log in.',
    customer: 'Bob', assignee: 'Alice', status: 'Open', impact: 'High', tags: ['auth', 'critical'],
    createdAt: Date.now() - 1800000, lastInteractionAt: Date.now() - 900000,
    slaDeadline: Date.now() + 7200000,
    logs: [{ sender: 'System', message: 'Ticket created.', timestamp: Date.now() - 1800000, role: 'system' }]
  },
  {
    id: '#d4e5f6', title: 'Pages loading slowly', description: 'Takes 10s to load.',
    customer: 'Demo Company', assignee: '', status: 'New', impact: 'Medium', tags: ['billing', 'performance'],
    createdAt: Date.now() - 2700000, lastInteractionAt: Date.now() - 2700000,
    slaDeadline: Date.now() - 3600000,
    logs: [{ sender: 'System', message: 'Ticket created.', timestamp: Date.now() - 2700000, role: 'system' }]
  },
  {
    id: '#g7h8i9', title: 'How to export data?', description: 'Need help finding the export button.',
    customer: 'Sue', assignee: 'Bob', status: 'Pending', impact: 'Low', tags: ['how-to'],
    createdAt: Date.now() - 3300000, lastInteractionAt: Date.now() - 900000,
    slaDeadline: Date.now() - 86400000,
    logs: [
      { sender: 'System', message: 'Ticket created.', timestamp: Date.now() - 3300000, role: 'system' },
      { sender: 'Support Agent', message: 'the button is under Settings.', timestamp: Date.now() - 1800000, role: 'agent' }
    ]
  },
  {
    id: '#j0k1l2', title: 'Demo SLA Breach', description: 'Watch this one expire.',
    customer: 'Demo User', assignee: 'You', status: 'Open', impact: 'High', tags: ['demo'],
    createdAt: Date.now() - 60000, lastInteractionAt: Date.now() - 30000,
    slaDeadline: Date.now() + 45000,
    logs: [{ sender: 'System', message: 'Ticket created.', timestamp: Date.now() - 60000, role: 'system' }]
  },
  {
  id: '#m3n4o5', title: 'Password reset resolved',
  description: 'Customer successfully reset their password',
  customer: 'Jane Doe', assignee: 'Alice', status: 'Closed', impact: 'Low',
  tags: ['auth', 'resolved'],
  createdAt: Date.now() - 2400000,
  lastInteractionAt: Date.now() - 600000,
  slaDeadline: Date.now() + 3600000,
  logs: [
    { sender: 'System', message: 'Ticket created.', timestamp: Date.now() - 2400000, role: 'system' },
    { sender: 'Support Agent', message: 'Password reset instructions sent.', timestamp: Date.now() - 1200000, role: 'agent' },
    { sender: 'Jane', message: 'Confirmed! I can log in now.', timestamp: Date.now() - 600000, role: 'customer' },
    { sender: 'System', message: 'Ticket closed.', timestamp: Date.now() - 600000, role: 'system' }
  ]
}
];
