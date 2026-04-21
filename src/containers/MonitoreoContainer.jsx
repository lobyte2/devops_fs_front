import { useState, useEffect } from 'react';
import { TarjetaEstadistica } from '../components/TarjetaEstadistica';
import { TablaAlertas } from '../components/TablaAlertas';

// Container: Maneja estado y simula la llamada al BFF / Microservicios [cite: 16, 36]
export const MonitoreoContainer = () => {
  const [alertas, setAlertas] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Simulación de la petición HTTP a tu API Gateway (Ej: localhost:8080/api/alertas)
  useEffect(() => {
    setTimeout(() => {
      setAlertas([
        { id: 101, ubicacion: "Sector Norte - Av. Principal", nivel: "CRITICA", sagaStatus: "CONFIRMED" },
        { id: 102, ubicacion: "Zona Industrial - Bodega 4", nivel: "ALTA", sagaStatus: "PENDING" },
        { id: 103, ubicacion: "Ruta 68 - Km 12", nivel: "CRITICA", sagaStatus: "CONFIRMED" },
      ]);
      setCargando(false);
    }, 1000); // Simulamos 1 segundo de carga de red
  }, []);

  if (cargando) return <h2 style={{color: 'white', textAlign: 'center', marginTop: '50px'}}>Cargando panel de control...</h2>;

  return (
    <div style={{ backgroundColor: '#13131a', minHeight: '100vh', padding: '40px', fontFamily: 'sans-serif' }}>
      
      <header style={{ marginBottom: '30px', color: 'white' }}>
        <h1 style={{ margin: 0 }}>Centro de Mando: Sistema Bomberos</h1>
        <p style={{ color: '#a0a0b0' }}>Monitoreo en tiempo real de operaciones y microservicios.</p>
      </header>

      {/* Sección de Tarjetas Estadísticas */}
      <div style={{ display: 'flex', gap: '20px' }}>
        <TarjetaEstadistica titulo="Alertas Activas" valor={alertas.length} colorBorder="#ff4757" />
        <TarjetaEstadistica titulo="Unidades Disponibles" valor="12" colorBorder="#2ed573" />
        <TarjetaEstadistica titulo="Sagas Pendientes" valor={alertas.filter(a => a.sagaStatus === 'PENDING').length} colorBorder="#ffa502" />
      </div>

      {/* Sección de la Tabla */}
      <TablaAlertas alertas={alertas} />

    </div>
  );
};