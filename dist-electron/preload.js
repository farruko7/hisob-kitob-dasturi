"use strict";
const electron = require("electron");
const api = {
  // Clients
  getClients: () => electron.ipcRenderer.invoke("get-clients"),
  addClient: (client) => electron.ipcRenderer.invoke("add-client", client),
  updateClient: (id, data) => electron.ipcRenderer.invoke("update-client", { id, data }),
  deleteClient: (id) => electron.ipcRenderer.invoke("delete-client", id),
  // Products
  getProducts: () => electron.ipcRenderer.invoke("get-products"),
  addProduct: (product) => electron.ipcRenderer.invoke("add-product", product),
  updateProduct: (id, data) => electron.ipcRenderer.invoke("update-product", { id, data }),
  deleteProduct: (id) => electron.ipcRenderer.invoke("delete-product", id),
  // Sales
  addSale: (sale) => electron.ipcRenderer.invoke("add-sale", sale),
  getSales: () => electron.ipcRenderer.invoke("get-sales"),
  deleteSale: (id) => electron.ipcRenderer.invoke("delete-sale", id),
  // Payments
  addPayment: (payment) => electron.ipcRenderer.invoke("add-payment", payment),
  getPayments: () => electron.ipcRenderer.invoke("get-payments"),
  deletePayment: (id) => electron.ipcRenderer.invoke("delete-payment", id),
  // Expenses
  addExpense: (expense) => electron.ipcRenderer.invoke("add-expense", expense),
  getExpenses: () => electron.ipcRenderer.invoke("get-expenses"),
  deleteExpense: (id) => electron.ipcRenderer.invoke("delete-expense", id),
  // ... qolgan barcha funksiyalar ...
  getDashboardData: () => electron.ipcRenderer.invoke("get-dashboard-data"),
  getSuppliers: () => electron.ipcRenderer.invoke("get-suppliers"),
  addSupplier: (supplier) => electron.ipcRenderer.invoke("add-supplier", supplier),
  addPurchase: (purchase) => electron.ipcRenderer.invoke("add-purchase", purchase),
  addSupplierPayment: (payment) => electron.ipcRenderer.invoke("add-supplier-payment", payment),
  getSupplierDebts: () => electron.ipcRenderer.invoke("get-supplier-debts"),
  getClientStatement: (clientId) => electron.ipcRenderer.invoke("get-client-statement", clientId),
  getEmployees: () => electron.ipcRenderer.invoke("get-employees"),
  addEmployee: (employee) => electron.ipcRenderer.invoke("add-employee", employee),
  addAdvance: (advance) => electron.ipcRenderer.invoke("add-advance", advance),
  getEmployeeDebts: () => electron.ipcRenderer.invoke("get-employee-debts"),
  getFinancialSummary: () => electron.ipcRenderer.invoke("get-financial-summary"),
  getTransactions: (filters) => electron.ipcRenderer.invoke("get-transactions", filters),
  getSalesReport: (filters) => electron.ipcRenderer.invoke("get-sales-report", filters),
  getTodaysFinancialSummary: () => electron.ipcRenderer.invoke("get-todays-financial-summary"),
  exportData: () => electron.ipcRenderer.invoke("export-data"),
  // Settings
  resetDatabase: () => electron.ipcRenderer.invoke("reset-database")
};
electron.contextBridge.exposeInMainWorld("api", api);
