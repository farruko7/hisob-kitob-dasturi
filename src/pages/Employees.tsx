import React, { useEffect, useState } from 'react';

// Kerakli ma'lumot turlarini e'lon qilamiz
interface EmployeeDebt {
  id: number;
  name: string;
  position: string;
  totalAdvances: number;
}

const Employees = () => {
  const [employeeDebts, setEmployeeDebts] = useState<EmployeeDebt[]>([]);
  
  // Forma uchun state'lar
  const [newEmployeeName, setNewEmployeeName] = useState('');
  const [newEmployeePosition, setNewEmployeePosition] = useState('');
  
  const [advanceEmployeeId, setAdvanceEmployeeId] = useState('');
  const [advanceAmount, setAdvanceAmount] = useState('');

  // Ma'lumotlarni bazadan yuklash
  const fetchData = async () => {
    const debtList = await window.api.getEmployeeDebts();
    setEmployeeDebts(debtList);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Yangi xodim qo'shish
  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmployeeName || !newEmployeePosition) return alert("Barcha maydonlarni to'ldiring!");
    await window.api.addEmployee({ name: newEmployeeName, position: newEmployeePosition });
    setNewEmployeeName('');
    setNewEmployeePosition('');
    fetchData();
  };
  
  // Avans berish
  const handleAddAdvance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!advanceEmployeeId || !advanceAmount) return alert("Barcha maydonlarni to'ldiring!");
    await window.api.addAdvance({
      employeeId: parseInt(advanceEmployeeId),
      amount: parseFloat(advanceAmount),
    });
    setAdvanceEmployeeId('');
    setAdvanceAmount('');
    fetchData();
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Xodimlar Bilan Hisob-Kitob</h1>
      
      {/* Amallar uchun formalar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Yangi xodim qo'shish */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Yangi Xodim Qo'shish</h2>
          <form onSubmit={handleAddEmployee} className="space-y-4">
            <input type="text" placeholder="Ismi (F.I.O)" value={newEmployeeName} onChange={e => setNewEmployeeName(e.target.value)} className="p-2 border rounded-md w-full" />
            <input type="text" placeholder="Lavozimi" value={newEmployeePosition} onChange={e => setNewEmployeePosition(e.target.value)} className="p-2 border rounded-md w-full" />
            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">Qo'shish</button>
          </form>
        </div>

        {/* Avans berish */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Avans Berish</h2>
          <form onSubmit={handleAddAdvance} className="space-y-4">
            <select value={advanceEmployeeId} onChange={e => setAdvanceEmployeeId(e.target.value)} className="p-2 border rounded-md w-full">
              <option value="">Xodimni tanlang</option>
              {employeeDebts.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
            <input type="number" placeholder="Avans summasi" value={advanceAmount} onChange={e => setAdvanceAmount(e.target.value)} className="p-2 border rounded-md w-full" />
            <button type="submit" className="w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-700">Avans Berish</button>
          </form>
        </div>
      </div>

      {/* Xodimlar qarzi jadvali */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Xodimlar Balansi (Olingan Avanslar)</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left p-3">Ismi</th>
              <th className="text-left p-3">Lavozimi</th>
              <th className="text-right p-3">Jami Olingan Avans</th>
            </tr>
          </thead>
          <tbody>
            {employeeDebts.map((e) => (
              <tr key={e.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{e.name}</td>
                <td className="p-3">{e.position}</td>
                <td className={`p-3 text-right font-bold ${e.totalAdvances > 0 ? 'text-red-600' : 'text-gray-800'}`}>
                  {e.totalAdvances.toLocaleString()} so'm
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Employees;
