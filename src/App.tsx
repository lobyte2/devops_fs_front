import React, { useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { FireMap } from './components/FireMap';
import { AlertCard } from './components/AlertCard';
import { StatsPanel } from './components/StatsPanel';
import { Login } from './components/Login';
import { Alerta, ZonaMonitoreo, Historial, Reporte } from './types';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from './services/api';
import { ReporteForm } from './components/organisms/ReporteForm';
import { crearReporte, obtenerReportes } from './services/api';
import { eliminarReporte } from './services/api';

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('vsol_auth') === 'true');
  const [userEmail, setUserEmail] = useState('brigada@sol.cl');
  const [activeTab, setActiveTab] = useState('alertas');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Estados para los datos de los microservicios
  const [alerts, setAlerts] = useState<Alerta[]>([]);
  const [zonas, setZonas] = useState<ZonaMonitoreo[]>([]);
  const [historial, setHistorial] = useState<Historial[]>([]);
  const [reportes, setReportes] = useState<Reporte[]>([]);

  // Efecto centralizado para cargar datos según la pestaña activa
  useEffect(() => {
    if (!isAuthenticated) return;

    if (activeTab === 'alertas') {
      api.getAlertas().then(setAlerts).catch(console.error);
    } else if (activeTab === 'monitoreo') {
      api.getZonas().then(setZonas).catch(console.error);
    } else if (activeTab === 'historial') {
      api.getHistorial().then(setHistorial).catch(console.error);
    } else if (activeTab === 'reportes') {
      api.getReportes().then(setReportes).catch(console.error);
    }
  }, [isAuthenticated, activeTab]);

  const handleLogin = (email: string) => {
    localStorage.setItem('vsol_auth', 'true');
    setUserEmail(email);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('vsol_auth');
    setIsAuthenticated(false);
  };

  // Función para renderizar el contenido según el Microservicio seleccionado
  const renderContent = () => {
    switch (activeTab) {
      case 'alertas':
        return (
          <div className="flex-1 overflow-y-auto p-8 flex gap-8">
            <div className="flex-1 flex flex-col gap-8 min-w-0">
              <div className="grid grid-cols-4 gap-6">
                {[
                  { label: 'Focos Activos', val: alerts.length.toString(), sub: 'Sincronizado con MS', color: 'text-emergency' },
                  { label: 'Hectáreas Afectadas', val: '1,420', sub: 'Zona Central', color: 'text-pure-white' },
                  { label: 'Brigadas Desplegadas', val: '42', sub: '85% capacidad', color: 'text-forest' },
                  { label: 'Tiempo Resp. Prom.', val: '14m', sub: 'Reducción de 2m', color: 'text-pure-white' },
                ].map((stat, i) => (
                  <div key={i} className="stat-box glass p-4 rounded-xl border border-white/[0.08]">
                    <p className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-widest mb-1">{stat.label}</p>
                    <span className={`text-[18px] font-bold ${stat.color}`}>{stat.val}</span>
                    <p className="text-[10px] text-white/20 font-medium mt-0.5 truncate">{stat.sub}</p>
                  </div>
                ))}
              </div>
              <div className="flex-1 min-h-[500px]"><FireMap alerts={alerts} /></div>
              <StatsPanel />
            </div>
            <aside className="w-[320px] flex flex-col gap-6 border-l border-white/[0.12] pl-8">
              <h2 className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-[1px]">Alertas Recientes</h2>
              <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                  {alerts.map((alert, i) => <AlertCard key={alert.id} alert={alert} index={i} />)}
                </AnimatePresence>
              </div>
            </aside>
          </div>
        );

      case 'monitoreo':
        return (
          <div className="p-8">
            <h2 className="text-xl font-bold text-white mb-6">MS Monitoreo: Zonas de Vigilancia</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {zonas.map(zona => (
                <div key={zona.id} className="glass p-5 rounded-2xl border border-white/10">
                  <h3 className="text-pure-white font-bold">{zona.nombreZona}</h3>
                  <p className="text-xs text-white/40 mt-1">Riesgo: <span className="text-emergency">{zona.nivelRiesgo}</span></p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${zona.brigadaActiva ? 'bg-forest/20 text-forest' : 'bg-white/5 text-white/30'}`}>
                      {zona.brigadaActiva ? 'BRIGADA ACTIVA' : 'STANDBY'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'reportes':
        return (
          <div className="p-8">
            {/* --- CABECERA CON EL TÍTULO Y EL BOTÓN --- */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">MS Reportes: Archivos Multimedia</h2>
              
              {!mostrarFormulario && (
                <button 
                  onClick={() => setMostrarFormulario(true)}
                  className="bg-emergency text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-emergency/80 transition-colors"
                >
                  + Añadir Reporte
                </button>
              )}
            </div>

            {/* --- EL FORMULARIO APARECE AQUÍ CUANDO HACES CLIC --- */}
            {mostrarFormulario && (
              <div className="mb-6">
                 <ReporteForm 
                    onGuardar={async (nuevo) => {
                      try {
                        // 1. Enviamos el nuevo reporte a la base de datos (Backend)
                        await crearReporte(nuevo);
                        
                        // 2. Volvemos a pedir todos los reportes para que la tabla se actualice
                        const reportesActualizados = await obtenerReportes();
                        setReportes(reportesActualizados); // Actualizamos el estado de la tabla
                        
                        // 3. Ocultamos el formulario
                        setMostrarFormulario(false);
                        
                      } catch (error) {
                        console.error("Error al guardar el reporte:", error);
                        alert("Hubo un problema al guardar. Revisa que el backend esté encendido.");
                      }
                    }} 
                    onCancelar={() => setMostrarFormulario(false)} 
                 />
              </div>
            )}

            {/* --- TU TABLA INTACTA --- */}
            <div className="overflow-hidden rounded-xl border border-white/10 glass">
               <table className="w-full text-left border-collapse">
                  <thead className="bg-white/5 text-[11px] uppercase font-bold text-[#8E8E93]">
                    <tr>
                      <th className="p-4">Descripción</th>
                      <th className="p-4">Estado</th>
                      <th className="p-4">Fecha</th>
                      <th className="p-4">Media</th>
                      <th className="p-4 text-right">Acciones</th> {/* NUEVA COLUMNA */}
                    </tr>
                  </thead>
                  <tbody className="text-sm text-white/70">
                    {reportes.map(r => (
                      <tr key={r.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-4">{r.descripcion}</td>
                        <td className="p-4">
                          <span className={
                            r.estado === 'PENDIENTE' ? 'text-yellow-500' : 
                            r.estado === 'EN_PROCESO' ? 'text-blue-500' : 'text-forest'
                          }>
                            {r.estado}
                          </span>
                        </td>
                        <td className="p-4 text-xs font-mono">{new Date(r.fechaReporte).toLocaleDateString()}</td>
                        <td className="p-4">🖼️</td>
                        <td className="p-4 text-right space-x-3">
                          {/* BOTÓN EDITAR (Lo conectaremos en el siguiente paso) */}
                          <button 
                            className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                            onClick={() => console.log("Editar", r.id)}
                          >
                            Editar
                          </button>
                          
                          {/* BOTÓN ELIMINAR */}
                          <button 
                            className="text-emergency hover:text-red-400 font-medium transition-colors"
                            onClick={async () => {
                              if (window.confirm("¿Estás seguro de que deseas eliminar este reporte?")) {
                                try {
                                  // 1. Mandamos a borrar a la BD
                                  await eliminarReporte(r.id!);
                                  // 2. Recargamos la tabla
                                  const actualizados = await obtenerReportes();
                                  setReportes(actualizados);
                                } catch (error) {
                                  alert("Error al eliminar el reporte");
                                }
                              }
                            }}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          </div>
        );
      default:
        return <div className="p-8 text-white/20 uppercase font-bold tracking-widest text-center mt-20">Sección en Desarrollo (MS Historial)</div>;
    }
  };

  if (!isAuthenticated) return <Login onLogin={handleLogin} />;

  return (
    <div className={`flex h-screen bg-charcoal font-sans overflow-hidden ${darkMode ? 'dark' : ''}`}>
      <Sidebar 
        onLogout={handleLogout} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-[72px] px-8 flex items-center justify-between border-b border-white/[0.12] z-40 bg-charcoal/80 backdrop-blur-[10px]">
          <div className="flex flex-col">
            <h1 className="text-[18px] font-semibold text-pure-white leading-tight">S.S.O Valle del Sol</h1>
            <p className="text-[12px] text-[#8E8E93] font-medium">Terminal de {activeTab.toUpperCase()}</p>
          </div>
          <button onClick={() => setDarkMode(!darkMode)} className="p-2.5 glass rounded-xl text-white/50 hover:text-white transition-all">
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </header>

        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1 overflow-y-auto"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px); }
      `}</style>
    </div>
  );
}