import React from 'react';
import * as d3 from 'd3';
import { motion } from 'motion/react';
import { Maximize2, ZoomIn, ZoomOut, Compass, Info } from 'lucide-react';
import { FireAlert } from '../types';

interface FireMapProps {
  alerts: FireAlert[];
}

export function FireMap({ alerts }: FireMapProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const svgRef = React.useRef<SVGSVGElement>(null);

  React.useEffect(() => {
    if (!containerRef.current || !svgRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('background', 'radial-gradient(circle at center, #1E2126 0%, #0F1114 100%)');

    // Clear previous
    svg.selectAll('*').remove();

    // Decorative grid
    const g = svg.append('g').attr('class', 'grid opacity-10');
    const gridSize = 32;
    for (let i = 0; i <= width; i += gridSize) {
      g.append('line').attr('x1', i).attr('y1', 0).attr('x2', i).attr('y2', height).attr('stroke', 'rgba(255,255,255,0.12)').attr('stroke-width', 1);
    }
    for (let i = 0; i <= height; i += gridSize) {
      g.append('line').attr('x1', 0).attr('y1', i).attr('x2', width).attr('y2', i).attr('stroke', 'rgba(255,255,255,0.12)').attr('stroke-width', 1);
    }

    // Draw Chile (Simplified Path for visualization)
    // In a real app we'd load topojson, but here we'll create a stylized representation
    const chileGroup = svg.append('g').attr('class', 'chile-map');
    
    // Abstract representation of Chile coast
    const chilePath = "M " + (width/2 - 20) + " 50 Q " + (width/2 + 10) + " " + (height/2) + " " + (width/2 - 40) + " " + (height - 50);
    
    chileGroup.append('path')
      .attr('d', chilePath)
      .attr('stroke', 'rgba(255,255,255,0.1)')
      .attr('stroke-width', 40)
      .attr('fill', 'none')
      .attr('stroke-linecap', 'round');

    chileGroup.append('path')
      .attr('d', chilePath)
      .attr('stroke', 'rgba(42, 157, 143, 0.2)')
      .attr('stroke-width', 30)
      .attr('fill', 'none')
      .attr('stroke-linecap', 'round');

    // Fire Points
    const firesGroup = svg.append('g').attr('class', 'fire-spots');

    alerts.forEach((alert) => {
      const [lon, lat] = alert.coordinates;
      // Map coordinates to our stylized map (simplified)
      // Since it's a UI mockup, we place them relative to center
      const x = width / 2 + (lon + 71.5) * 50;
      const y = height / 2 - (lat + 35.6) * 50;

      const fire = firesGroup.append('g')
        .attr('transform', `translate(${x}, ${y})`)
        .attr('class', 'cursor-pointer group');

      // Pulse effect
      fire.append('circle')
        .attr('r', 16)
        .attr('fill', alert.severity === 'CRITICAL' ? 'rgba(255, 59, 48, 0.4)' : 'rgba(246, 173, 85, 0.4)')
        .attr('class', 'animate-pulse');

      fire.append('circle')
        .attr('r', 4)
        .attr('fill', alert.severity === 'CRITICAL' ? '#FF3B30' : '#F6AD55')
        .attr('stroke', 'rgba(255,255,255,0.2)')
        .attr('stroke-width', 1);
    });

  }, [alerts]);

  return (
    <div ref={containerRef} className="relative w-full h-full glass rounded-[16px] overflow-hidden">
      <svg ref={svgRef} className="w-full h-full" />
      
      {/* Map Controls */}
      <div className="absolute top-8 left-8 flex flex-col gap-3">
        <div className="glass p-1.5 rounded-2xl flex flex-col gap-1">
          <button className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/70 hover:text-white">
            <ZoomIn className="w-5 h-5" />
          </button>
          <div className="h-px bg-white/10 mx-2" />
          <button className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/70 hover:text-white">
            <ZoomOut className="w-5 h-5" />
          </button>
        </div>
        <button className="glass p-3 rounded-2xl hover:bg-white/10 transition-colors text-white/70 hover:text-white">
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>

      <div className="absolute top-8 right-8 flex gap-3">
        <div className="glass px-4 py-2 rounded-xl flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-widest">Nivel de Riesgo</span>
            <span className="text-sm font-bold text-emergency">ALTO / EXTREMO</span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <Compass className="w-5 h-5 text-white/60 animate-spin-slow" />
        </div>
      </div>

      {/* Region Labels */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-8 pointer-events-none">
        <div className="flex flex-col items-center gap-2 opacity-40">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Zona Norte</span>
          <div className="w-px h-8 bg-gradient-to-b from-white to-transparent" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-emergency">Zona Central</span>
          <div className="w-px h-12 bg-emergency shadow-[0_0_10px_#E63946]" />
        </div>
        <div className="flex flex-col items-center gap-2 opacity-40">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Zona Sur</span>
          <div className="w-px h-8 bg-gradient-to-b from-white to-transparent" />
        </div>
      </div>

      {/* Info Legend */}
      <div className="absolute bottom-6 right-6 glass p-4 rounded-2xl flex items-center gap-6 max-w-xs">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emergency shadow-[0_0_10px_#FF3B30]" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#8E8E93] uppercase">Activo</span>
            <span className="text-xs font-bold whitespace-nowrap">24 Focos</span>
          </div>
        </div>
        <div className="w-px h-6 bg-white/10" />
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#F6AD55] shadow-[0_0_10px_#F6AD55]" />
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-[#8E8E93] uppercase">Controlado</span>
            <span className="text-xs font-bold whitespace-nowrap">12 Focos</span>
          </div>
        </div>
      </div>
    </div>
  );
}
