import React, { useState, useEffect } from 'react';
import { ReporteBackend } from '../../types';
import { obtenerReportes, crearReporte, eliminarReporte, actualizarReporte } from '../../services/api';
import { ReporteForm } from '../organisms/ReporteForm';
import { Pencil, Trash2, Plus } from 'lucide-react';

export const ReportesPage = () => {
  const [reportes, setReportes] = useState<ReporteBackend[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [reporteAEditar, setReporteAEditar] = useState<ReporteBackend | null>(null);
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

  const handleGuardar = async (reporte: ReporteBackend) => {
    try {
      if (reporteAEditar) {
        await actualizarReporte(reporte);
        alert("Reporte actualizado con éxito!");
      } else {
        await crearReporte(reporte);
        alert("Reporte creado con éxito!");
      }
      setMostrarFormulario(false);
      setReporteAEditar(null);
      cargarDatos();
    } catch (error) {
      alert("Error al guardar en el servidor");
    }
  };

  const handleEditar = (reporte: ReporteBackend) => {
    setReporteAEditar(reporte);
    setMostrarFormulario(true);
  };

  const handleEliminar = async (id: string | number | undefined) => {
    if (!id) return;
    
    if (window.confirm("¿Estás seguro de que deseas eliminar este reporte?")) {
      try {
        await eliminarReporte(id);
        cargarDatos();
      } catch (error) {
        alert("Error al eliminar el reporte");
      }
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-pure-white tracking-tight">Gestión de Reportes</h1>
        
        {!mostrarFormulario && (
          <button 
            onClick={() => {
              setReporteAEditar(null);
              setMostrarFormulario(true);
            }}
            className="flex items-center gap-2 bg-emergency text-white font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-emergency/20 hover:bg-emergency/80 transition-all uppercase text-xs tracking-widest"
          >
            <Plus className="w-4 h-4" />
            Nuevo Reporte
          </button>
        )}
      </div>

      {mostrarFormulario && (
        <div className="mb-10">
          <ReporteForm 
            reporteInicial={reporteAEditar}
            onGuardar={handleGuardar} 
            onCancelar={() => {
              setMostrarFormulario(false);
              setReporteAEditar(null);
            }} 
          />
        </div>
      )}

      {cargando ? (
        <div className="flex items-center gap-3 text-white/50">
          <div className="w-4 h-4 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
          <p className="text-sm font-medium">Cargando reportes...</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {reportes.map((reporte) => (
            <div 
              key={reporte.id} 
              className="bg-white/[0.04] border border-white/10 p-5 rounded-2xl flex justify-between items-center group hover:bg-white/[0.06] transition-all duration-300"
            >
              {/* Información del reporte en modo oscuro */}
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-[16px] text-pure-white leading-tight">
                  {reporte.descripcion}
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black bg-emergency/20 text-emergency px-2 py-0.5 rounded-md uppercase tracking-wider">
                    {reporte.estado}
                  </span>
                  <p className="text-[12px] text-white/40 font-medium">
                    Lat: {reporte.latitud} • Lon: {reporte.longitud}
                  </p>
                </div>
              </div>

              {/* Botones de acción con estilo oscuro */}
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEditar(reporte)}
                  className="p-2.5 bg-white/5 text-white/40 hover:text-pure-white hover:bg-white/10 rounded-xl transition-all"
                  title="Editar"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleEliminar(reporte.id)}
                  className="p-2.5 bg-white/5 text-white/40 hover:text-emergency hover:bg-emergency/10 rounded-xl transition-all"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {reportes.length === 0 && !cargando && (
            <div className="text-white/20 text-center py-16 border-2 border-dashed border-white/5 rounded-3xl">
              <p className="text-sm font-medium">No hay reportes activos en el sistema</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};