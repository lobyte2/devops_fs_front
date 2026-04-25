import React, { useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { FireMap } from './components/FireMap';
import { AlertCard } from './components/AlertCard';
import { StatsPanel } from './components/StatsPanel';
import { Login } from './components/Login';
import { Alerta } from './types';
import { Search, Filter, Bell, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from './services/api';

export default function App() {
  const [darkMode, setDarkMode] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(() => {
    return localStorage.getItem('vsol_auth') === 'true';
  });
  const [userEmail, setUserEmail] = React.useState('brigada@sol.cl');
  const [alerts, setAlerts] = React.useState<Alerta[]>([]);

  // Conexión con el Microservicio de Alertas
  useEffect(() => {
    if (isAuthenticated) {
      api.getAlertas()
        .then(data => setAlerts(data))
        .catch(err => console.error("Error cargando el MS Alertas:", err));
    }
  }, [isAuthenticated]);

  const handleLogin = (email: string) => {
    localStorage.setItem('vsol_auth', 'true');
    setUserEmail(email);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('vsol_auth');
    setIsAuthenticated(false);
  };

  const handleCreateReport = () => {
    // Estructura adaptada a la entidad Alerta de Java
    const newAlert: Alerta = {
      id: `INC-${Math.floor(Math.random() * 9000) + 1000}`,
      ubicacion: 'Ubicación Manual',
      region: 'Zona Centro',
      estado: 'PENDING',
      severidad: 'MEDIUM',
      timestamp: new Date().toLocaleTimeString(),
      latitud: -33.43,
      longitud: -70.64,
      brigadistaEmail: userEmail
    };
    
    // Aquí a futuro agregarías: api.crearAlerta(newAlert)
    setAlerts([newAlert, ...alerts]);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
      <div className={`flex h-screen bg-charcoal font-sans overflow-hidden ${darkMode ? 'dark' : ''}`}>
        <Sidebar onLogout={handleLogout} />

        <main className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="h-[72px] px-8 flex items-center justify-between border-b border-white/[0.12] z-40 bg-charcoal/80 backdrop-blur-[10px] sticky top-0">
            <div className="flex flex-col">
              <h1 className="text-[18px] font-semibold text-pure-white leading-tight">Panel de Control General</h1>
              <p className="text-[12px] text-[#8E8E93] font-medium">Brigadista identificado: {userEmail}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-forest/10 border border-forest/20 rounded-full text-[12px] font-bold text-forest uppercase tracking-wider">
                <div className="w-1.5 h-1.5 rounded-full bg-forest animate-pulse" />
                Red de Sensores Online
              </div>

              <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2.5 glass rounded-xl text-white/50 hover:text-white transition-all"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <div className="w-10 h-10 rounded-full bg-white/[0.08] border border-white/[0.12] flex items-center justify-center font-bold text-sm cursor-pointer hover:bg-white/[0.12] transition-colors">
                BG
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-8 flex gap-8">
            <div className="flex-1 flex flex-col gap-8 min-w-0">
              {/* Top Stats Overview */}
              <div className="grid grid-cols-4 gap-6">
                {[
                  { label: 'Focos Activos', val: '24', sub: '+3 nuevo hoy', color: 'text-emergency' },
                  { label: 'Hectáreas Afectadas', val: '1,420', sub: 'Zona Central', color: 'text-pure-white' },
                  { label: 'Brigadas Desplegadas', val: '42', sub: '85% capacidad', color: 'text-forest' },
                  { label: 'Tiempo Resp. Prom.', val: '14m', sub: 'Reducción de 2m', color: 'text-pure-white' },
                ].map((stat, i) => (
                    <div key={i} className="stat-box glass p-4 rounded-xl relative overflow-hidden group border border-white/[0.08]">
                      <p className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-widest mb-1">{stat.label}</p>
                      <span className={`text-[18px] font-bold ${stat.color}`}>{stat.val}</span>
                      <p className="text-[10px] text-white/20 font-medium mt-0.5 truncate">{stat.sub}</p>
                    </div>
                ))}
              </div>

              {/* Map Section */}
              <div className="flex-1 min-h-[500px]">
                <FireMap alerts={alerts} />
              </div>

              {/* Bottom Charts */}
              <StatsPanel />
            </div>

            <aside className="w-[320px] flex flex-col gap-6 sticky top-0 h-full border-l border-white/[0.12] pl-8">
              <h2 className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-[1px]">Alertas Recientes</h2>

              <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence mode="popLayout" initial={false}>
                  {alerts.map((alert, i) => (
                      <AlertCard key={alert.id} alert={alert} index={i} />
                  ))}
                </AnimatePresence>
              </div>

              <button
                  onClick={handleCreateReport}
                  className="w-full py-3 rounded-xl bg-emergency/10 border border-emergency/30 text-emergency font-bold text-[13px] hover:bg-emergency hover:text-pure-white transition-all duration-300 shadow-xl shadow-emergency/5 uppercase tracking-wider"
              >
                Declarar Nueva Emergencia
              </button>
            </aside>
          </div>
        </main>

        <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
      </div>
  );
}