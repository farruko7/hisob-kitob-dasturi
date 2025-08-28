import React, { useEffect, useState } from 'react';

interface Client { id: number; name: string; }
interface Product { id: number; name:string; price: number; }
interface Sale {
  id: number;
  quantity: number;
  total_price: number;
  sale_date: string;
  clientName: string;
  productName: string;
}

const Sales = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  
  // Tayyor mahsulot sotish formasi uchun state'lar
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [totalPrice, setTotalPrice] = useState<number>(0);

  // Qo'lda savdo kiritish formasi uchun state'lar
  const [manualClientId, setManualClientId] = useState<string>('');
  const [manualDescription, setManualDescription] = useState<string>('');
  const [manualPricePerKg, setManualPricePerKg] = useState<string>('');
  const [manualQuantity, setManualQuantity] = useState<string>('');
  const [manualTotalPrice, setManualTotalPrice] = useState<number>(0);

  const fetchData = async () => {
    const [clientList, productList, salesList] = await Promise.all([
      window.api.getClients(),
      window.api.getProducts(),
      window.api.getSales()
    ]);
    setClients(clientList);
    setProducts(productList);
    setSales(salesList);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Tayyor mahsulot uchun umumiy summani hisoblash
  useEffect(() => {
    if (selectedProductId && quantity) {
      const product = products.find(p => p.id === parseInt(selectedProductId, 10));
      const q = parseFloat(quantity);
      if (product && !isNaN(q)) {
        setTotalPrice(product.price * q);
      } else {
        setTotalPrice(0);
      }
    } else {
      setTotalPrice(0);
    }
  }, [selectedProductId, quantity, products]);

  // Qo'lda kiritilgan savdo uchun umumiy summani hisoblash
  useEffect(() => {
    const price = parseFloat(manualPricePerKg);
    const quant = parseFloat(manualQuantity);
    if (!isNaN(price) && !isNaN(quant)) {
      setManualTotalPrice(price * quant);
    } else {
      setManualTotalPrice(0);
    }
  }, [manualPricePerKg, manualQuantity]);

  // Tayyor mahsulotni sotish
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId || !selectedProductId || !quantity) return alert("Barcha maydonlarni to'ldiring!");
    
    try {
      await window.api.addSale({
        clientId: parseInt(selectedClientId, 10),
        productId: parseInt(selectedProductId, 10),
        quantity: parseFloat(quantity),
      });
      
      setSelectedClientId('');
      setSelectedProductId('');
      setQuantity('');
      fetchData();
    } catch (error: any) {
      console.error("Savdo qo'shishda xatolik:", error);
      alert(`Xatolik: ${error.message}`);
    }
  };

  // Qo'lda kiritilgan savdoni qo'shish
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualClientId || !manualDescription || !manualPricePerKg || !manualQuantity) {
      return alert("Barcha maydonlarni to'ldiring!");
    }
    try {
      await window.api.addSale({
        clientId: parseInt(manualClientId, 10),
        description: manualDescription,
        price_per_kg: parseFloat(manualPricePerKg),
        quantity: parseFloat(manualQuantity),
      });

      setManualClientId('');
      setManualDescription('');
      setManualPricePerKg('');
      setManualQuantity('');
      fetchData();
    } catch (error: any) {
      console.error("Qo'lda savdo qo'shishda xatolik:", error);
      alert(`Xatolik: ${error.message}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Haqiqatdan ham bu savdoni o'chirmoqchimisiz?")) {
      await window.api.deleteSale(id);
      fetchData();
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Savdo Sahifasi</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Tayyor mahsulotni sotish formasi */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Tayyor mahsulotni qarzga sotish</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Mijoz</label>
              <select value={selectedClientId} onChange={e => setSelectedClientId(e.target.value)} className="mt-1 p-2 border rounded-md w-full h-10">
                <option value="">Mijozni tanlang</option>
                {clients.map(client => <option key={client.id} value={client.id}>{client.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mahsulot</label>
              <select value={selectedProductId} onChange={e => setSelectedProductId(e.target.value)} className="mt-1 p-2 border rounded-md w-full h-10">
                <option value="">Mahsulotni tanlang</option>
                {products.map(product => <option key={product.id} value={product.id}>{product.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Miqdori (kg)</label>
              <input type="number" step="0.1" value={quantity} onChange={e => setQuantity(e.target.value)} className="mt-1 p-2 border rounded-md w-full h-10" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Umumiy summa</label>
              <div className="mt-1 p-2 border rounded-md w-full bg-gray-100 h-10 flex items-center">
                {totalPrice.toLocaleString()} so'm
              </div>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 h-10">Sotish</button>
          </form>
        </div>

        {/* Qo'lda savdo kiritish formasi */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Qo'lda savdo kiritish (qarz)</h2>
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Mijoz</label>
              <select value={manualClientId} onChange={e => setManualClientId(e.target.value)} className="mt-1 p-2 border rounded-md w-full h-10">
                <option value="">Mijozni tanlang</option>
                {clients.map(client => <option key={client.id} value={client.id}>{client.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mahsulot Tavsifi</label>
              <input type="text" placeholder="Masalan: Suyakli go'sht" value={manualDescription} onChange={e => setManualDescription(e.target.value)} className="mt-1 p-2 border rounded-md w-full h-10" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Narxi (1kg)</label>
                <input type="number" placeholder="85000" value={manualPricePerKg} onChange={e => setManualPricePerKg(e.target.value)} className="mt-1 p-2 border rounded-md w-full h-10" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Miqdori (kg)</label>
                <input type="number" step="0.1" placeholder="1.5" value={manualQuantity} onChange={e => setManualQuantity(e.target.value)} className="mt-1 p-2 border rounded-md w-full h-10" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Umumiy summa</label>
              <div className="mt-1 p-2 border rounded-md w-full bg-gray-100 h-10 flex items-center">
                {manualTotalPrice.toLocaleString()} so'm
              </div>
            </div>
            <button type="submit" className="w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-700 h-10">Qarzga qo'shish</button>
          </form>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Oxirgi savdolar</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left p-3">Sana</th>
              <th className="text-left p-3">Mijoz</th>
              <th className="text-left p-3">Mahsulot</th>
              <th className="text-right p-3">Miqdori (kg)</th>
              <th className="text-right p-3">Umumiy Summa</th>
              <th className="text-center p-3">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id} className="border-b hover:bg-gray-50">
                <td className="p-3 text-sm text-gray-600">{new Date(sale.sale_date).toLocaleString('uz-UZ')}</td>
                <td className="p-3 font-medium">{sale.clientName}</td>
                <td className="p-3">{sale.productName}</td>
                <td className="p-3 text-right">{sale.quantity}</td>
                <td className="p-3 text-right font-semibold">{sale.total_price.toLocaleString()} so'm</td>
                <td className="p-3 text-center">
                  <button onClick={() => handleDelete(sale.id)} className="text-red-500 hover:text-red-700">O'chirish</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Sales;
