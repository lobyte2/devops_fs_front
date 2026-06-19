import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, ZoomOut, Compass, Crosshair, Layers } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { api } from '../services/api';
import { cn } from '../lib/utils';

// Icono personalizado estilo "Tactical"
const tacticalIcon = L.divIcon({
  className: 'tactical-marker',
  html: `<div class="relative flex items-center justify-center">
          <div class="absolute w-4 h-4 bg-white rounded-full animate-ping opacity-75"></div>
          <div class="w-3 h-3 bg-white border-2 border-black rounded-full relative z-10"></div>
         </div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

interface FireMapProps {
  darkMode?: boolean;
}

export function FireMap({ darkMode = true }: FireMapProps) {
  const [zonas, setZonas] = useState<any[]>([]);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar datos reales del MS Monitoreo a través del BFF (9090)
  useEffect(() => {
    const fetchZonas = async () => {
      try {
        const data = await api.getZonas();
        setZonas(data);
      } catch (error) {
        console.error("Error cargando mapa dinámico:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchZonas();
  }, []);

  // Centro de Puerto Montt
  const center: [number, number] = [-41.4689, -72.9411];

  return (
    <div className="relative w-full h-full bg-[#0A0C0E] rounded-[24px] overflow-hidden border border-white/[0.08] shadow-2xl group">
      
      {loading ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="text-white font-mono text-xs animate-pulse">SINCRO-MAPA EN CURSO...</div>
        </div>
      ) : (
        <MapContainer 
          center={center} 
          zoom={13} 
          zoomControl={false}
          style={{ height: '100%', width: '100%', background: darkMode ? '#0A0C0E' : '#F3F4F6' }}
        >
          <TileLayer
            url={darkMode 
              ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            }
            attribution='&copy; CARTO'
          />

          {zonas.map((zona) => (
            <React.Fragment key={zona.id}>
              <Marker 
                position={[zona.latitud, zona.longitud]} 
                icon={tacticalIcon}
                eventHandlers={{
                  mouseover: () => setHoveredZone(zona.nombreZona),
                  mouseout: () => setHoveredZone(null),
                }}
              >
                <Popup className="tactical-popup">
                  <div className="p-2 font-mono text-[10px]">
                    <p className="font-bold text-black uppercase border-b border-black/10 mb-1">{zona.nombreZona}</p>
                    <p className="text-black/70">RIESGO: <span className={zona.nivelRiesgo === 'ALTO' ? 'text-red-600' : 'text-orange-600'}>{zona.nivelRiesgo}</span></p>
                    <p className="text-black/70">BRIGADA: {zona.brigadaActiva ? 'ACTIVA' : 'STBY'}</p>
                  </div>
                </Popup>
              </Marker>

              {/* Área de influencia térmica dinámica */}
              <Circle
                center={[zona.latitud, zona.longitud]}
                radius={800}
                pathOptions={{
                  color: zona.nivelRiesgo === 'ALTO' ? '#FF3B30' : '#FF9500',
                  fillColor: zona.nivelRiesgo === 'ALTO' ? '#FF3B30' : '#FF9500',
                  fillOpacity: 0.15,
                  weight: 1,
                  dashArray: '5, 5'
                }}
              />
            </React.Fragment>
          ))}
        </MapContainer>
      )}

      {/* --- OVERLAYS ESTÉTICOS (Manteniendo tu diseño original) --- */}
      
      {/* Corner Brackets */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/20 m-4 rounded-tl-lg pointer-events-none z-[1000]" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/20 m-4 rounded-tr-lg pointer-events-none z-[1000]" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/20 m-4 rounded-bl-lg pointer-events-none z-[1000]" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/20 m-4 rounded-br-lg pointer-events-none z-[1000]" />

      {/* Map Controls */}
      <div className="absolute top-8 left-8 flex items-center gap-2 z-[1000]">
        <div className="flex bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-1">
          <button className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-all"><ZoomIn className="w-4 h-4" /></button>
          <button className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-all"><ZoomOut className="w-4 h-4" /></button>
        </div>
        <button className="p-2.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl text-white/60 hover:text-white transition-all">
          <Layers className="w-4 h-4" />
        </button>
      </div>

      {/* Status Overlay */}
      <div className="absolute bottom-8 left-8 z-[1000]">
        <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-6 shadow-2xl">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-[#8E8E93] uppercase tracking-[2px] mb-1">DATA-LINK LIVE</span>
            <div className="font-mono text-[11px] text-white/80 space-y-0.5">
              <p>-41.4689° S • -72.9411° W</p>
              <p className="text-forest">BFF-STATUS: {loading ? 'SYNC' : 'CONNECTED'}</p>
            </div>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="flex flex-col items-center">
            <Compass className="w-5 h-5 text-white/40 animate-[spin_10s_linear_infinite]" />
            <span className="text-[10px] font-bold text-white/20 mt-1">N_44</span>
          </div>
        </div>
      </div>

      {/* Legend Overlay */}
      <div className="absolute top-8 right-8 flex flex-col gap-3 z-[1000]">
        <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-4 min-w-[180px]">
          <h4 className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-widest mb-4 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emergency rounded-full animate-pulse" />
            Capas de Riesgo
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emergency shadow-[0_0_8px_#FF3B30]" />
                <span className="text-xs text-white/60">Alto Riesgo</span>
              </div>
              <span className="text-[10px] font-mono text-white/40">Z-1</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_#FF9500]" />
                <span className="text-xs text-white/60">Medio / Bajo</span>
              </div>
              <span className="text-[10px] font-mono text-white/40">Z-2</span>
            </div>
          </div>
        </div>
      </div>

      {/* Target Info Overlay */}
      <AnimatePresence>
        {hoveredZone && (
          <motion.div
            initial={{ opacity: 0, y: 10, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 10, x: '-50%' }}
            className="absolute bottom-32 left-1/2 bg-white text-black border border-white/20 px-4 py-2 rounded-lg shadow-2xl flex items-center gap-3 z-[1000] pointer-events-none"
          >
            <Crosshair className="w-4 h-4 text-black animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider">OBJETIVO: {hoveredZone}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}