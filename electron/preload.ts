import { contextBridge, ipcRenderer } from 'electron';

const api = {
  // Clients
  getClients: () => ipcRenderer.invoke('get-clients'),
  addClient: (client: { name: string; phone?: string; address?: string; initial_debt?: number }) => ipcRenderer.invoke('add-client', client),
  updateClient: (id: number, data: { name: string; phone?: string; address?: string; initial_debt?: number }) => ipcRenderer.invoke('update-client', { id, data }),
  deleteClient: (id: number) => ipcRenderer.invoke('delete-client', id),

  // Products
  getProducts: () => ipcRenderer.invoke('get-products'),
  addProduct: (product: { name: string; price: number }) => ipcRenderer.invoke('add-product', product),
  updateProduct: (id: number, data: { name: string; price: number }) => ipcRenderer.invoke('update-product', { id, data }),
  deleteProduct: (id: number) => ipcRenderer.invoke('delete-product', id),

  // Sales
  addSale: (sale: { clientId: number; productId: number; quantity: number }) => ipcRenderer.invoke('add-sale', sale),
  getSales: () => ipcRenderer.invoke('get-sales'),
  deleteSale: (id: number) => ipcRenderer.invoke('delete-sale', id),

  // Payments
  addPayment: (payment: { clientId: number; amount: number }) => ipcRenderer.invoke('add-payment', payment),
  getPayments: () => ipcRenderer.invoke('get-payments'),
  deletePayment: (id: number) => ipcRenderer.invoke('delete-payment', id),

  // Expenses
  addExpense: (expense: { description: string; amount: number }) => ipcRenderer.invoke('add-expense', expense),
  getExpenses: () => ipcRenderer.invoke('get-expenses'),
  deleteExpense: (id: number) => ipcRenderer.invoke('delete-expense', id),
  
  // ... qolgan barcha funksiyalar ...
  getDashboardData: () => ipcRenderer.invoke('get-dashboard-data'),
  getSuppliers: () => ipcRenderer.invoke('get-suppliers'),
  addSupplier: (supplier: { name: string; type: 'qoramol' | 'qochqor' }) => ipcRenderer.invoke('add-supplier', supplier),
  addPurchase: (purchase: { supplierId: number; weight: number; price_per_kg: number; }) => ipcRenderer.invoke('add-purchase', purchase),
  addSupplierPayment: (payment: { supplierId: number; amount: number }) => ipcRenderer.invoke('add-supplier-payment', payment),
  getSupplierDebts: () => ipcRenderer.invoke('get-supplier-debts'),
  getClientStatement: (clientId: number) => ipcRenderer.invoke('get-client-statement', clientId),
  getEmployees: () => ipcRenderer.invoke('get-employees'),
  addEmployee: (employee: { name: string; position: string }) => ipcRenderer.invoke('add-employee', employee),
  addAdvance: (advance: { employeeId: number; amount: number }) => ipcRenderer.invoke('add-advance', advance),
  getEmployeeDebts: () => ipcRenderer.invoke('get-employee-debts'),
  getFinancialSummary: () => ipcRenderer.invoke('get-financial-summary'),
  getTransactions: (filters: { startDate: string, endDate: string }) => ipcRenderer.invoke('get-transactions', filters),
  getSalesReport: (filters: { startDate: string, endDate: string }) => ipcRenderer.invoke('get-sales-report', filters),
  getTodaysFinancialSummary: () => ipcRenderer.invoke('get-todays-financial-summary'),
  exportData: () => ipcRenderer.invoke('export-data'),

  // Settings
  resetDatabase: () => ipcRenderer.invoke('reset-database'),
};

contextBridge.exposeInMainWorld('api', api);
