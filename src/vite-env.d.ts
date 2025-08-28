/// <reference types="vite/client" />

interface Window {
  api: {
    // Clients
    getClients: () => Promise<{ id: number; name: string; phone?: string; address?: string; initial_debt?: number }[]>;
    addClient: (client: { name: string; phone?: string; address?: string; initial_debt?: number }) => Promise<any>;
    updateClient: (id: number, data: { name: string; phone?: string; address?: string; initial_debt?: number }) => Promise<any>;
    deleteClient: (id: number) => Promise<{ success: boolean }>;
    
    // Products
    getProducts: () => Promise<{ id: number; name: string; price: number }[]>;
    addProduct: (product: { name: string; price: number }) => Promise<any>;
    updateProduct: (id: number, data: { name: string; price: number }) => Promise<any>;
    deleteProduct: (id: number) => Promise<{ success: boolean }>;

    // Sales
    addSale: (sale: { clientId: number; productId: number; quantity: number; } | { clientId: number; description: string; price_per_kg: number; quantity: number; }) => Promise<any>;
    getSales: () => Promise<{ id: number; quantity: number; total_price: number; sale_date: string; clientName: string; productName: string; }[]>;
    deleteSale: (id: number) => Promise<{ success: boolean }>;

    // Payments
    addPayment: (payment: { clientId: number; amount: number; }) => Promise<any>;
    getPayments: () => Promise<{ id: number; amount: number; payment_date: string; clientName: string; }[]>;
    deletePayment: (id: number) => Promise<{ success: boolean }>;

    // Expenses
    addExpense: (expense: { description: string; amount: number; }) => Promise<any>;
    getExpenses: () => Promise<{ id: number; description: string; amount: number; expense_date: string; }[]>;
    deleteExpense: (id: number) => Promise<{ success: boolean }>;

    // ... qolgan barcha funksiyalar ...
    getSuppliers: () => Promise<{ id: number; name: string; type: 'qoramol' | 'qochqor' }[]>;
    addSupplier: (supplier: { name: string; type: 'qoramol' | 'qochqor' }) => Promise<any>;
    addPurchase: (purchase: { supplierId: number; weight: number; price_per_kg: number; }) => Promise<any>;
    addSupplierPayment: (payment: { supplierId: number; amount: number; }) => Promise<any>;
    getSupplierDebts: () => Promise<{ id: number; name: string; type: 'qoramol' | 'qochqor'; totalPurchases: number; totalPayments: number; balance: number; }[]>;
    getClientStatement: (clientId: number) => Promise<{ date: string; type: 'Savdo' | 'To\'lov'; description: string; amount: number; }[]>;
    getEmployees: () => Promise<{ id: number; name: string; position: string }[]>;
    addEmployee: (employee: { name: string; position: string }) => Promise<any>;
    addAdvance: (advance: { employeeId: number; amount: number }) => Promise<any>;
    getEmployeeDebts: () => Promise<{ id: number; name: string; position: string; totalAdvances: number }[]>;
    getFinancialSummary: () => Promise<{ totalCashIn: number; totalCashOut: number; kassa: number }>;
    getTransactions: (filters: { startDate: string; endDate: string; }) => Promise<{ date: string; type: string; description: string; amount: number; }[]>;
    getSalesReport: (filters: { startDate: string; endDate: string; }) => Promise<{ name: string; totalQuantity: number; totalAmount: number; }[]>;
    getTodaysFinancialSummary: () => Promise<{ todayCashIn: number; todayCashOut: number; todayKassa: number; }>;
    exportData: (
      format: 'excel' | 'pdf' | 'word',
      period: 'daily' | 'weekly' | 'monthly'
    ) => Promise<{ success: boolean; path?: string; message?: string }>;

    // Settings
    resetDatabase: () => Promise<{ success: boolean; message?: string }>;
  };
}
