import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import { app } from 'electron';
import * as xlsx from 'xlsx';

// Baza sxemasi
type Schema = {
  clients: { id: number; name: string; phone?: string; address?: string; initial_debt?: number }[];
  products: { id: number; name: string; price: number }[];
  sales: { id: number; client_id: number; product_id: number; quantity: number; total_price: number; sale_date: string }[];
  payments: { id: number; client_id: number; amount: number; payment_date: string }[];
  expenses: { id: number; description: string; amount: number; expense_date: string }[];
  suppliers: { id: number; name: string; type: 'qoramol' | 'qochqor' }[];
  purchases: { id: number; supplier_id: number; weight: number; price_per_kg: number; total_price: number; purchase_date: string }[];
  supplier_payments: { id: number; supplier_id: number; amount: number; payment_date: string }[];
  employees: { id: number; name: string; position: string }[];
  advances: { id: number; employee_id: number; amount: number; advance_date: string }[];
};

const defaultData: Schema = { clients: [], products: [], sales: [], payments: [], expenses: [], suppliers: [], purchases: [], supplier_payments: [], employees: [], advances: [] };

const dbPath = path.join(app.getPath('userData'), 'db.json');
const adapter = new JSONFile<Schema>(dbPath);
const db = new Low(adapter, defaultData);

export async function initializeDatabase() { await db.read(); db.data = { ...defaultData, ...db.data }; await db.write(); console.log(`✅ Ma'lumotlar bazasi muvaffaqiyatli ishga tushdi va yangilandi: ${dbPath}`); }

// Umumiy o'chirish funksiyasi
async function deleteItemById<T extends { id: number }>(tableName: keyof Schema, id: number) {
  await db.read();
  const table = (db.data[tableName] as T[]) || [];
  const initialLength = table.length;
  // @ts-ignore
  db.data[tableName] = table.filter(item => item.id !== id);
  if (((db.data[tableName] as T[]) || []).length < initialLength) {
    await db.write();
    return { success: true };
  }
  return { success: false, message: "Element topilmadi" };
}

// Clients
export async function getClients() { await db.read(); return db.data.clients || []; }
export async function addClient(client: { name: string; phone?: string; address?: string; initial_debt?: number }) { await db.read(); const newClient = { id: Date.now(), ...client, initial_debt: client.initial_debt || 0 }; (db.data.clients || []).push(newClient); await db.write(); return newClient; }
export async function updateClient(id: number, updatedData: { name: string; phone?: string; address?: string; initial_debt?: number }) { await db.read(); const client = (db.data.clients || []).find(c => c.id === id); if (client) { Object.assign(client, updatedData); await db.write(); } return client; }
export async function deleteClient(id: number) { return deleteItemById('clients', id); }

// Products
export async function getProducts() { await db.read(); return db.data.products || []; }
export async function addProduct(product: { name: string; price: number }) { await db.read(); const newProduct = { id: Date.now(), ...product }; (db.data.products || []).push(newProduct); await db.write(); return newProduct; }
export async function updateProduct(id: number, updatedData: { name: string; price: number }) { await db.read(); const item = (db.data.products || []).find(p => p.id === id); if (item) { Object.assign(item, updatedData); await db.write(); } return item; }
export async function deleteProduct(id: number) { return deleteItemById('products', id); }

// Sales
export async function getSales() { await db.read(); const sales = db.data.sales || []; const clients = db.data.clients || []; const products = db.data.products || []; const salesWithDetails = sales.map(sale => { const client = clients.find(c => c.id === sale.client_id); const product = products.find(p => p.id === sale.product_id); return { ...sale, clientName: client ? client.name : "Noma'lum Mijoz", productName: product ? product.name : "Noma'lum Mahsulot", }; }); return salesWithDetails.reverse(); }
export async function addSale(sale: { clientId: number; productId: number; quantity: number }) { await db.read(); const product = (db.data.products || []).find(p => p.id === sale.productId); if (!product) throw new Error("Mahsulot topilmadi!"); const totalPrice = product.price * sale.quantity; const newSale = { id: Date.now(), client_id: sale.clientId, product_id: sale.productId, quantity: sale.quantity, total_price: totalPrice, sale_date: new Date().toISOString(), }; (db.data.sales || []).push(newSale); await db.write(); return newSale; }
export async function deleteSale(id: number) { return deleteItemById('sales', id); }

