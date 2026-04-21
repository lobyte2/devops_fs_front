import React from 'react';
import { 
  Bell, 
  Map as MapIcon, 
  BarChart3, 
  Users, 
  Settings, 
  LogOut,
  Flame,
  ShieldAlert
} from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { id: 'monitoring', label: 'Monitoreo', icon: MapIcon },
  { id: 'alerts', label: 'Alertas', icon: Bell },
  { id: 'reports', label: 'Reportes', icon: BarChart3 },
  { id: 'community', label: 'Comunidad', icon: Users },
];

export function Sidebar() {
  const [activeTab, setActiveTab] = React.useState('monitoring');

  return (
    <aside className="w-[240px] h-screen bg-dark-bg border-r border-white/10 flex flex-col p-6 z-50">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-8 h-8 bg-gradient-to-br from-emergency to-forest rounded-lg flex items-center justify-center shadow-lg shadow-emergency/20">
          <Flame className="text-white w-5 h-5" />
        </div>
        <div>
          <h1 className="font-sans font-bold text-sm tracking-tight text-pure-white leading-none uppercase">
            Valle del Sol
          </h1>
          <p className="text-white/50 font-medium text-[10px] tracking-wide mt-1">
            Gestión Inteligente
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group text-sm font-medium",
              activeTab === item.id 
                ? "bg-white/[0.08] text-pure-white" 
                : "text-[#8E8E93] hover:bg-white/[0.04] hover:text-pure-white"
            )}
          >
            <item.icon className={cn(
              "w-4 h-4 transition-colors duration-200",
              activeTab === item.id ? "text-pure-white" : "text-[#8E8E93]"
            )} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/10 text-[11px] text-white/30">
        Sistema Activo v2.4
      </div>
    </aside>
  );
}
