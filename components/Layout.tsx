import React from 'react';
import { Home, Heart, History } from 'lucide-react';
import { AppTab } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  return (
    <div className="flex flex-col h-screen w-full mx-auto bg-gradient-to-br from-indigo-950 via-slate-900 to-black overflow-hidden relative shadow-2xl md:max-w-7xl md:border-x md:border-white/10">
      {/* Dynamic Background Mesh */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
      
      {/* Header */}
      <header className="flex-none p-6 pt-10 pb-4 z-10 bg-gradient-to-b from-slate-900/90 to-transparent">
        <div className="flex items-center justify-center gap-2 max-w-5xl mx-auto w-full">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <span className="text-white font-bold text-lg">P</span>
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            PromptLab
            </h1>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 z-10 pb-24 scroll-smooth">
        <div className="max-w-5xl mx-auto w-full h-full">
            {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="flex-none bg-slate-900/90 backdrop-blur-lg border-t border-white/10 pb-6 pt-2 z-20 absolute bottom-0 w-full">
        <div className="flex justify-center gap-12 md:gap-24 items-center h-14 max-w-5xl mx-auto">
          <NavButton 
            active={activeTab === AppTab.GENERATE} 
            onClick={() => onTabChange(AppTab.GENERATE)} 
            icon={Home} 
            label="Generate" 
          />
          <NavButton 
            active={activeTab === AppTab.FAVORITES} 
            onClick={() => onTabChange(AppTab.FAVORITES)} 
            icon={Heart} 
            label="Favorites" 
          />
          <NavButton 
            active={activeTab === AppTab.HISTORY} 
            onClick={() => onTabChange(AppTab.HISTORY)} 
            icon={History} 
            label="History" 
          />
        </div>
      </nav>
    </div>
  );
};

const NavButton = ({ active, onClick, icon: Icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-20 transition-all duration-300 ${
      active ? 'text-indigo-400 scale-105' : 'text-slate-500 hover:text-slate-300'
    }`}
  >
    <Icon size={24} strokeWidth={active ? 2.5 : 2} />
    <span className="text-[10px] mt-1 font-medium">{label}</span>
    {active && <span className="w-1 h-1 bg-indigo-500 rounded-full mt-1 absolute -bottom-2"></span>}
  </button>
);

export default Layout;