import React, { useState, useEffect } from 'react';
import { ReporteBackend } from '../../types';

interface ReporteFormProps {
  reporteInicial?: ReporteBackend | null; // NUEVO: puede recibir un reporte para editar
  onGuardar: (reporte: ReporteBackend) => void;
  onCancelar: () => void;
}

export const ReporteForm: React.FC<ReporteFormProps> = ({ reporteInicial, onGuardar, onCancelar }) => {
  // Inicializamos con el reporte a editar, o con valores vacíos si es nuevo
  const [formData, setFormData] = useState<ReporteBackend>(
    reporteInicial || {
      descripcion: '',
      latitud: -41.4693,
      longitud: -72.9423,
      urlImagen: '',
      urlVideo: '',
      estado: 'PENDIENTE',
      fechaReporte: new Date().toISOString()
    }
  );

  // Si cambia el reporteInicial (porque hicimos clic en otro), actualizamos el formulario
  useEffect(() => {
    if (reporteInicial) {
      setFormData(reporteInicial);
    }
  }, [reporteInicial]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGuardar(formData);
  };

  return (
    <div className="bg-[#1A1C1E] p-6 rounded-xl border border-white/10 shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">
        {reporteInicial ? 'Editar Reporte' : 'Registrar Nuevo Reporte'} {/* Título dinámico */}
      </h2>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-white/70 mb-1">Descripción de la Emergencia</label>
          <input 
            required 
            type="text" 
            name="descripcion" 
            value={formData.descripcion} 
            onChange={handleChange}
            placeholder="Ej: Incendio estructural..."
            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white placeholder-white/30 focus:ring-2 focus:ring-emergency focus:border-transparent outline-none transition-all" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">Latitud</label>
          <input 
            required 
            type="number" 
            step="any" 
            name="latitud" 
            value={formData.latitud} 
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white focus:ring-2 focus:ring-emergency focus:border-transparent outline-none transition-all" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">Longitud</label>
          <input 
            required 
            type="number" 
            step="any" 
            name="longitud" 
            value={formData.longitud} 
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white focus:ring-2 focus:ring-emergency focus:border-transparent outline-none transition-all" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">Estado</label>
          <select 
            name="estado" 
            value={formData.estado} 
            onChange={handleChange} 
            className="w-full bg-[#1A1C1E] border border-white/10 rounded-lg p-2 text-white focus:ring-2 focus:ring-emergency focus:border-transparent outline-none transition-all"
          >
            <option value="PENDIENTE">PENDIENTE</option>
            <option value="EN_PROCESO">EN PROCESO</option>
            <option value="RESUELTO">RESUELTO</option>
          </select>
        </div>

        <div className="col-span-2 flex justify-end gap-3 mt-4 pt-4 border-t border-white/10">
          <button 
            type="button" 
            onClick={onCancelar} 
            className="px-4 py-2 text-white/70 bg-white/5 rounded-lg hover:bg-white/10 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="px-4 py-2 text-white bg-emergency rounded-lg hover:bg-emergency/80 font-bold transition-colors"
          >
            Guardar Reporte
          </button>
        </div>
      </form>
    </div>
  );
};