import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Sidebar } from './Sidebar';

describe('Sidebar', () => {
  it('renderiza todos los botones de navegación', () => {
    // Le pasamos funciones vacías (vi.fn()) para cumplir con las props requeridas
    render(<Sidebar onLogout={vi.fn()} activeTab="monitoreo" onTabChange={vi.fn()} />);
    
    expect(screen.getByText('Zonas Monitoreo')).toBeInTheDocument();
    expect(screen.getByText('Alertas')).toBeInTheDocument();
    expect(screen.getByText('Reportes')).toBeInTheDocument();
    expect(screen.getByText('Historial')).toBeInTheDocument();
  });

  it('llama a onTabChange al hacer click en una pestaña', async () => {
    const mockOnTabChange = vi.fn();
    render(<Sidebar onLogout={vi.fn()} activeTab="monitoreo" onTabChange={mockOnTabChange} />);

    const reportesBtn = screen.getByText('Reportes');
    await userEvent.click(reportesBtn);

    // Verificamos que se llamó a la función con el ID correcto de la pestaña
    expect(mockOnTabChange).toHaveBeenCalledWith('reportes');
  });

  it('llama a onLogout al hacer click en Cerrar Sesión', async () => {
    const mockLogout = vi.fn();
    render(<Sidebar onLogout={mockLogout} activeTab="monitoreo" onTabChange={vi.fn()} />);

    const logoutBtn = screen.getByText('Cerrar Sesión');
    await userEvent.click(logoutBtn);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});