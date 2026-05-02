import React, { useState } from 'react';
import { ReporteBackend } from '../../types';

interface ReporteFormProps {
  onGuardar: (reporte: ReporteBackend) => void;
  onCancelar: () => void;
}

export const ReporteForm: React.FC<ReporteFormProps> = ({ onGuardar, onCancelar }) => {
  const [formData, setFormData] = useState<ReporteBackend>({
    descripcion: '',
    latitud: -41.4693, // Por defecto en Puerto Montt
    longitud: -72.9423,
    urlImagen: '',
    urlVideo: '',
    estado: 'PENDIENTE',
    fechaReporte: new Date().toISOString()
  });

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
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Registrar Nuevo Reporte</h2>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción de la Emergencia</label>
          <input required type="text" name="descripcion" value={formData.descripcion} onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-red-500" placeholder="Ej: Incendio estructural..." />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Latitud</label>
          <input required type="number" step="any" name="latitud" value={formData.latitud} onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Longitud</label>
          <input required type="number" step="any" name="longitud" value={formData.longitud} onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select name="estado" value={formData.estado} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2">
            <option value="PENDIENTE">PENDIENTE</option>
            <option value="EN_PROCESO">EN PROCESO</option>
            <option value="RESUELTO">RESUELTO</option>
          </select>
        </div>

        <div className="col-span-2 flex justify-end gap-3 mt-4">
          <button type="button" onClick={onCancelar} className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
            Cancelar
          </button>
          <button type="submit" className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 font-bold">
            Guardar Reporte
          </button>
        </div>
      </form>
    </div>
  );
};