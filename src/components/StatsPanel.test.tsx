import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { StatsPanel } from './StatsPanel';

// Mockeamos Recharts porque JSDOM no dibuja SVGs reales
vi.mock('recharts', async () => {
  const OriginalModule = await vi.importActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
    AreaChart: () => <div data-testid="area-chart">Grafico Area</div>,
    BarChart: () => <div data-testid="bar-chart">Grafico Barras</div>
  };
});

describe('StatsPanel', () => {
  it('renderiza los títulos correctamente y los contenedores de gráficos', () => {
    render(<StatsPanel />);
    
    // Verificamos títulos
    expect(screen.getByText('Incidencia de Focos')).toBeInTheDocument();
    expect(screen.getByText('Velocidad Viento (km/h)')).toBeInTheDocument();
    
    // Verificamos que los componentes simulados de Recharts se montaron
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });
});