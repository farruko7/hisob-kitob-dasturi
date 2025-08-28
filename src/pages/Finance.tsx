import React, { useEffect, useState } from 'react';

interface Client { id: number; name: string; }
interface Payment {
  id: number;
  amount: number;
  payment_date: string;
  clientName: string; // This will hold client name or description
}

const Finance = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  
  // State for client payment form
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');

  // State for cash sale form
  const [cashSaleDescription, setCashSaleDescription] = useState<string>('');
  const [cashSaleKg, setCashSaleKg] = useState<string>('');
  const [cashSaleAmount, setCashSaleAmount] = useState<string>('');

  const fetchData = async () => {
    const [clientList, paymentList] = await Promise.all([
      window.api.getClients(),
      window.api.getPayments(),
    ]);
    setClients(clientList);
    setPayments(paymentList);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDebtPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId || !amount) return alert("Mijozni tanlang va summani kiriting!");
    
    await window.api.addPayment({
      clientId: parseInt(selectedClientId),
      amount: parseFloat(amount),
    });
    
    setSelectedClientId('');
    setAmount('');
    fetchData();
  };

  const handleCashSaleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cashSaleDescription || !cashSaleAmount) return alert("Tavsif va summani kiriting!");

    const fullDescription = cashSaleKg
      ? `${cashSaleKg} kg ${cashSaleDescription}`
      : cashSaleDescription;

    await window.api.addPayment({
      description: fullDescription,
      amount: parseFloat(cashSaleAmount),
    });

    setCashSaleDescription('');
    setCashSaleKg('');
    setCashSaleAmount('');
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Haqiqatdan ham bu to'lovni o'chirmoqchimisiz?")) {
      await window.api.deletePayment(id);
      fetchData();
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Moliya Sahifasi</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Mijozdan to'lov qabul qilish */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Mijozdan qarz to'lovini qabul qilish</h2>
          <form onSubmit={handleDebtPaymentSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Mijoz</label>
              <select value={selectedClientId} onChange={e => setSelectedClientId(e.target.value)} className="mt-1 p-2 border rounded-md w-full h-10">
                <option value="">Mijozni tanlang</option>
                {clients.map(client => <option key={client.id} value={client.id}>{client.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Summa (so'm)</label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="mt-1 p-2 border rounded-md w-full h-10" />
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 h-10">Qarz to'lovini qabul qilish</button>
          </form>
        </div>

        {/* Naqd savdo */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Naqd savdo (begona xaridor)</h2>
          <form onSubmit={handleCashSaleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tavsif (nima sotildi)</label>
              <input 
                type="text" 
                placeholder="Masalan: lahm go'sht"
                value={cashSaleDescription} 
                onChange={e => setCashSaleDescription(e.target.value)} 
                className="mt-1 p-2 border rounded-md w-full h-10" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Miqdori (kg)</label>
                <input 
                  type="number" 
                  placeholder="2.5"
                  value={cashSaleKg} 
                  onChange={e => setCashSaleKg(e.target.value)} 
                  className="mt-1 p-2 border rounded-md w-full h-10" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Summa (so'm)</label>
                <input 
                  type="number" 
                  placeholder="212500"
                  value={cashSaleAmount} 
                  onChange={e => setCashSaleAmount(e.target.value)} 
                  className="mt-1 p-2 border rounded-md w-full h-10" 
                />
              </div>
            </div>
            <button type="submit" className="w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-700 h-10">Kirim qilish</button>
          </form>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Oxirgi Kirimlar</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left p-3">Sana</th>
              <th className="text-left p-3">Mijoz / Tavsif</th>
              <th className="text-right p-3">Summa</th>
              <th className="text-center p-3">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-b hover:bg-gray-50">
                <td className="p-3 text-sm text-gray-600">{new Date(payment.payment_date).toLocaleString('uz-UZ')}</td>
                <td className="p-3 font-medium">{payment.clientName}</td>
                <td className="p-3 text-right font-semibold text-green-600">+{payment.amount.toLocaleString()} so'm</td>
                <td className="p-3 text-center">
                  <button onClick={() => handleDelete(payment.id)} className="text-red-600 hover:underline">O'chirish</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Finance;
