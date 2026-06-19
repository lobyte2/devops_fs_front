import React from 'react';
import {
  Bell,
  Map as MapIcon,
  BarChart3,
  Users,
  Settings,
  LogOut,
  Flame,
  Archive // Añadimos un icono para historial
} from 'lucide-react';
import { cn } from '../lib/utils';

// Actualizamos los items para que coincidan con tus microservicios
const navItems = [
  { id: 'monitoreo', label: 'Zonas Monitoreo', icon: MapIcon },
  { id: 'alertas', label: 'Alertas', icon: Bell },
  { id: 'reportes', label: 'Reportes', icon: BarChart3 },
  { id: 'historial', label: 'Historial', icon: Archive }, 
];

// Añadimos activeTab y onTabChange a las Props
interface SidebarProps {
    onLogout: () => void;
    activeTab: string;
    onTabChange: (tabId: string) => void;
    onSettingsClick: () => void;
}

export function Sidebar({ onLogout, activeTab, onTabChange, onSettingsClick }: SidebarProps) {
  // Leemos el rol del usuario actual desde localStorage
  const userRole = localStorage.getItem('vsol_role') || 'ADMIN';

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
          {navItems.map((item) => {
              // Si el usuario no es ADMIN y la pestaña es 'reportes', no la mostramos
              if (item.id === 'reportes' && userRole !== 'ADMIN') return null;

              return (
                  <button
                      key={item.id}
                      onClick={() => onTabChange(item.id)} // Llamamos a la función del padre
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
              );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/10 space-y-1">
          <button 
            onClick={onSettingsClick}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#8E8E93] hover:bg-white/[0.04] hover:text-pure-white transition-all group font-medium text-sm"
          >
            <Settings className="w-4 h-4 group-hover:rotate-45 transition-transform" />
            <span>Configuración</span>
          </button>
          <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#8E8E93] hover:bg-emergency/10 hover:text-emergency transition-all group font-medium text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>

        <div className="mt-6 text-[11px] text-white/30">
          Sistema Activo v2.4
        </div>
      </aside>
  );
}