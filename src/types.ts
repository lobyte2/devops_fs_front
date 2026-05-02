export type AlertStatus = 'PENDING' | 'CONFIRMED';
export type AlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Usuario {
  id?: number;
  nombre: string;
  email: string;
  rol: string;
  password?: string;
}

export interface Alerta {
  id: string;
  ubicacion: string;
  region: string;
  estado: AlertStatus;
  severidad: AlertSeverity;
  timestamp: string;
  latitud: number;
  longitud: number;
  brigadistaEmail: string;
}


export interface ZonaMonitoreo {
  id?: number;
  nombreZona: string;
  latitud: number;
  longitud: number;
  nivelRiesgo: string;
  brigadaActiva: boolean;
}

export interface Historial {
  id?: number;
  ubicación: string; 
  fechaInicio: string;
  fechaFin: string;
  hectareasAfectadas: number;
}

export interface Reporte {
  id?: string;
  descripcion: string;
  latitud: number;
  longitud: number;
  urlImagen: string;
  urlVideo: string;
  estado: string;
  fechaReporte: string;
}

export interface ReporteBackend {
  id?: string; // Opcional porque al crearlo aún no tiene ID
  descripcion: string;
  latitud: number;
  longitud: number;
  urlImagen: string;
  urlVideo: string;
  estado: string;
  fechaReporte: string;
}