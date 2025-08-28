import React, { useEffect, useState } from 'react';

// Ma'lumot turlarini e'lon qilamiz
interface OverallSummary { totalCashIn: number; totalCashOut: number; kassa: number; }
interface TodaySummary { todayCashIn: number; todayCashOut: number; todayKassa: number; }
interface Transaction { date: string; type: string; description: string; amount: number; }

const Dashboard = () => {
  const [overallSummary, setOverallSummary] = useState<OverallSummary | null>(null);
  const [todaySummary, setTodaySummary] = useState<TodaySummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  // Ma'lumotlarni bazadan yuklash
  const fetchData = async () => {
    const [overallData, todayData] = await Promise.all([
      window.api.getFinancialSummary(),
      window.api.getTodaysFinancialSummary()
    ]);
    setOverallSummary(overallData);
    setTodaySummary(todayData);
  };
  
  const fetchTransactions = async () => {
    if (startDate && endDate) {
      const transactionList = await window.api.getTransactions({ startDate, endDate });
      setTransactions(transactionList);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Har 5 sekundda yangilab turadi
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [startDate, endDate]);

  const setFilterToToday = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    setStartDate(todayStr);
    setEndDate(todayStr);
  };
  
  const setFilterToThisWeek = () => { const today = new Date(); const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1) )); const lastDayOfWeek = new Date(firstDayOfWeek); lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6); setStartDate(firstDayOfWeek.toISOString().split('T')[0]); setEndDate(lastDayOfWeek.toISOString().split('T')[0]); };
  const setFilterToThisMonth = () => { const today = new Date(); const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); setStartDate(firstDayOfMonth.toISOString().split('T')[0]); setEndDate(lastDayOfMonth.toISOString().split('T')[0]); };


  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Bosh Sahifa (Umumiy Holat)</h1>

      {/* YANGILANGAN Umumiy ko'rsatkichlar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-500">Bugungi Kirim</h3>
          <p className="text-3xl font-bold mt-2 text-green-600">+{todaySummary?.todayCashIn.toLocaleString() || 0} so'm</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-500">Bugungi Chiqim</h3>
          <p className="text-3xl font-bold mt-2 text-red-600">-{todaySummary?.todayCashOut.toLocaleString() || 0} so'm</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-500">Bugungi Natija</h3>
          <p className={`text-3xl font-bold mt-2 ${todaySummary && todaySummary.todayKassa >= 0 ? 'text-gray-800' : 'text-red-600'}`}>
            {todaySummary?.todayKassa.toLocaleString() || 0} so'm
          </p>
        </div>
        <div className="bg-blue-100 border-2 border-blue-500 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-blue-800">Umumiy Kassa Qoldig'i</h3>
          <p className={`text-3xl font-bold mt-2 ${overallSummary && overallSummary.kassa >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
            {overallSummary?.kassa.toLocaleString() || 0} so'm
          </p>
        </div>
      </div>
      
      {/* Tranzaksiyalar tarixi (o'zgarishsiz) */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Kirim-Chiqim Tarixi</h2>
        <div className="flex flex-wrap items-end gap-4 mb-4 p-4 border rounded-lg bg-gray-50">
          <div>
            <label className="text-sm font-medium text-gray-700">Boshlanish sanasi</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1 p-2 border rounded-md w-full" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Tugash sanasi</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="mt-1 p-2 border rounded-md w-full" />
          </div>
          <div className="flex gap-2 pt-6">
            <button onClick={setFilterToToday} className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 text-sm font-semibold">Bugun</button>
            <button onClick={setFilterToThisWeek} className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 text-sm font-semibold">Hafta</button>
            <button onClick={setFilterToThisMonth} className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 text-sm font-semibold">Oy</button>
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left p-3">Sana</th>
              <th className="text-left p-3">Turi</th>
              <th className="text-left p-3">Tavsifi</th>
              <th className="text-right p-3">Summa</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((item, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="p-3 text-sm text-gray-600">{new Date(item.date).toLocaleString('uz-UZ')}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${ item.type === 'Kirim' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800' }`}>
                    {item.type}
                  </span>
                </td>
                <td className="p-3">{item.description}</td>
                <td className={`p-3 text-right font-semibold ${item.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {item.amount > 0 ? '+' : ''}{item.amount.toLocaleString()} so'm
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
