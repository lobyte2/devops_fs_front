import { Alerta, Usuario, ZonaMonitoreo, Historial, Reporte, ReporteBackend } from '../types';

const API_BASE_URL = 'http://localhost:9090'; 

// Función auxiliar para obtener las cabeceras incluyendo la forma de enviar el token (Bearer)
const getAuthHeaders = () => {
  const token = localStorage.getItem('vsol_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}) // FORMATO PORTADOR (BEARER)
  };
};

// --- REPORTES ---
export const obtenerReportes = async (): Promise<ReporteBackend[]> => {
  const response = await fetch(`${API_BASE_URL}/reportes`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error('Error al obtener reportes');
  return await response.json();
};

export const crearReporte = async (nuevoReporte: ReporteBackend): Promise<ReporteBackend> => {
  const response = await fetch(`${API_BASE_URL}/reportes`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(nuevoReporte),
  });
  if (!response.ok) throw new Error('Error al crear el reporte');
  return await response.json();
};

export const eliminarReporte = async (id: number | string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/reportes/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error('Error al eliminar el reporte');
};

export const actualizarReporte = async (reporte: ReporteBackend): Promise<ReporteBackend> => {
  const response = await fetch(`${API_BASE_URL}/reportes/${reporte.id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(reporte),
  });
  if (!response.ok) throw new Error('Error al actualizar el reporte');
  return await response.json();
};

// --- ALERTAS E HISTORIAL ---
export const finalizarAlertaYCrearHistorial = async (
  alertaId: string | number, 
  ubicacion: string, 
  causa: string, 
  hectareas: number,
  fechaInicioIncidente: string
): Promise<void> => {
  const nuevoHistorial = {
    ubicación: ubicacion,
    causaProbable: causa,
    fechaInicio: new Date(fechaInicioIncidente).toISOString(),
    fechaFin: new Date().toISOString(),
    hectareasAfectadas: hectareas
  };

  const respuestaHistorial = await fetch(`${API_BASE_URL}/historial`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(nuevoHistorial),
  });

  if (!respuestaHistorial.ok) throw new Error('Error al generar el historial');

  try {
    await fetch(`${API_BASE_URL}/alertas/${alertaId}`, { 
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  } catch (error) {
    console.warn("Fallo el borrado de alerta", error);
  }
};

// --- OBJETO API ---
export const api = {
  // USUARIOS: Autenticación (¿Quién eres?)
  // Nota: Dejamos el retorno dinámico ya que ahora devuelve { email, rol, token }
  login: async (email: string, password: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/usuarios/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }, // Login no lleva token porque apenas lo va a obtener
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error('Credenciales inválidas');
    
    const data = await response.json();
    
    // Almacenamos la credencial digital entregada por el backend
    if (data.token) {
      localStorage.setItem('vsol_token', data.token);
    }
    
    return data;
  },

  // ALERTAS
  getAlertas: async (): Promise<Alerta[]> => {
    const response = await fetch(`${API_BASE_URL}/alertas`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Error al obtener alertas');
    return response.json();
  },

  // MONITOREO
  getZonas: async (): Promise<ZonaMonitoreo[]> => {
    const response = await fetch(`${API_BASE_URL}/monitoreo`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Error al obtener zonas');
    return response.json();
  },

  // HISTORIAL
  getHistorial: async (): Promise<Historial[]> => {
    const response = await fetch(`${API_BASE_URL}/historial`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Error al obtener historial');
    return response.json();
  },

  // REPORTES
  getReportes: async (): Promise<ReporteBackend[]> => {
    const response = await fetch(`${API_BASE_URL}/reportes`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Error al obtener reportes');
    return response.json();
  }
};