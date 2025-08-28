import React, { useEffect, useState } from 'react';

// Kerakli ma'lumot turlarini e'lon qilamiz
interface SupplierDebt {
  id: number;
  name: string;
  type: 'qoramol' | 'qochqor';
  totalPurchases: number;
  totalPayments: number;
  balance: number;
}
type SupplierType = 'qoramol' | 'qochqor';

const Suppliers = () => {
  const [supplierDebts, setSupplierDebts] = useState<SupplierDebt[]>([]);
  
  // Forma uchun state'lar
  const [newSupplierName, setNewSupplierName] = useState('');
  const [newSupplierType, setNewSupplierType] = useState<SupplierType>('qoramol');
  
  const [purchaseSupplierId, setPurchaseSupplierId] = useState('');
  const [purchaseWeight, setPurchaseWeight] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');

  const [paymentSupplierId, setPaymentSupplierId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');

  // Ma'lumotlarni bazadan yuklash
  const fetchData = async () => {
    const debtList = await window.api.getSupplierDebts();
    setSupplierDebts(debtList);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Yangi chorvachi qo'shish
  const handleAddSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupplierName) return alert("Chorvachi nomini kiriting!");
    await window.api.addSupplier({ name: newSupplierName, type: newSupplierType });
    setNewSupplierName('');
    fetchData();
  };
  
  // Yangi xarid kiritish
  const handleAddPurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!purchaseSupplierId || !purchaseWeight || !purchasePrice) return alert("Barcha maydonlarni to'ldiring!");
    await window.api.addPurchase({
      supplierId: parseInt(purchaseSupplierId),
      weight: parseFloat(purchaseWeight),
      price_per_kg: parseFloat(purchasePrice),
    });
    setPurchaseSupplierId('');
    setPurchaseWeight('');
    setPurchasePrice('');
    fetchData();
  };

  // To'lov kiritish
  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentSupplierId || !paymentAmount) return alert("Barcha maydonlarni to'ldiring!");
    await window.api.addSupplierPayment({
      supplierId: parseInt(paymentSupplierId),
      amount: parseFloat(paymentAmount),
    });
    setPaymentSupplierId('');
    setPaymentAmount('');
    fetchData();
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Chorvachilar Bilan Hisob-Kitob</h1>
      
      {/* Amallar uchun formalar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Yangi chorvachi qo'shish */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Yangi Chorvachi Qo'shish</h2>
          <form onSubmit={handleAddSupplier} className="space-y-4">
            <input type="text" placeholder="Ismi" value={newSupplierName} onChange={e => setNewSupplierName(e.target.value)} className="p-2 border rounded-md w-full" />
            <select value={newSupplierType} onChange={e => setNewSupplierType(e.target.value as SupplierType)} className="p-2 border rounded-md w-full">
              <option value="qoramol">Qoramolchi</option>
              <option value="qochqor">Qo'chqorchi</option>
            </select>
            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">Qo'shish</button>
          </form>
        </div>

        {/* Xarid kiritish */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Xarid Kiritish</h2>
          <form onSubmit={handleAddPurchase} className="space-y-4">
            <select value={purchaseSupplierId} onChange={e => setPurchaseSupplierId(e.target.value)} className="p-2 border rounded-md w-full">
              <option value="">Chorvachini tanlang</option>
              {supplierDebts.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <input type="number" placeholder="Vazni (kg)" value={purchaseWeight} onChange={e => setPurchaseWeight(e.target.value)} className="p-2 border rounded-md w-full" />
            <input type="number" placeholder="Narxi (1 kg uchun)" value={purchasePrice} onChange={e => setPurchasePrice(e.target.value)} className="p-2 border rounded-md w-full" />
            <button type="submit" className="w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-700">Xaridni Saqlash</button>
          </form>
        </div>

        {/* To'lov kiritish */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">To'lov Kiritish</h2>
          <form onSubmit={handleAddPayment} className="space-y-4">
            <select value={paymentSupplierId} onChange={e => setPaymentSupplierId(e.target.value)} className="p-2 border rounded-md w-full">
              <option value="">Chorvachini tanlang</option>
              {supplierDebts.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <input type="number" placeholder="To'lov summasi" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} className="p-2 border rounded-md w-full" />
            <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700">To'lovni Saqlash</button>
          </form>
        </div>
      </div>

      {/* Chorvachilar qarzi jadvali */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Chorvachilar Balansi</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left p-3">Nomi</th>
              <th className="text-left p-3">Turi</th>
              <th className="text-right p-3">Jami Xarid</th>
              <th className="text-right p-3">Jami To'lov</th>
              <th className="text-right p-3">Qolgan Qarzimiz</th>
            </tr>
          </thead>
          <tbody>
            {supplierDebts.map((s) => (
              <tr key={s.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{s.name}</td>
                <td className="p-3 capitalize">{s.type}</td>
                <td className="p-3 text-right text-blue-600">{s.totalPurchases.toLocaleString()} so'm</td>
                <td className="p-3 text-right text-green-600">-{s.totalPayments.toLocaleString()} so'm</td>
                <td className={`p-3 text-right font-bold ${s.balance > 0 ? 'text-red-600' : 'text-gray-800'}`}>
                  {s.balance.toLocaleString()} so'm
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Suppliers;
