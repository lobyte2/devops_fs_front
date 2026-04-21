// Presenter: Dibuja la tabla de emergencias. Solo recibe el array de alertas.
export const TablaAlertas = ({ alertas }) => {
  return (
    <div style={{ marginTop: '30px', backgroundColor: '#1e1e2f', borderRadius: '8px', padding: '20px', color: 'white' }}>
      <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '10px' }}>🚨 Últimas Emergencias Activas</h3>
      <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ color: '#a0a0b0' }}>
            <th style={{ padding: '10px' }}>ID</th>
            <th>Ubicación</th>
            <th>Gravedad</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {alertas.map((alerta) => (
            <tr key={alerta.id} style={{ borderBottom: '1px solid #2a2a3f' }}>
              <td style={{ padding: '15px 10px' }}>#{alerta.id}</td>
              <td>{alerta.ubicacion}</td>
              <td>
                <span style={{ 
                  backgroundColor: alerta.nivel === 'CRITICA' ? '#ff4757' : '#ffa502', 
                  padding: '5px 10px', borderRadius: '15px', fontSize: '0.8rem', fontWeight: 'bold' 
                }}>
                  {alerta.nivel}
                </span>
              </td>
              <td>{alerta.sagaStatus}</td>
              <td>
                <button style={{ backgroundColor: '#2ed573', border: 'none', padding: '8px 15px', color: 'white', borderRadius: '5px', cursor: 'pointer' }}>
                  Despachar Unidades
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};