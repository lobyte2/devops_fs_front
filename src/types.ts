export type AlertStatus = 'PENDING' | 'CONFIRMED';
export type AlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type UserRole = 'ADMIN' | 'USER';

export interface Usuario {
  id?: number;
  nombre: string;
  email: string;
  rol: string;
  password?: string;
}

// ACTUALIZADO: Coincide con el JSON del backend de Alertas
export interface Alerta {
  id?: number;
  tipoAlerta: string;
  mensaje: string;
  severidad: string;
  fechaCreacion: string;
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
  causaProbable: string;
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

export interface FireAlert {
  id: string | number;
  tipoAlerta: string;
  mensaje: string;
  severidad: string;
  fechaCreacion: string;
  coordinates?: [number, number]; // Opcional por si el FireMap lo necesita
  reporter?: {
    email: string;
    deviceId: string;
    timestamp: string;
  };
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
}