import { Alerta, Usuario } from '../types';

// Actualizado al puerto 9090 de tu API Gateway
const API_BASE_URL = 'http://localhost:9090';

export const api = {
  // Login contra el MS Usuarios a través del Gateway
  login: async (email: string, password: string): Promise<Usuario> => {
    const response = await fetch(`${API_BASE_URL}/usuarios/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error('Credenciales inválidas');
    return response.json();
  },

  // Obtener alertas del MS Alertas a través del Gateway
  getAlertas: async (): Promise<Alerta[]> => {
    const response = await fetch(`${API_BASE_URL}/alertas`);
    if (!response.ok) throw new Error('Error al obtener alertas');
    return response.json();
  }
};