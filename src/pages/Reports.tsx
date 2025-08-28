import React, { useEffect, useState } from 'react';

// Turlar
type ReportType = 'client' | 'sales';
interface Client { id: number; name: string; }
interface StatementItem { date: string; type: 'Savdo' | 'To\'lov'; description: string; amount: number; }
interface SalesReportItem { name: string; totalQuantity: number; totalAmount: number; }

const Reports = () => {
  const [reportType, setReportType] = useState<ReportType>('client');
  
  // Mijoz hisoboti uchun state'lar
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [statement, setStatement] = useState<StatementItem[]>([]);
  const [balance, setBalance] = useState<number>(0);

  // Savdolar hisoboti uchun state'lar
  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [salesReport, setSalesReport] = useState<SalesReportItem[]>([]);

  // Mijozlar ro'yxatini yuklash
  useEffect(() => {
    const fetchClients = async () => {
      const clientList = await window.api.getClients();
      setClients(clientList);
    };
    fetchClients();
  }, []);

  // Mijoz tanlanganda uning tarixini yuklash
  useEffect(() => {
    if (reportType === 'client' && selectedClientId) {
      const fetchStatement = async () => {
        const statementData = await window.api.getClientStatement(parseInt(selectedClientId));
        setStatement(statementData);
        const client = (await window.api.getClients()).find(c => c.id === parseInt(selectedClientId));
        const initialDebt = client?.initial_debt || 0;
        const totalBalance = statementData.reduce((sum, item) => sum + item.amount, initialDebt);
        setBalance(totalBalance);
      };
      fetchStatement();
    } else {
      setStatement([]);
      setBalance(0);
    }
  }, [selectedClientId, reportType]);

  // Sana o'zgarganda savdolar hisobotini yuklash
  useEffect(() => {
    if (reportType === 'sales') {
      const fetchSalesReport = async () => {
        const reportData = await window.api.getSalesReport({ startDate, endDate });
        setSalesReport(reportData);
      };
      fetchSalesReport();
    }
  }, [startDate, endDate, reportType]);

  // Hisobot ko'rinishini render qilish
  const renderReportContent = () => {
    if (reportType === 'client') {
      return (
        <>
          <select value={selectedClientId} onChange={e => setSelectedClientId(e.target.value)} className="p-2 border rounded-md w-full md:w-1/3 mb-4">
            <option value="">Mijozni tanlang...</option>
            {clients.map(client => <option key={client.id} value={client.id}>{client.name}</option>)}
          </select>
          {selectedClientId && (
            <div className="bg-white p-6 rounded-lg shadow-md mt-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Mijoz Tarixi</h2>
                <div className="text-right">
                  <p className="text-gray-500">Yakuniy Balans (Qarz)</p>
                  <p className={`text-2xl font-bold ${balance > 0 ? 'text-red-600' : 'text-green-600'}`}>{balance.toLocaleString()} so'm</p>
                </div>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3">Sana</th>
                    <th className="text-left p-3">Amal</th>
                    <th className="text-right p-3">Qarz (+)</th>
                    <th className="text-right p-3">To'lov (-)</th>
                  </tr>
                </thead>
                <tbody>
                  {statement.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-sm text-gray-600">{new Date(item.date).toLocaleString('uz-UZ')}</td>
                      <td className="p-3">{item.type}</td>
                      <td className="p-3 text-right text-red-500">
                        {item.type === 'Savdo' ? `${item.amount.toLocaleString()} so'm` : ''}
                      </td>
                      <td className="p-3 text-right text-green-600">
                        {item.type === 'To\'lov' ? `${(-item.amount).toLocaleString()} so'm` : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      );
    }

    if (reportType === 'sales') {
      return (
        <>
          <div className="flex flex-wrap items-end gap-4 mb-4 p-4 border rounded-lg bg-gray-50">
            <div>
              <label className="text-sm font-medium text-gray-700">Boshlanish sanasi</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1 p-2 border rounded-md w-full" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Tugash sanasi</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="mt-1 p-2 border rounded-md w-full" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md mt-4">
            <h2 className="text-xl font-semibold mb-4">Savdolar Hisoboti</h2>
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3">Mahsulot Nomi</th>
                  <th className="text-right p-3">Jami Miqdori (kg)</th>
                  <th className="text-right p-3">Jami Summa</th>
                </tr>
              </thead>
              <tbody>
                {salesReport.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{item.name}</td>
                    <td className="p-3 text-right">{item.totalQuantity.toLocaleString()}</td>
                    <td className="p-3 text-right font-semibold">{item.totalAmount.toLocaleString()} so'm</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      );
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Hisobotlar</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-2">Hisobot Turini Tanlang</h2>
        <div className="flex gap-4 border-b pb-4">
          <button onClick={() => setReportType('client')} className={`px-4 py-2 rounded-md font-semibold ${reportType === 'client' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>
            Mijoz Hisoboti
          </button>
          <button onClick={() => setReportType('sales')} className={`px-4 py-2 rounded-md font-semibold ${reportType === 'sales' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>
            Savdolar Hisoboti
          </button>
        </div>
        <div className="mt-4">
          {renderReportContent()}
        </div>
      </div>
    </div>
  );
};

export default Reports;
