import React from 'react';
import { MapPin, Clock, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { FireAlert } from '../types';

interface AlertCardProps {
  alert: FireAlert;
  index: number;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert, index }) => {
  const isPending = alert.status === 'PENDING';

  const severityColors = {
    LOW: 'text-green-400 bg-green-400/10',
    MEDIUM: 'text-yellow-400 bg-yellow-400/10',
    HIGH: 'text-orange-400 bg-orange-400/10',
    CRITICAL: 'text-emergency bg-emergency/10'
  };

  return (
      <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group relative p-4 rounded-2xl glass hover:bg-white/[0.12] transition-all duration-300"
      >
        <div className="flex justify-between items-start mb-3">
          <div>
          <span className={cn(
              "inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-bold tracking-wider uppercase mb-3",
              isPending
                  ? "bg-[#F6AD55]/20 text-[#F6AD55] border-[#F6AD55]/30"
                  : "bg-emergency/20 text-emergency border-emergency/30"
          )}>
            {alert.status}
          </span>
            <h3 className="text-pure-white font-semibold text-[15px] leading-tight">
              {alert.location}
            </h3>
            <p className="text-[13px] text-[#8E8E93] mt-1 leading-normal font-sans">
              {alert.region} • {alert.timestamp}
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-3">
          <div className="flex items-center gap-2">
            <div className={cn(
                "w-1.5 h-1.5 rounded-full",
                isPending ? "bg-[#F6AD55] shadow-[0_0_8px_#F6AD55]" : "bg-emergency shadow-[0_0_8px_#FF3B30]"
            )} />
            <span className="text-[11px] font-bold text-white/30 uppercase tracking-widest">
            {alert.severity} INTENSITY
          </span>
          </div>

          {alert.reporter && (
              <div className="flex items-center gap-1.5 opacity-40 hover:opacity-100 transition-opacity cursor-help" title={`ID: ${alert.reporter.deviceId} • ${alert.reporter.timestamp}`}>
                <div className="w-4 h-4 bg-white/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                </div>
                <span className="text-[9px] font-mono text-white/50 truncate max-w-[100px]">
              {alert.reporter.email.split('@')[0]}
            </span>
              </div>
          )}
        </div>
      </motion.div>
  );
}
