import React, { useEffect, useState } from 'react';
import { api, finalizarAlertaYCrearHistorial } from '../../services/api';
import { Alerta } from '../../types';
import { AlertTriangle, Clock, Tag, CheckCircle2, X } from 'lucide-react';

export const AlertasPage = () => {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);

  // Leemos el rol actual del usuario para restringir acciones
  const userRole = localStorage.getItem('vsol_role') || 'ADMIN';

  // Estados para el formulario de finalización
  const [resolvingId, setResolvingId] = useState<number | string | null>(null);
  const [causa, setCausa] = useState('');
  const [hectareas, setHectareas] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAlertas = async () => {
    try {
      const data = await api.getAlertas();
      setAlertas(data);
    } catch (error) {
      console.error("Error al obtener alertas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlertas();
  }, []);

  const handleFinalizar = async (alerta: Alerta) => {
    if (!causa || !hectareas) {
      window.alert("Por favor, ingresa la causa y las hectáreas afectadas.");
      return;
    }
    
    setActionLoading(true);
    try {
      // 1. Envía a Historial y 2. Borra de Alertas (MS-ALERTAS)
      await finalizarAlertaYCrearHistorial(
        alerta.id!,
        alerta.mensaje,
        causa,
        Number(hectareas),
        alerta.fechaCreacion
      );
      
      window.alert("¡Incidente finalizado con éxito!");
      setResolvingId(null);
      fetchAlertas(); // Recarga la lista
    } catch (error) {
      console.error("Error:", error);
      window.alert("Hubo un error al procesar la solicitud.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div className="flex-1 flex items-center justify-center text-white/50">Cargando alertas...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex flex-col mb-8">
        <h2 className="text-2xl font-bold text-pure-white">Gestión de Alertas Activas</h2>
        <p className="text-[#8E8E93] text-sm mt-1">Finaliza incidentes para moverlos al registro histórico</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {alertas.map((alerta) => (
          <div key={alerta.id} className="glass p-6 rounded-2xl border border-white/[0.08] flex flex-col justify-between min-h-[280px]">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emergency/10 rounded-xl text-emergency">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-[17px] leading-tight">{alerta.tipoAlerta}</h3>
                    <span className="text-[10px] text-white/30 uppercase font-bold tracking-widest">ID: #{alerta.id}</span>
                  </div>
                </div>
                <div className="px-2 py-1 bg-white/5 rounded text-[10px] font-bold text-white/60 uppercase border border-white/10">
                  {alerta.severidad}
                </div>
              </div>
              
              <p className="text-[14px] text-white/70 leading-relaxed mb-6">
                {alerta.mensaje}
              </p>

              <div className="flex items-center gap-2 text-[12px] text-white/40 mb-6">
                <Clock className="w-4 h-4" />
                {new Date(alerta.fechaCreacion).toLocaleString('es-CL')}
              </div>
            </div>
            
            {/* --- ÁREA DE ACCIONES (SOLO ADMIN) --- */}
            {userRole === 'ADMIN' && (
              <div className="pt-4 border-t border-white/[0.06]">
                {resolvingId === alerta.id ? (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                    <input
                      type="text"
                      placeholder="Causa del incidente..."
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-red-500/50 transition-colors"
                      onChange={(e) => setCausa(e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Hectáreas afectadas..."
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-red-500/50 transition-colors"
                      onChange={(e) => setHectareas(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleFinalizar(alerta)}
                        disabled={actionLoading}
                        className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-lg text-xs font-bold text-white uppercase transition-colors"
                      >
                        {actionLoading ? 'Procesando...' : 'Confirmar'}
                      </button>
                      <button 
                        onClick={() => setResolvingId(null)}
                        className="px-3 bg-white/5 hover:bg-white/10 rounded-lg text-white/50 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => setResolvingId(alerta.id!)}
                    className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-bold text-[12px] uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-forest" />
                    Finalizar Incidente
                  </button>
                )}
              </div>
            )}
          </div>
        ))}

        {alertas.length === 0 && (
          <div className="col-span-full py-20 glass rounded-3xl border border-dashed border-white/10 flex flex-col items-center">
            <CheckCircle2 className="w-12 h-12 text-forest/20 mb-4" />
            <p className="text-white/40 font-medium">No hay alertas activas en este momento.</p>
          </div>
        )}
      </div>
    </div>
  );
};