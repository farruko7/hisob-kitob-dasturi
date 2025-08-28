import { useState } from 'react';
import Sidebar from './components/SideBar';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Products from './pages/Products';
import Sales from './pages/Sales';
import Finance from './pages/Finance';
import Expenses from './pages/Expenses';
import Suppliers from './pages/Suppliers';
import Reports from './pages/Reports';
import Employees from './pages/Employees';
import Settings from './pages/Settings';

function App() {
  const [activePage, setActivePage] = useState('dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard />;
      case 'sales': return <Sales />;
      case 'finance': return <Finance />;
      case 'expenses': return <Expenses />;
      case 'suppliers': return <Suppliers />;
      case 'employees': return <Employees />;
      case 'clients': return <Clients />;
      case 'products': return <Products />;
      case 'reports': return <Reports />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex bg-gray-100">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-1 h-screen overflow-y-auto">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;