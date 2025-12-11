import React from 'react';
import SessionDashboard from './components/SessionDashboard';
import { LayoutDashboard, Users, Settings, LogOut } from 'lucide-react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-gray-50 font-sans text-gray-900">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <LayoutDashboard className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">DashOne</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <NavItem active icon={<LayoutDashboard size={20} />} label="Sessions" />
          <NavItem icon={<Users size={20} />} label="Employees" />
          <NavItem icon={<Settings size={20} />} label="Settings" />
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button className="flex items-center gap-3 text-gray-600 hover:text-red-600 w-full px-4 py-3 rounded-lg hover:bg-red-50 transition">
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
           <SessionDashboard />
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
  <button 
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
      ${active 
        ? 'bg-blue-50 text-blue-700 font-medium shadow-sm' 
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default App;
