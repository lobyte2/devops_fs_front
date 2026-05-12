// src/components/pages/AlertasPage.tsx
import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Alerta } from '../../types';
import { AlertTriangle, MapPin } from 'lucide-react';

export const AlertasPage = () => {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchAlertas();
  }, []);

  if (loading) {
    return <div className="flex-1 flex items-center justify-center text-white/50">Cargando alertas...</div>;
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-pure-white mb-6">Registro de Alertas (Backend)</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {alertas.map((alerta) => (
          <div key={alerta.id} className="glass p-5 rounded-xl border border-white/[0.08] hover:border-white/[0.2] transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className={`w-5 h-5 ${alerta.severidad === 'CRITICAL' || alerta.severidad === 'HIGH' ? 'text-emergency' : 'text-orange-400'}`} />
                <h3 className="font-bold text-white text-lg">{alerta.ubicacion}</h3>
              </div>
              <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider ${
                alerta.estado === 'PENDING' ? 'bg-orange-500/20 text-orange-400' : 'bg-forest/20 text-forest'
              }`}>
                {alerta.estado}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <p className="text-[13px] text-white/70 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> {alerta.region}
              </p>
              <p className="text-[13px] text-white/70">
                <strong>Severidad:</strong> <span className="text-white/90">{alerta.severidad}</span>
              </p>
              <p className="text-[13px] text-white/70">
                <strong>Brigadista:</strong> {alerta.brigadistaEmail}
              </p>
            </div>
            
            <div className="pt-4 border-t border-white/[0.08] flex justify-between items-center text-[11px] text-[#8E8E93]">
              <span>Coordenadas: {alerta.latitud}, {alerta.longitud}</span>
              <span>{new Date(alerta.timestamp).toLocaleDateString()}</span>
            </div>
          </div>
        ))}

        {alertas.length === 0 && (
          <div className="col-span-full text-center py-10 text-white/50">
            No hay alertas registradas en el sistema.
          </div>
        )}
      </div>
    </div>
  );
};