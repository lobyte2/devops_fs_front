// Presenter: Solo dibuja un recuadro con un número grande.
export const TarjetaEstadistica = ({ titulo, valor, colorBorder }) => {
  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#1e1e2f',
      borderLeft: `5px solid ${colorBorder}`,
      borderRadius: '8px',
      color: 'white',
      width: '200px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
    }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#a0a0b0' }}>{titulo}</h4>
      <h2 style={{ margin: 0, fontSize: '2rem' }}>{valor}</h2>
    </div>
  );
};