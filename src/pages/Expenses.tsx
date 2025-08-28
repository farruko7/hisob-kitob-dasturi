import React, { useEffect, useState } from 'react';

interface Expense {
  id: number;
  description: string;
  amount: number;
  expense_date: string;
}

const Expenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const fetchData = async () => {
    const expenseList = await window.api.getExpenses();
    setExpenses(expenseList);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return alert("Barcha maydonlarni to'ldiring!");
    
    await window.api.addExpense({
      description,
      amount: parseFloat(amount),
    });
    
    setDescription('');
    setAmount('');
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Haqiqatdan ham bu xarajatni o'chirmoqchimisiz?")) {
      await window.api.deleteExpense(id);
      fetchData();
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Xarajatlar</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Yangi xarajat kiritish</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700">Xarajat Tavsifi</label>
            <input type="text" placeholder="Masalan: Benzin, Oziq-ovqat..." value={description} onChange={e => setDescription(e.target.value)} className="mt-1 p-2 border rounded-md w-full h-10" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Summa (so'm)</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="mt-1 p-2 border rounded-md w-full h-10" />
          </div>
          <button type="submit" className="bg-orange-500 text-white p-2 rounded-md hover:bg-orange-600 h-10">Qo'shish</button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Oxirgi Xarajatlar</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left p-3">Sana</th>
              <th className="text-left p-3">Tavsifi</th>
              <th className="text-right p-3">Summa</th>
              <th className="text-center p-3">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id} className="border-b hover:bg-gray-50">
                <td className="p-3 text-sm text-gray-600">{new Date(expense.expense_date).toLocaleString('uz-UZ')}</td>
                <td className="p-3 font-medium">{expense.description}</td>
                <td className="p-3 text-right font-semibold text-red-600">-{expense.amount.toLocaleString()} so'm</td>
                <td className="p-3 text-center">
                  <button onClick={() => handleDelete(expense.id)} className="text-red-600 hover:underline">O'chirish</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Expenses;