// Payments
export async function getPayments() { await db.read(); const payments = db.data.payments || []; const clients = db.data.clients || []; const paymentsWithDetails = payments.map(payment => { const client = clients.find(c => c.id === payment.client_id); return { ...payment, clientName: client ? client.name : "Noma'lum Mijoz", }; }); return paymentsWithDetails.reverse(); }
export async function addPayment(payment: { clientId: number; amount: number }) { await db.read(); const newPayment = { id: Date.now(), client_id: payment.clientId, amount: payment.amount, payment_date: new Date().toISOString(), }; (db.data.payments || []).push(newPayment); await db.write(); return newPayment; }
export async function deletePayment(id: number) { return deleteItemById('payments', id); }

// Expenses
export async function getExpenses() { await db.read(); return (db.data.expenses || []).reverse(); }
export async function addExpense(expense: { description: string; amount: number }) { await db.read(); const newExpense = { id: Date.now(), description: expense.description, amount: expense.amount, expense_date: new Date().toISOString(), }; (db.data.expenses || []).push(newExpense); await db.write(); return newExpense; }
export async function deleteExpense(id: number) { return deleteItemById('expenses', id); }

// Suppliers
export async function getSuppliers() { await db.read(); return db.data.suppliers || []; }
export async function addSupplier(supplier: { name: string; type: 'qoramol' | 'qochqor' }) { await db.read(); const newSupplier = { id: Date.now(), ...supplier }; (db.data.suppliers || []).push(newSupplier); await db.write(); return newSupplier; }
export async function addPurchase(purchase: { supplierId: number; weight: number; price_per_kg: number; }) { await db.read(); const newPurchase = { id: Date.now(), supplier_id: purchase.supplierId, weight: purchase.weight, price_per_kg: purchase.price_per_kg, total_price: purchase.weight * purchase.price_per_kg, purchase_date: new Date().toISOString(), }; (db.data.purchases || []).push(newPurchase); await db.write(); return newPurchase; }
export async function addSupplierPayment(payment: { supplierId: number; amount: number }) { await db.read(); const newPayment = { id: Date.now(), supplier_id: payment.supplierId, amount: payment.amount, payment_date: new Date().toISOString(), }; (db.data.supplier_payments || []).push(newPayment); await db.write(); return newPayment; }
export async function getSupplierDebts() { await db.read(); const suppliers = db.data.suppliers || []; const purchases = db.data.purchases || []; const payments = db.data.supplier_payments || []; const supplierDebts = suppliers.map(supplier => { const totalPurchases = purchases.filter(p => p.supplier_id === supplier.id).reduce((sum, current) => sum + current.total_price, 0); const totalPayments = payments.filter(p => p.supplier_id === supplier.id).reduce((sum, current) => sum + current.amount, 0); const balance = totalPurchases - totalPayments; return { id: supplier.id, name: supplier.name, type: supplier.type, totalPurchases, totalPayments, balance }; }); return supplierDebts; }

