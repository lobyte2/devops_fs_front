import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FireMap } from './FireMap';
import { api } from '../services/api';

// 1. Mockeamos el servicio API
vi.mock('../services/api', () => ({
  api: {
    getZonas: vi.fn()
  }
}));

// 2. Mockeamos React-Leaflet para evitar errores de renderizado de mapas
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: any) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => <div />,
  Marker: ({ children }: any) => <div data-testid="marker">{children}</div>,
  Popup: () => <div />,
  Circle: () => <div />
}));

describe('FireMap', () => {
  it('muestra el estado de carga y luego renderiza el mapa tras conectar con la API', async () => {
    // Preparamos datos falsos
    const mockZonas = [
      { id: 1, nombreZona: 'Sector Alerce', latitud: -41.4, longitud: -72.9, nivelRiesgo: 'ALTO' }
    ];

    // Le decimos a la API falsa que devuelva nuestra zona
    (api.getZonas as any).mockResolvedValue(mockZonas);

    render(<FireMap />);

    // Verifica que muestra la pantalla de carga inicial que configuraste
    expect(screen.getByText('SINCRO-MAPA EN CURSO...')).toBeInTheDocument();

    // Usamos waitFor para esperar a que termine el useEffect y desaparezca el loading
    await waitFor(() => {
      // El contenedor del mapa debería aparecer
      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });

    // Validamos que se haya intentado conectar al backend
    expect(api.getZonas).toHaveBeenCalledTimes(1);
    
    // Validamos que la UI refleje el estado "CONNECTED"
    expect(screen.getByText(/CONNECTED/i)).toBeInTheDocument();
  });
});