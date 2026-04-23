import React from 'react';
import { motion } from 'motion/react';
import { Flame, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';

interface LoginProps {
    onLogin: (email: string) => void;
}

export function Login({ onLogin }: LoginProps) {
    const [pin, setPin] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const handleQuickLogin = (p: string) => {
        if (p.length === 4) {
            setIsLoading(true);
            // Simulación de validación instantánea
            setTimeout(() => {
                onLogin('brigada@sol.cl');
                setIsLoading(false);
            }, 400);
        }
    };

    return (
        <div className="min-h-screen w-full bg-charcoal flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-emergency/5 to-transparent pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-[380px] z-10"
            >
                <div className="flex flex-col items-center mb-8">
                    <div className="w-14 h-14 bg-emergency rounded-xl flex items-center justify-center shadow-2xl shadow-emergency/40 mb-4">
                        <Flame className="text-white w-7 h-7" />
                    </div>
                    <h1 className="text-xl font-bold font-sans tracking-tight text-pure-white uppercase">Acceso de Emergencia</h1>
                    <p className="text-[#8E8E93] text-[11px] font-bold uppercase tracking-widest mt-1">S.S.O Municipal Valle del Sol</p>
                </div>

                <div className="glass p-6 rounded-[20px] bg-dark-bg/60 backdrop-blur-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    <div className="text-center mb-6">
                        <p className="text-sm font-medium text-white/80">Ingresa tu PIN de Brigada</p>
                        <div className="flex justify-center gap-3 mt-4">
                            {[0, 1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "w-3 h-3 rounded-full transition-all duration-200",
                                        pin.length > i ? "bg-emergency scale-125" : "bg-white/10"
                                    )}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0].map((num, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => {
                                    if (num === 'C') {
                                        setPin('');
                                    } else if (pin.length < 4) {
                                        const newPin = pin + num;
                                        setPin(newPin);
                                        handleQuickLogin(newPin);
                                    }
                                }}
                                className={cn(
                                    "h-14 rounded-xl flex items-center justify-center text-lg font-bold transition-all active:scale-90",
                                    num === 'C' ? "text-emergency bg-emergency/10 hover:bg-emergency/20" : "bg-white/5 text-pure-white hover:bg-white/10"
                                )}
                            >
                                {num}
                            </button>
                        ))}
                        <button
                            onClick={() => handleQuickLogin('1234')}
                            className="col-span-1 h-14 rounded-xl bg-emergency/10 text-emergency flex items-center justify-center hover:bg-emergency hover:text-white transition-colors"
                        >
                            <ShieldCheck className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="mt-6 pt-6 border-t border-white/5">
                        <button
                            onClick={() => handleQuickLogin('1234')}
                            className="w-full py-4 rounded-xl bg-emergency text-pure-white font-bold text-sm shadow-xl shadow-emergency/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            <ArrowRight className="w-4 h-4" />
                            ACCESO RÁPIDO CRÍTICO
                        </button>
                    </div>
                </div>

                <p className="text-center mt-6 text-[10px] text-white/20 font-bold uppercase tracking-[0.2em]">Dispositivo Autorizado por Central</p>
            </motion.div>

            {isLoading && (
                <div className="absolute inset-0 bg-charcoal/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                    <div className="w-10 h-10 border-3 border-emergency/20 border-t-emergency rounded-full animate-spin mb-4" />
                    <p className="text-xs font-bold text-emergency tracking-widest animate-pulse">AUTORIZANDO...</p>
                </div>
            )}
        </div>
    );
}
