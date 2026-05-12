import { Alerta, Usuario, ZonaMonitoreo, Historial, Reporte } from '../types';
import { ReporteBackend } from '../types';

const API_BASE_URL = 'http://localhost:9090'; 

// Función para obtener la lista
export const obtenerReportes = async (): Promise<ReporteBackend[]> => {
  const response = await fetch(`${API_BASE_URL}/reportes`);
  if (!response.ok) throw new Error('Error al obtener reportes');
  return await response.json();
};

// NUEVA Función para CREAR un reporte
export const crearReporte = async (nuevoReporte: ReporteBackend): Promise<ReporteBackend> => {
  const response = await fetch(`${API_BASE_URL}/reportes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(nuevoReporte),
  });
  
  if (!response.ok) throw new Error('Error al crear el reporte');
  return await response.json();
};

// MODIFICADO: Acepta number o string para evitar errores de tipado
export const eliminarReporte = async (id: number | string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/reportes/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Error al eliminar el reporte');
};

// MODIFICADO: Recibe el reporte completo y extrae el ID directamente
export const actualizarReporte = async (reporte: ReporteBackend): Promise<ReporteBackend> => {
  const response = await fetch(`${API_BASE_URL}/reportes/${reporte.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reporte),
  });
  if (!response.ok) throw new Error('Error al actualizar el reporte');
  return await response.json();
};

// NUEVA FUNCIÓN: Finaliza la alerta y crea el historial automáticamente
export const finalizarAlertaYCrearHistorial = async (
  alertaId: string | number, 
  ubicacion: string, 
  causa: string, 
  hectareas: number,
  fechaInicioIncidente: string
): Promise<void> => {
  // 1. Preparamos el objeto para MS-HISTORIAL
  const nuevoHistorial = {
    ubicación: ubicacion,
    causaProbable: causa,
    fechaInicio: new Date(fechaInicioIncidente).toISOString(),
    fechaFin: new Date().toISOString(), // Fecha actual como fin del incidente
    hectareasAfectadas: hectareas
  };

  // 2. Enviamos el POST automático al microservicio de Historial
  const respuestaHistorial = await fetch(`${API_BASE_URL}/historial`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nuevoHistorial),
  });

  if (!respuestaHistorial.ok) throw new Error('Error al generar el historial automático');

  // 3. Eliminamos la alerta de MS-ALERTAS (ya que fue resuelta)
  try {
    await fetch(`${API_BASE_URL}/alertas/${alertaId}`, { 
      method: 'DELETE' 
    });
  } catch (error) {
    console.warn("La alerta solo existía en el mock frontend o falló el borrado", error);
  }
};

export const api = {
  // --- USUARIOS ---
  login: async (email: string, password: string): Promise<Usuario> => {
    const response = await fetch(`${API_BASE_URL}/usuarios/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error('Credenciales inválidas');
    return response.json();
  },

  // --- ALERTAS ---
  getAlertas: async (): Promise<Alerta[]> => {
    const response = await fetch(`${API_BASE_URL}/alertas`);
    if (!response.ok) throw new Error('Error al obtener alertas');
    return response.json();
  },

  // --- MONITOREO ---
  getZonas: async (): Promise<ZonaMonitoreo[]> => {
    const response = await fetch(`${API_BASE_URL}/monitoreo`);
    if (!response.ok) throw new Error('Error al obtener zonas de monitoreo');
    return response.json();
  },

  // --- HISTORIAL ---
  getHistorial: async (): Promise<Historial[]> => {
    const response = await fetch(`${API_BASE_URL}/historial`);
    if (!response.ok) throw new Error('Error al obtener historial');
    return response.json();
  },

  // --- REPORTES ---
  getReportes: async (): Promise<Reporte[]> => {
    const response = await fetch(`${API_BASE_URL}/reportes`);
    if (!response.ok) throw new Error('Error al obtener reportes');
    return response.json();
  }
};