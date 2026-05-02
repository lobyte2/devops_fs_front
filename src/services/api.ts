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

export const eliminarReporte = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/reportes/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Error al eliminar el reporte');
};

export const actualizarReporte = async (id: string, reporte: ReporteBackend): Promise<ReporteBackend> => {
  const response = await fetch(`${API_BASE_URL}/reportes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reporte),
  });
  if (!response.ok) throw new Error('Error al actualizar el reporte');
  return await response.json();
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