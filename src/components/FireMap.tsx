import React from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize2, ZoomIn, ZoomOut, Compass, Crosshair, Layers } from 'lucide-react';
import { FireAlert } from '../types';
import { cn } from '../lib/utils';

interface FireMapProps {
  alerts: FireAlert[];
}

export function FireMap({ alerts }: FireMapProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const svgRef = React.useRef<SVGSVGElement>(null);
  const [hoveredAlert, setHoveredAlert] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!containerRef.current || !svgRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const svg = d3.select(svgRef.current)
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMidYMid meet');

    // Clear previous
    svg.selectAll('*').remove();

    // Technical background
    svg.append('rect')
        .attr('width', width)
        .attr('height', height)
        .attr('fill', '#0A0C0E');

    // Subtle radial depth
    const gradient = svg.append('defs')
        .append('radialGradient')
        .attr('id', 'mapGradient')
        .attr('cx', '50%')
        .attr('cy', '50%')
        .attr('r', '50%');

    gradient.append('stop').attr('offset', '0%').attr('stop-color', '#14171A').attr('stop-opacity', 1);
    gradient.append('stop').attr('offset', '100%').attr('stop-color', '#070809').attr('stop-opacity', 1);

    svg.append('rect')
        .attr('width', width)
        .attr('height', height)
        .attr('fill', 'url(#mapGradient)');

    // Tactical Grid
    const g = svg.append('g').attr('class', 'grid opacity-[0.03]');
    const gridSize = 40;

    // Major Grid
    for (let i = 0; i <= width; i += gridSize) {
      g.append('line').attr('x1', i).attr('y1', 0).attr('x2', i).attr('y2', height).attr('stroke', 'white').attr('stroke-width', 1);
    }
    for (let i = 0; i <= height; i += gridSize) {
      g.append('line').attr('x1', 0).attr('y1', i).attr('x2', width).attr('y2', i).attr('stroke', 'white').attr('stroke-width', 1);
    }

    // Border Frame
    const frame = svg.append('g').attr('class', 'map-frame opacity-20');
    const padding = 20;
    frame.append('rect')
        .attr('x', padding)
        .attr('y', padding)
        .attr('width', width - padding * 2)
        .attr('height', height - padding * 2)
        .attr('fill', 'none')
        .attr('stroke', 'white')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '4 4');

    // Stylized Coastline / Terrain for Chile
    const terrainGroup = svg.append('g').attr('class', 'terrain opacity-10');

    // Decorative coastline path (stylized)
    const curve = d3.line().curve(d3.curveBasis);
    const mockCoastPoints: [number, number][] = [
      [width/2 - 20, 0],
      [width/2 + 30, height/3],
      [width/2 - 10, height/2],
      [width/2 + 20, height * 2/3],
      [width/2 - 40, height]
    ];

    terrainGroup.append('path')
        .attr('d', curve(mockCoastPoints) || "")
        .attr('fill', 'none')
        .attr('stroke', '#34C759')
        .attr('stroke-width', 140)
        .attr('stroke-opacity', 0.1)
        .attr('stroke-linecap', 'round');

    terrainGroup.append('path')
        .attr('d', curve(mockCoastPoints) || "")
        .attr('fill', 'none')
        .attr('stroke', 'white')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '10 10');

    // Fire Elements
    alerts.forEach((alert) => {
      const [lon, lat] = alert.coordinates;
      const x = width / 2 + (lon + 71.5) * 80;
      const y = height / 2 - (lat + 35.6) * 80;

      const color = alert.severity === 'CRITICAL' ? '#FF3B30' : '#FF9500';

      const fireNode = svg.append('g')
          .attr('transform', `translate(${x}, ${y})`)
          .attr('class', 'fire-marker cursor-pointer')
          .on('mouseenter', () => setHoveredAlert(alert.id))
          .on('mouseleave', () => setHoveredAlert(null));

      // Heat Rings
      const rings = [24, 48, 72];
      rings.forEach((r, i) => {
        fireNode.append('circle')
            .attr('r', r)
            .attr('fill', 'none')
            .attr('stroke', color)
            .attr('stroke-width', 1)
            .attr('stroke-opacity', 0.2 / (i + 1))
            .attr('class', 'animate-pulse');
      });

      // Core Marker
      fireNode.append('circle')
          .attr('r', 6)
          .attr('fill', color)
          .attr('stroke', 'white')
          .attr('stroke-width', 2);

      // Label (Technical)
      fireNode.append('text')
          .attr('x', 14)
          .attr('y', 4)
          .attr('fill', 'white')
          .attr('font-size', '10px')
          .attr('font-weight', 'bold')
          .attr('class', 'uppercase tracking-tighter pointer-events-none')
          .text(alert.id);
    });

  }, [alerts]);

  return (
      <div ref={containerRef} className="relative w-full h-full bg-[#0A0C0E] rounded-[24px] overflow-hidden border border-white/[0.08] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)] group">
        <svg ref={svgRef} className="w-full h-full" />

        {/* Corner Brackets */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/20 m-4 rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/20 m-4 rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/20 m-4 rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/20 m-4 rounded-br-lg" />

        {/* Map Controls */}
        <div className="absolute top-8 left-8 flex items-center gap-2">
          <div className="flex bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-1">
            <button className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-all"><ZoomIn className="w-4 h-4" /></button>
            <button className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-all"><ZoomOut className="w-4 h-4" /></button>
          </div>
          <button className="p-2.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl text-white/60 hover:text-white transition-all">
            <Layers className="w-4 h-4" />
          </button>
        </div>

        {/* Status Overlay */}
        <div className="absolute bottom-8 left-8">
          <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-6 shadow-2xl">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-[#8E8E93] uppercase tracking-[2px] mb-1">Coordenadas Live</span>
              <div className="font-mono text-[11px] text-white/80 space-y-0.5">
                <p>33.4489° S • 70.6693° W</p>
                <p className="text-forest">STBY-LINK: ACTIVE</p>
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
        <div className="absolute top-8 right-8 flex flex-col gap-3">
          <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-4 min-w-[200px]">
            <h4 className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-widest mb-4 flex items-center gap-2">
              <div className="w-1 h-1 bg-emergency rounded-full animate-pulse" />
              Impacto Térmico
            </h4>
            <div className="space-y-3">
              {[
                { label: 'Critico', color: 'bg-emergency', val: '12' },
                { label: 'Moderado', color: 'bg-accent', val: '08' },
                { label: 'Controlado', color: 'bg-forest', val: '04' }
              ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-1.5 h-1.5 rounded-full", item.color)} />
                      <span className="text-xs text-white/60">{item.label}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-white">{item.val}</span>
                  </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hover Info Tooltip */}
        <AnimatePresence>
          {hoveredAlert && (
              <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-32 left-1/2 -translate-x-1/2 bg-emergency border border-white/20 px-4 py-2 rounded-lg shadow-2xl flex items-center gap-3 z-50 pointer-events-none"
              >
                <Crosshair className="w-4 h-4 text-white" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Objetivo Bloqueado: {hoveredAlert}</span>
              </motion.div>
          )}
        </AnimatePresence>
      </div>
  );
}
