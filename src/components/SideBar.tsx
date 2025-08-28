import React from 'react';
import logo from "../assets/logo.png";

const menuItems = [
  { id: 'dashboard', name: 'Asosiy sahifa' },
  { id: 'sales', name: 'Savdo' },
  { id: 'finance', name: 'Moliya' },
  { id: 'expenses', name: 'Xarajatlar' },
  { id: 'suppliers', name: 'Chorvachilar' },
  { id: 'employees', name: 'Xodimlar' },
  { id: 'clients', name: 'Mijozlar' },
  { id: 'products', name: 'Mahsulotlar' },
  { id: 'reports', name: 'Hisobotlar' },
  { id: 'settings', name: 'Sozlamalar' },
];

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}


const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <div className='text-center'>
          <img src={logo} className='w-[140px] block mx-auto' alt="logo" />
           <h2 className="text-2xl font-bold uppercase">Siroj Qassob</h2>
        </div>
       
      </div>
      <nav className="flex-1 p-2">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id} className="mb-2">
              <button
                onClick={() => setActivePage(item.id)}
                className={`w-full text-left p-3 rounded-md transition-colors duration-200 uppercase ${
                  activePage === item.id
                    ? 'bg-blue-600'
                    : 'hover:bg-gray-700'
                }`}
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;