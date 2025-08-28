import React, { useEffect, useState } from 'react';

interface Product { id: number; name: string; price: number; }

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  // Modal yopilgandan so'ng inputlar blokdan chiqsin
  useEffect(() => {
    if (!isModalOpen) {
      const elements = document.querySelectorAll('input, select, textarea, button');
      elements.forEach((el) => {
        (el as HTMLInputElement | HTMLButtonElement).disabled = false;
      });
    }
  }, [isModalOpen]);

  const fetchProducts = async () => {
    const productList = await window.api.getProducts();
    setProducts(productList);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setName('');
    setPrice('');
    setEditingProduct(null);
  };

  const handleAddNew = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(String(product.price));
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Haqiqatdan ham bu mahsulotni o'chirmoqchimisiz?")) {
      await window.api.deleteProduct(id);
      fetchProducts();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return alert("Barcha maydonlarni to'ldiring!");
    
    const productData = { name, price: parseFloat(price) };

    if (editingProduct) {
      await window.api.updateProduct(editingProduct.id, productData);
    } else {
      await window.api.addProduct(productData);
    }
    
    fetchProducts();
    setIsModalOpen(false);
    resetForm();
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Mahsulotlar</h1>
        <button onClick={handleAddNew} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          + Yangi Mahsulot
        </button>
      </div>
      
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-6">{editingProduct ? "Mahsulotni Tahrirlash" : "Yangi Mahsulot Qo'shish"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Mahsulot nomi</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="mt-1 p-2 border rounded-md w-full" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Narxi (1 kg uchun)</label>
                <input 
                  type="number" 
                  value={price} 
                  onChange={(e) => setPrice(e.target.value)} 
                  className="mt-1 p-2 border rounded-md w-full" 
                  required
                />
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

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Mavjud mahsulotlar</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left p-3">Nomi</th>
              <th className="text-left p-3">Narxi</th>
              <th className="text-center p-3">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{product.name}</td>
                <td className="p-3">{product.price.toLocaleString()} so'm</td>
                <td className="p-3 text-center">
                  <button onClick={() => handleEdit(product)} className="text-blue-600 hover:underline mr-4">
                    Tahrirlash
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:underline">
                    O'chirish
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
