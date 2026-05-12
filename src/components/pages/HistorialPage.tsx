import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Historial } from '../../types';

export const HistorialPage = () => {
  const [historial, setHistorial] = useState<Historial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const data = await api.getHistorial();
        setHistorial(data);
      } catch (error) {
        console.error("Error al obtener el historial:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistorial();
  }, []);

  if (loading) {
    return <div className="flex-1 flex items-center justify-center text-white/50">Cargando historial desde el backend...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex flex-col mb-8">
        <h2 className="text-2xl font-bold text-pure-white">Historial de Incidentes</h2>
        <p className="text-[#8E8E93] text-sm mt-1">Registro histórico de emergencias finalizadas</p>
      </div>
      
      <div className="glass rounded-xl border border-white/[0.08] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/[0.02] border-b border-white/[0.08]">
            <tr className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-wider">
              <th className="p-4">Ubicación</th>
              <th className="p-4">Causa Probable</th>
              <th className="p-4">Fecha Inicio</th>
              <th className="p-4">Fecha Fin</th>
              <th className="p-4">Hectáreas</th>
            </tr>
          </thead>
          <tbody>
            {historial.map((item) => (
              <tr key={item.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors text-[14px]">
                <td className="p-4 font-medium text-pure-white">{item.ubicación}</td>
                <td className="p-4 text-white/70">{item.causaProbable}</td>
                <td className="p-4 text-white/70">
                  {new Date(item.fechaInicio).toLocaleDateString()}
                </td>
                <td className="p-4 text-white/70">
                  {new Date(item.fechaFin).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <span className="font-bold text-emergency bg-emergency/10 px-2 py-1 rounded-md">
                    {item.hectareasAfectadas} ha
                  </span>
                </td>
              </tr>
            ))}

            {historial.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-white/50">
                  No hay registros en el historial de incidentes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};