// Employees
export async function getEmployees() { await db.read(); return db.data.employees || []; }
export async function addEmployee(employee: { name: string; position: string }) { await db.read(); const newEmployee = { id: Date.now(), ...employee }; (db.data.employees || []).push(newEmployee); await db.write(); return newEmployee; }
export async function addAdvance(advance: { employeeId: number; amount: number }) { await db.read(); const newAdvance = { id: Date.now(), employee_id: advance.employeeId, amount: advance.amount, advance_date: new Date().toISOString(), }; (db.data.advances || []).push(newAdvance); await db.write(); return newAdvance; }
export async function getEmployeeDebts() { await db.read(); const employees = db.data.employees || []; const advances = db.data.advances || []; const employeeDebts = employees.map(employee => { const totalAdvances = advances.filter(a => a.employee_id === employee.id).reduce((sum, current) => sum + current.amount, 0); return { id: employee.id, name: employee.name, position: employee.position, totalAdvances }; }); return employeeDebts; }

// Reports
export async function getDashboardData() { await db.read(); const clients = db.data.clients || []; const sales = db.data.sales || []; const payments = db.data.payments || []; const clientDebts = clients.map(client => { const totalSales = sales.filter(sale => sale.client_id === client.id).reduce((sum, current) => sum + current.total_price, 0); const totalPayments = payments.filter(payment => payment.client_id === client.id).reduce((sum, current) => sum + current.amount, 0); const balance = (client.initial_debt || 0) + totalSales - totalPayments; return { id: client.id, name: client.name, totalSales, totalPayments, balance }; }); return clientDebts; }
export async function getClientStatement(clientId: number) { await db.read(); const sales = db.data.sales || []; const payments = db.data.payments || []; const clientSales = sales.filter(sale => sale.client_id === clientId).map(sale => ({ date: sale.sale_date, type: 'Savdo', description: `Sotilgan mahsulot`, amount: sale.total_price, })); const clientPayments = payments.filter(payment => payment.client_id === clientId).map(payment => ({ date: payment.payment_date, type: 'To\'lov', description: 'Mijoz tomonidan to\'lov', amount: -payment.amount, })); const statement = [...clientSales, ...clientPayments].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); return statement; }
export async function getFinancialSummary() { await db.read(); const payments = db.data.payments || []; const expenses = db.data.expenses || []; const supplierPayments = db.data.supplier_payments || []; const advances = db.data.advances || []; const totalCashIn = payments.reduce((sum, p) => sum + p.amount, 0); const totalCashOut = expenses.reduce((sum, e) => sum + e.amount, 0) + supplierPayments.reduce((sum, p) => sum + p.amount, 0) + advances.reduce((sum, a) => sum + a.amount, 0); const kassa = totalCashIn - totalCashOut; return { totalCashIn, totalCashOut, kassa }; }
export async function getTransactions(filters: { startDate: string, endDate: string }) { await db.read(); const { payments, expenses, supplier_payments, advances, clients, suppliers, employees } = db.data; const allTransactions = []; (payments || []).forEach(p => { const client = (clients || []).find(c => c.id === p.client_id); allTransactions.push({ date: p.payment_date, type: 'Kirim', description: `To'lov: ${client ? client.name : 'Noma\'lum mijoz'}`, amount: p.amount, }); }); (expenses || []).forEach(e => { allTransactions.push({ date: e.expense_date, type: 'Chiqim', description: `Xarajat: ${e.description}`, amount: -e.amount, }); }); (supplier_payments || []).forEach(p => { const supplier = (suppliers || []).find(s => s.id === p.supplier_id); allTransactions.push({ date: p.payment_date, type: 'Chiqim', description: `To'lov: ${supplier ? supplier.name : 'Noma\'lum chorvachi'}`, amount: -p.amount, }); }); (advances || []).forEach(a => { const employee = (employees || []).find(e => e.id === a.employee_id); allTransactions.push({ date: a.advance_date, type: 'Chiqim', description: `Avans: ${employee ? employee.name : 'Noma\'lum xodim'}`, amount: -a.amount, }); }); const startDate = new Date(filters.startDate); const endDate = new Date(filters.endDate); endDate.setHours(23, 59, 59, 999); const filtered = allTransactions.filter(t => { const transactionDate = new Date(t.date); return transactionDate >= startDate && transactionDate <= endDate; }); return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); }
export async function getSalesReport(filters: { startDate: string, endDate: string }) { await db.read(); const sales = db.data.sales || []; const products = db.data.products || []; const startDate = new Date(filters.startDate); const endDate = new Date(filters.endDate); endDate.setHours(23, 59, 59, 999); const filteredSales = sales.filter(s => { const saleDate = new Date(s.sale_date); return saleDate >= startDate && saleDate <= endDate; }); const report: { [productId: number]: { name: string, totalQuantity: number, totalAmount: number } } = {}; filteredSales.forEach(sale => { if (!report[sale.product_id]) { const product = products.find(p => p.id === sale.product_id); report[sale.product_id] = { name: product ? product.name : 'Noma\'lum mahsulot', totalQuantity: 0, totalAmount: 0, }; } report[sale.product_id].totalQuantity += sale.quantity; report[sale.product_id].totalAmount += sale.total_price; }); return Object.values(report); }
export async function getTodaysFinancialSummary() { await db.read(); const today = new Date().toISOString().split('T')[0]; const payments = (db.data.payments || []).filter(p => p.payment_date.startsWith(today)); const expenses = (db.data.expenses || []).filter(e => e.expense_date.startsWith(today)); const supplierPayments = (db.data.supplier_payments || []).filter(p => p.payment_date.startsWith(today)); const advances = (db.data.advances || []).filter(a => a.advance_date.startsWith(today)); const todayCashIn = payments.reduce((sum, p) => sum + p.amount, 0); const todayCashOut = expenses.reduce((sum, e) => sum + e.amount, 0) + supplierPayments.reduce((sum, p) => sum + p.amount, 0) + advances.reduce((sum, a) => sum + a.amount, 0); return { todayCashIn, todayCashOut, todayKassa: todayCashIn - todayCashOut, }; }

