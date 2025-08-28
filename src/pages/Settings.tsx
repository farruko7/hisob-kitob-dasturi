import React from 'react';

const Settings = () => {

  const handleResetDatabase = async () => {
    const isConfirmed = window.confirm(
      "DIQQAT! Bu amal barcha ma'lumotlarni (mijozlar, savdolar, to'lovlar va h.k.) butunlay o'chirib tashlaydi. Bu amalni orqaga qaytarib bo'lmaydi.\n\nHaqiqatdan ham davom etmoqchimisiz?"
    );

    if (isConfirmed) {
      try {
        const result = await window.api.resetDatabase();
        if (result.success) {
          alert(result.message);
          // Dasturni qayta yuklash
          window.location.reload();
        } else {
          alert(`Xatolik: ${result.message}`);
        }
      } catch (error: any) {
        alert(`Kutilmagan xatolik yuz berdi: ${error.message}`);
      }
    }
  };

  const [period, setPeriod] = React.useState<'daily' | 'weekly' | 'monthly'>('daily');

  const handleExportData = async (format: 'excel' | 'pdf' | 'word') => {
    try {
      const result = await window.api.exportData(format, period);
      if (result.success) {
        alert(`Ma'lumotlar muvaffaqiyatli saqlandi: ${result.path}`);
      } else {
        alert(`Ma'lumotlarni saqlashda xatolik yuz berdi: ${result.message || 'Noma\'lum xato'}`);
      }
    } catch (error: any) {
      alert(`Kutilmagan xatolik yuz berdi: ${error.message}`);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Sozlamalar</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Ma'lumotlarni Boshqarish</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Ma'lumotlarni Yuklab Olish</h3>
            <p className="text-gray-600 mt-1">Ma'lumotlarni (mijozlar, savdolar, xarajatlar va h.k.) kunlik, haftalik yoki oylik kesimida yuklab olish.</p>
            <div className="mt-2 flex items-center space-x-2">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as any)}
                className="border rounded-md px-2 py-1"
              >
                <option value="daily">Kunlik</option>
                <option value="weekly">Haftalik</option>
                <option value="monthly">Oylik</option>
              </select>
              <button
                onClick={() => handleExportData('excel')}
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
              >
                Excel
              </button>
              <button
                onClick={() => handleExportData('pdf')}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                PDF
              </button>
              <button
                onClick={() => handleExportData('word')}
                className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
              >
                Word
              </button>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium text-red-600">Ma'lumotlar bazasini tozalash</h3>
            <p className="text-gray-600 mt-1">Dasturdagi barcha ma'lumotlarni o'chirib, uni dastlabki holatiga qaytarish. Bu amalni orqaga qaytarib bo'lmaydi.</p>
            <button 
              onClick={handleResetDatabase}
              className="mt-2 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
            >
              Bazani Tozalash
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;