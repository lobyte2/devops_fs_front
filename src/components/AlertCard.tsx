import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { FireAlert } from '../types';
import { finalizarAlertaYCrearHistorial } from '../services/api';

interface AlertCardProps {
  alert: FireAlert;
  index: number;
  userRole?: string; // Evita el error con App.tsx
  onResolve?: (id: string | number) => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert, index, userRole, onResolve }) => {
  const [isResolving, setIsResolving] = useState(false);
  const [causa, setCausa] = useState('');
  const [hectareas, setHectareas] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFinalizar = async () => {
    if (!causa || !hectareas) {
      window.alert("Por favor, ingresa la causa y las hectáreas afectadas.");
      return;
    }
    
    setLoading(true);
    try {
      await finalizarAlertaYCrearHistorial(
        alert.id,
        alert.mensaje,
        causa,
        Number(hectareas),
        alert.fechaCreacion
      );
      
      if (onResolve) {
        onResolve(alert.id);
      }
    } catch (error) {
      console.error("Error finalizando alerta:", error);
      window.alert("Hubo un error al conectar con el backend.");
    } finally {
      setLoading(false);
    }
  };

  const formattedDate = alert.fechaCreacion 
    ? new Date(alert.fechaCreacion).toLocaleString('es-CL', { day: '2-digit', month: 'short', hour: '2-digit', minute:'2-digit' })
    : 'Sin fecha';

  return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        className="group relative p-4 rounded-2xl glass hover:bg-white/[0.12] transition-all duration-300"
      >
        <div className="flex justify-between items-start mb-3">
          <div>
            <span className="inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-bold tracking-wider uppercase mb-3 bg-emergency/20 text-emergency border-emergency/30">
              ACTIVA
            </span>
            <h3 className="text-pure-white font-semibold text-[15px] leading-tight">
              {alert.tipoAlerta}
            </h3>
            <p className="text-[13px] text-[#8E8E93] mt-1 leading-normal font-sans line-clamp-2">
              {alert.mensaje} • {formattedDate}
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-3">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emergency shadow-[0_0_8px_#FF3B30]" />
            <span className="text-[11px] font-bold text-white/30 uppercase tracking-widest">
              {alert.severidad} INTENSITY
            </span>
          </div>
          {alert.reporter && (
            <div className="flex items-center gap-1.5 opacity-40">
              <CheckCircle2 className="w-3 h-3 text-white" />
              <span className="text-[9px] text-white/50">{alert.reporter.email.split('@')[0]}</span>
            </div>
          )}
        </div>

        {/* --- ÁREA DE FINALIZACIÓN INTERACTIVA --- */}
        {userRole === 'ADMIN' && (
          isResolving ? (
            <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-3">
              <input
                type="text"
                placeholder="Causa probable..."
                value={causa}
                onChange={(e) => setCausa(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[12px] text-white focus:outline-none focus:border-white/30"
              />
              <input
                type="number"
                placeholder="Hectáreas afectadas..."
                value={hectareas}
                onChange={(e) => setHectareas(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[12px] text-white focus:outline-none focus:border-white/30"
              />
              <div className="flex gap-2 pt-1">
                <button onClick={() => setIsResolving(false)} className="flex-1 py-2 rounded-lg bg-white/5 text-[11px] text-white/70 uppercase font-bold hover:bg-white/10 transition-colors">Cancelar</button>
                <button onClick={handleFinalizar} disabled={loading} className="flex-1 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 text-[11px] uppercase font-bold transition-all">
                  {loading ? '...' : 'Confirmar'}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsResolving(true)}
              className="mt-4 w-full py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[12px] font-bold uppercase tracking-wider transition-colors shadow-lg shadow-red-600/20"
            >
              Finalizar Incidente
            </button>
          )
        )}
      </motion.div>
  );
}