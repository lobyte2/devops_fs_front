import React, { useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { FireMap } from './components/FireMap';
import { AlertCard } from './components/AlertCard';
import { StatsPanel } from './components/StatsPanel';
import { Login } from './components/Login';
import { Search, Filter, Bell, Moon, Sun, ShieldCheck, MapPin, AlertTriangle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ReportesPage } from './components/pages/ReportesPage';
import { AlertasPage } from './components/pages/AlertasPage';
import { HistorialPage } from './components/pages/HistorialPage';
import { FireAlert, UserRole } from './types';
import { api } from './services/api';
import { cn } from './lib/utils';

const mockAlerts: FireAlert[] = [
  {
    id: 'INC-0824',
    tipoAlerta: 'Incendio Forestal',
    mensaje: 'Cerro La Campana - Valparaíso',
    severidad: 'HIGH',
    fechaCreacion: new Date().toISOString(),
    coordinates: [-71.12, -32.95],
    reporter: { email: 'b.guerrero@brigada.cl', deviceId: 'IPH-9422', timestamp: '14:12' }
  },
  {
    id: 'INC-0841',
    tipoAlerta: 'Foco de Calor',
    mensaje: 'Cajón del Maipo - Metropolitana',
    severidad: 'CRITICAL',
    fechaCreacion: new Date().toISOString(),
    coordinates: [-70.35, -33.65],
    reporter: { email: 'm.flores@emergencias.cl', deviceId: 'AND-2210', timestamp: '14:19' }
  }
];

export default function App() {
  const [darkMode, setDarkMode] = React.useState(() => {
    const saved = localStorage.getItem('vsol_dark_mode');
    return saved !== null ? saved === 'true' : true;
  });

  useEffect(() => {
    localStorage.setItem('vsol_dark_mode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  const [isAuthenticated, setIsAuthenticated] = React.useState(() => {
    return localStorage.getItem('vsol_auth') === 'true';
  });
  const [userRole, setUserRole] = React.useState<UserRole>(() => {
    return (localStorage.getItem('vsol_role') as UserRole) || 'ADMIN';
  });
  const [userEmail, setUserEmail] = React.useState(() => {
    return localStorage.getItem('vsol_remembered_email') || 'brigada@sol.cl';
  });
  
  const [alerts, setAlerts] = React.useState<FireAlert[]>(mockAlerts);
  const [activeTab, setActiveTab] = React.useState('monitoreo');
  const [showSettingsModal, setShowSettingsModal] = React.useState(false);
  const [showUserModal, setShowUserModal] = React.useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const cargarAlertasReales = async () => {
        try {
          const data = await api.getAlertas();
          if (data && data.length > 0) {
            const alertasReales: FireAlert[] = data.map(a => ({
              id: a.id || Math.random(),
              tipoAlerta: a.tipoAlerta,
              mensaje: a.mensaje,
              severidad: a.severidad,
              fechaCreacion: a.fechaCreacion,
              coordinates: [-70.64, -33.43] 
            }));
            setAlerts(alertasReales);
          }
        } catch (error) {
          console.error("No se pudieron cargar las alertas del backend:", error);
        }
      };
      cargarAlertasReales();
    }
  }, [isAuthenticated]);

  const handleLogin = (email: string, role: UserRole) => {
    localStorage.setItem('vsol_auth', 'true');
    localStorage.setItem('vsol_role', role);
    setUserEmail(email);
    setUserRole(role);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('vsol_auth');
    localStorage.removeItem('vsol_role');
    setIsAuthenticated(false);
  };

  const handleCreateReport = () => {
    const newAlert: FireAlert = {
      id: `INC-${Math.floor(Math.random() * 9000) + 1000}`,
      tipoAlerta: 'Reporte Manual',
      mensaje: 'Ubicación Manual - Zona Centro',
      severidad: 'MEDIUM',
      fechaCreacion: new Date().toISOString(),
      coordinates: [-70.64, -33.43],
      reporter: {
        email: userEmail,
        deviceId: 'AUTH-SEC-4421',
        timestamp: new Date().toLocaleTimeString()
      }
    };
    setAlerts([newAlert, ...alerts]);
  };

  const handleAlertaResuelta = (idResuelta: string | number) => {
    setAlerts((prevAlerts) => prevAlerts.filter(a => a.id !== idResuelta));
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
      <div className="flex h-screen bg-charcoal font-sans overflow-hidden">
        <Sidebar 
            onLogout={handleLogout} 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
            onSettingsClick={() => setShowSettingsModal(true)}
        />

        <main className="flex-1 flex flex-col min-w-0">
          <header className="h-[72px] px-8 flex items-center justify-between border-b border-white/[0.12] z-40 bg-charcoal/80 backdrop-blur-[10px] sticky top-0">
            <div className="flex flex-col">
              <h1 className="text-[18px] font-semibold text-pure-white leading-tight">
                {userRole === 'ADMIN' ? 'Panel de Control General' : 'Portal Comunitario Valle del Sol'}
              </h1>
              <p className="text-[12px] text-[#8E8E93] font-medium">
                {userRole === 'ADMIN' ? `Brigadista: ${userEmail}` : `Bienvenido, ${userEmail.split('@')[0]}`}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {userRole === 'ADMIN' && (
                  <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-forest/10 border border-forest/20 rounded-full text-[12px] font-bold text-forest uppercase tracking-wider">
                    <div className="w-1.5 h-1.5 rounded-full bg-forest animate-pulse" />
                    Red de Sensores Online
                  </div>
              )}

              <div className="relative">
                <div 
                  onClick={() => setShowUserModal(!showUserModal)}
                  className="w-10 h-10 rounded-full bg-white/[0.08] border border-white/[0.12] flex items-center justify-center font-bold text-sm cursor-pointer hover:bg-white/[0.12] transition-colors uppercase"
                >
                  {userEmail[0]}
                </div>

                {showUserModal && (
                  <div className="absolute top-12 right-0 bg-dark-bg border border-white/10 rounded-xl p-4 shadow-2xl z-[9999] min-w-[250px]">
                    <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                      <h3 className="text-pure-white font-bold text-sm">Perfil de Usuario</h3>
                      <button onClick={() => setShowUserModal(false)} className="text-white/50 hover:text-white">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] text-white/50 uppercase font-bold tracking-wider">Email</p>
                        <p className="text-sm text-pure-white">{userEmail}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/50 uppercase font-bold tracking-wider">Rol</p>
                        <p className="text-sm text-pure-white">{userRole}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/50 uppercase font-bold tracking-wider">Estado</p>
                        <p className="text-sm text-forest font-bold">Activo</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {showSettingsModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center">
              <div className="bg-dark-bg border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                  <h2 className="text-pure-white font-bold text-lg">Configuración del Sistema</h2>
                  <button onClick={() => setShowSettingsModal(false)} className="text-white/50 hover:text-white p-1 rounded-lg hover:bg-white/10">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-pure-white mb-4">Apariencia</h3>
                    <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                      <div>
                        <p className="text-sm text-pure-white font-medium">Tema de la aplicación</p>
                        <p className="text-xs text-white/50">Cambia entre modo claro y oscuro</p>
                      </div>
                      <button
                        onClick={() => setDarkMode(!darkMode)}
                        className={cn(
                          "relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none border border-white/10",
                          !darkMode ? "bg-amber-400" : "bg-white/10"
                        )}
                      >
                        <span
                          className={cn(
                            "inline-block h-5 w-5 transform rounded-full bg-white transition-transform flex items-center justify-center shadow-md",
                            !darkMode ? "translate-x-6" : "translate-x-1"
                          )}
                        >
                          {!darkMode ? <Sun className="w-3 h-3 text-amber-600" /> : <Moon className="w-3 h-3 text-black" />}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-8 flex gap-8">
            {activeTab === 'monitoreo' && (
              <>
                <div className="flex-1 flex flex-col gap-8 min-w-0">
                  {userRole === 'USER' && (
                    <div className="bg-emergency/10 border border-emergency/20 p-5 rounded-2xl flex items-start gap-4">
                      <div className="w-10 h-10 bg-emergency/20 rounded-xl flex items-center justify-center shrink-0">
                        <AlertTriangle className="text-emergency w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-emergency uppercase tracking-wider mb-1">Estado de Alerta: Activo</h3>
                        <p className="text-[13px] text-white/70 leading-relaxed">
                          Se han detectado focos cercanos a tu zona. Recomendamos mantener las vías de evacuación despejadas y seguir las instrucciones de los brigadistas en terreno.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-4 gap-6">
                    {userRole === 'ADMIN' ? (
                      [
                        { label: 'Focos Activos', val: alerts.length.toString(), sub: 'Detectados', color: 'text-emergency' },
                        { label: 'Hectáreas Afectadas', val: '1,420', sub: 'Zona Central', color: 'text-pure-white' },
                        { label: 'Brigadas Desplegadas', val: '42', sub: '85% capacidad', color: 'text-forest' },
                        { label: 'Tiempo Resp. Prom.', val: '14m', sub: 'Reducción de 2m', color: 'text-pure-white' },
                      ].map((stat, i) => (
                        <div key={i} className="stat-box glass p-4 rounded-xl relative overflow-hidden group border border-white/[0.08]">
                          <p className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-widest mb-1">{stat.label}</p>
                          <span className={`text-[18px] font-bold ${stat.color}`}>{stat.val}</span>
                          <p className="text-[10px] text-white/20 font-medium mt-0.5 truncate">{stat.sub}</p>
                        </div>
                      ))
                    ) : (
                      [
                        { label: 'Tu Zona', val: 'Segura', sub: 'Cajón del Maipo', color: 'text-forest', Icon: MapPin },
                        { label: 'Calidad Aire', val: 'Media', sub: '65 AQI - Moderado', color: 'text-white', Icon: ShieldCheck },
                        { label: 'Alertas Vecinales', val: '2', sub: 'Reportadas cerca', color: 'text-emergency', Icon: AlertTriangle },
                        { label: 'Centros Acopio', val: '3', sub: 'Operativos ahora', color: 'text-pure-white', Icon: Info },
                      ].map((stat, i) => (
                        <div key={i} className="stat-box glass p-4 rounded-xl border border-white/[0.08] flex items-center gap-4">
                          <div className={cn("w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0", stat.color.replace('text-', 'bg-').replace('/10', '/20'))}>
                            <stat.Icon className={cn("w-5 h-5", stat.color)} />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-widest">{stat.label}</p>
                            <span className={cn("text-[15px] font-bold block", stat.color)}>{stat.val}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="flex-1 min-h-[500px]">
                    {/* FireMap ahora es independiente y no recibe la prop alerts */}
                    <FireMap darkMode={darkMode} />
                  </div>

                  {userRole === 'ADMIN' && <StatsPanel />}
                </div>

                <aside className="w-[320px] flex flex-col gap-6 sticky top-0 h-full border-l border-white/[0.12] pl-8">
                  <h2 className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-[1px]">Alertas Recientes</h2>
                  <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                    <AnimatePresence mode="popLayout" initial={false}>
                      {alerts.map((alert, i) => (
                        <AlertCard
                          key={alert.id}
                          alert={alert}
                          index={i}
                          userRole={userRole}
                          onResolve={handleAlertaResuelta}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                  {userRole === 'ADMIN' && (
                    <button
                      onClick={handleCreateReport}
                      className="w-full py-3 rounded-xl bg-emergency/10 border border-emergency/30 text-emergency font-bold text-[13px] hover:bg-emergency hover:text-pure-white transition-all duration-300 shadow-xl shadow-emergency/5 uppercase tracking-wider"
                    >
                      Declarar Nueva Emergencia
                    </button>
                  )}
                </aside>
              </>
            )}

            {activeTab === 'reportes' && (
              <div className="flex-1 overflow-y-auto">
                <ReportesPage />
              </div>
            )}

            {activeTab === 'alertas' && (
              <div className="flex-1 overflow-y-auto">
                <AlertasPage />
              </div>
            )}

            {activeTab === 'historial' && (
              <div className="flex-1 overflow-y-auto">
                <HistorialPage />
              </div>
            )}
          </div>
        </main>

        <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
      `}</style>
      </div>
  );
}