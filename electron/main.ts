import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import fs from 'fs';
import path from 'node:path';
import { 
  initializeDatabase, 
  getClients, addClient, updateClient, deleteClient,
  getProducts, addProduct, updateProduct, deleteProduct,
  addSale, getSales, deleteSale,
  addPayment, getPayments, deletePayment,
  addExpense, getExpenses, deleteExpense,
  getSuppliers, addSupplier,
  addPurchase, addSupplierPayment,
  getSupplierDebts,
  getClientStatement,
  getEmployees, addEmployee,
  addAdvance, getEmployeeDebts,
  getFinancialSummary,
  getTransactions,
  getSalesReport,
  exportDataToExcel,
  getTodaysFinancialSummary
} from './database';

process.env.DIST = path.join(__dirname, '../dist');
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public');

let win: BrowserWindow | null;
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'icon.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    width: 1200,
    height: 800,
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(process.env.DIST, 'index.html'));
  }
}

app.whenReady().then(async () => {
  await initializeDatabase();
  createWindow();
});

// Barcha so'rovlarni qayta ishlovchilar
ipcMain.handle('get-clients', async () => await getClients());
ipcMain.handle('add-client', async (event, client) => await addClient(client));
ipcMain.handle('update-client', async (event, { id, data }) => await updateClient(id, data));
ipcMain.handle('delete-client', async (event, id) => await deleteClient(id));

ipcMain.handle('get-products', async () => await getProducts());
ipcMain.handle('add-product', async (event, product) => await addProduct(product));
ipcMain.handle('update-product', async (event, { id, data }) => await updateProduct(id, data));
ipcMain.handle('delete-product', async (event, id) => await deleteProduct(id));

ipcMain.handle('add-sale', async (event, sale) => await addSale(sale));
ipcMain.handle('get-sales', async () => await getSales());
ipcMain.handle('delete-sale', async (event, id) => await deleteSale(id));

ipcMain.handle('add-payment', async (event, payment) => await addPayment(payment));
ipcMain.handle('get-payments', async () => await getPayments());
ipcMain.handle('delete-payment', async (event, id) => await deletePayment(id));

ipcMain.handle('add-expense', async (event, expense) => await addExpense(expense));
ipcMain.handle('get-expenses', async () => await getExpenses());
ipcMain.handle('delete-expense', async (event, id) => await deleteExpense(id));

ipcMain.handle('get-suppliers', async () => await getSuppliers());
ipcMain.handle('add-supplier', async (event, supplier) => await addSupplier(supplier));
ipcMain.handle('add-purchase', async (event, purchase) => await addPurchase(purchase));
ipcMain.handle('add-supplier-payment', async (event, payment) => await addSupplierPayment(payment));
ipcMain.handle('get-supplier-debts', async () => await getSupplierDebts());
ipcMain.handle('get-client-statement', async (event, clientId) => await getClientStatement(clientId));
ipcMain.handle('get-employees', async () => await getEmployees());
ipcMain.handle('add-employee', async (event, employee) => await addEmployee(employee));
ipcMain.handle('add-advance', async (event, advance) => await addAdvance(advance));
ipcMain.handle('get-employee-debts', async () => await getEmployeeDebts());
ipcMain.handle('get-financial-summary', async () => await getFinancialSummary());
ipcMain.handle('get-transactions', async (event, filters) => await getTransactions(filters));
ipcMain.handle('get-sales-report', async (event, filters) => await getSalesReport(filters));
ipcMain.handle('get-todays-financial-summary', async () => await getTodaysFinancialSummary());
ipcMain.handle('export-data', async () => {
  try {
    const buffer = await exportDataToExcel();
    const { filePath } = await dialog.showSaveDialog({
      title: 'Excel faylni saqlash',
      defaultPath: `hisobot-${new Date().toISOString().split('T')[0]}.xlsx`,
      filters: [{ name: 'Excel Files', extensions: ['xlsx'] }]
    });
    if (filePath) {
      fs.writeFileSync(filePath, buffer);
      return { success: true, path: filePath };
    }
    return { success: false, message: 'Fayl saqlanmadi' };
  } catch (error) {
    console.error(error);
    return { success: false, message: (error as Error).message };
  }
});
