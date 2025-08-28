import React, { useEffect, useState } from 'react';

// Mijozning tuzilishini (tipini) e'lon qilamiz
interface Client {
  id: number;
  name: string;
  phone?: string;
  address?: string;
  initial_debt?: number;
}

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Forma uchun state'lar
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [initialDebt, setInitialDebt] = useState('');

  // Mijozlar ro'yxatini bazadan yuklash
  const fetchClients = async () => {
    const clientList = await window.api.getClients();
    setClients(clientList);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Formani tozalash
  const resetForm = () => {
    setName('');
    setPhone('');
    setAddress('');
    setInitialDebt('');
    setEditingClient(null);
  };

  // Yangi mijoz qo'shish oynasini ochish
  const handleAddNew = () => {
    resetForm();
    setIsModalOpen(true);
  };

  // Tahrirlash oynasini ochish
  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setName(client.name);
    setPhone(client.phone || '');
    setAddress(client.address || '');
    setInitialDebt(String(client.initial_debt || 0));
    setIsModalOpen(true);
  };

  // O'chirish tugmasi bosilganda
  const handleDelete = async (id: number) => {
    if (window.confirm("Haqiqatdan ham bu mijozni o'chirmoqchimisiz? Bu amalni orqaga qaytarib bo'lmaydi!")) {
      await window.api.deleteClient(id);
      fetchClients(); // Ro'yxatni yangilash
    }
  };

  // "Saqlash" tugmasi bosilganda
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return alert("Mijoz ismini kiritish majburiy!");

    const clientData = {
      name,
      phone,
      address,
      initial_debt: parseFloat(initialDebt) || 0,
    };

    if (editingClient) {
      // Tahrirlash
      await window.api.updateClient(editingClient.id, clientData);
    } else {
      // Yangi qo'shish
      await window.api.addClient(clientData);
    }
    
    fetchClients();
    setIsModalOpen(false);
    resetForm();
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Mijozlar Boshqaruvi</h1>
        <button onClick={handleAddNew} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          + Yangi Mijoz
        </button>
      </div>
      
      {/* Mijozlar ro'yxati jadvali */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left p-3">Ismi</th>
              <th className="text-left p-3">Telefon</th>
              <th className="text-left p-3">Manzil</th>
              <th className="text-right p-3">Boshlang'ich Qarz</th>
              <th className="text-center p-3">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{client.name}</td>
                <td className="p-3">{client.phone}</td>
                <td className="p-3">{client.address}</td>
                <td className="p-3 text-right">{(client.initial_debt || 0).toLocaleString()} so'm</td>
                <td className="p-3 text-center">
                  <button onClick={() => handleEdit(client)} className="text-blue-600 hover:underline mr-4">Tahrirlash</button>
                  <button onClick={() => handleDelete(client.id)} className="text-red-600 hover:underline">O'chirish</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tahrirlash/Qo'shish Modal Oynasi */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-6">{editingClient ? "Mijozni Tahrirlash" : "Yangi Mijoz Qo'shish"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Ismi (F.I.O)</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 p-2 border rounded-md w-full" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Telefon raqami</label>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 p-2 border rounded-md w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Manzili</label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1 p-2 border rounded-md w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Boshlang'ich Qarz ("Eski Qarz")</label>
                <input type="number" value={initialDebt} onChange={(e) => setInitialDebt(e.target.value)} className="mt-1 p-2 border rounded-md w-full" />
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300">
                  Bekor qilish
                </button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
