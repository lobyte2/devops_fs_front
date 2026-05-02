import React, { useState, useEffect } from 'react';
import { ReporteBackend } from '../../types';
import { obtenerReportes, crearReporte } from '../../services/api';
import { ReporteForm } from '../organisms/ReporteForm';

export const ReportesPage = () => {
  const [reportes, setReportes] = useState<ReporteBackend[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const data = await obtenerReportes();
      setReportes(data);
    } catch (error) {
      console.error("Error cargando reportes", error);
    } finally {
      setCargando(false);
    }
  };

  const handleGuardarNuevo = async (nuevoReporte: ReporteBackend) => {
    try {
      // 1. Mandamos el reporte al backend
      await crearReporte(nuevoReporte);
      // 2. Ocultamos el formulario
      setMostrarFormulario(false);
      // 3. Recargamos la lista para ver el nuevo reporte
      cargarDatos();
      alert("Reporte creado con éxito!");
    } catch (error) {
      alert("Error al guardar en el servidor");
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Panel de Reportes</h1>
        
        {/* EL BOTÓN MÁGICO */}
        {!mostrarFormulario && (
          <button 
            onClick={() => setMostrarFormulario(true)}
            className="bg-red-600 text-white font-bold px-4 py-2 rounded-lg shadow hover:bg-red-700 transition-colors"
          >
            + Añadir Reporte
          </button>
        )}
      </div>

      {/* Si mostrarFormulario es TRUE, dibujamos el Organismo */}
      {mostrarFormulario && (
        <ReporteForm 
          onGuardar={handleGuardarNuevo} 
          onCancelar={() => setMostrarFormulario(false)} 
        />
      )}

      {/* Lista de Reportes */}
      {cargando ? (
        <p>Cargando datos...</p>
      ) : (
        <div className="grid gap-4">
          {reportes.map((reporte) => (
            <div key={reporte.id} className="bg-white p-4 rounded-xl shadow border-l-4 border-red-500 flex justify-between">
              <div>
                <h3 className="font-bold text-lg">{reporte.descripcion}</h3>
                <p className="text-sm text-gray-500">
                  Estado: <span className="font-semibold text-orange-600">{reporte.estado}</span> | 
                  Ubicación: {reporte.latitud}, {reporte.longitud}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};