// Excel Export
export async function exportDataToExcel() {
    await db.read();
    const data = db.data;
    const workbook = xlsx.utils.book_new();
    const clientsSheet = xlsx.utils.json_to_sheet(data.clients || []);
    xlsx.utils.book_append_sheet(workbook, clientsSheet, "Mijozlar");
    const productsSheet = xlsx.utils.json_to_sheet(data.products || []);
    xlsx.utils.book_append_sheet(workbook, productsSheet, "Mahsulotlar");
    const salesSheet = xlsx.utils.json_to_sheet(await getSales());
    xlsx.utils.book_append_sheet(workbook, salesSheet, "Savdolar");
    const paymentsSheet = xlsx.utils.json_to_sheet(await getPayments());
    xlsx.utils.book_append_sheet(workbook, paymentsSheet, "Mijoz To'lovlari");
    const expensesSheet = xlsx.utils.json_to_sheet(data.expenses || []);
    xlsx.utils.book_append_sheet(workbook, expensesSheet, "Xarajatlar");
    const suppliersSheet = xlsx.utils.json_to_sheet(data.suppliers || []);
    xlsx.utils.book_append_sheet(workbook, suppliersSheet, "Chorvachilar");
    const purchasesSheet = xlsx.utils.json_to_sheet(data.purchases || []);
    xlsx.utils.book_append_sheet(workbook, purchasesSheet, "Mol Xaridi");
    const supplierPaymentsSheet = xlsx.utils.json_to_sheet(data.supplier_payments || []);
    xlsx.utils.book_append_sheet(workbook, supplierPaymentsSheet, "Chorvachilarga To'lov");
    const employeesSheet = xlsx.utils.json_to_sheet(data.employees || []);
    xlsx.utils.book_append_sheet(workbook, employeesSheet, "Xodimlar");
    const advancesSheet = xlsx.utils.json_to_sheet(data.advances || []);
    xlsx.utils.book_append_sheet(workbook, advancesSheet, "Avanslar");
    const buffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    return buffer;
}

export default db;
