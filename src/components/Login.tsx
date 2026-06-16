import React from 'react';
import { motion } from 'motion/react';
import { Flame, Mail, Lock, ArrowRight, UserCircle2, ChevronLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import { FireAlert, UserRole } from '../types';
import { api } from '../services/api'; // <-- Importamos la API real

interface LoginProps {
    onLogin: (email: string, role: UserRole) => void;
}

export function Login({ onLogin }: LoginProps) {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    // El estado del rol visual se mantiene para la UI, pero el rol real vendrá del backend
    const [role, setRole] = React.useState<UserRole>('ADMIN'); 
    const [isLoading, setIsLoading] = React.useState(false);
    const [isRemembered, setIsRemembered] = React.useState(false);
    const [rememberedEmail, setRememberedEmail] = React.useState('');

    React.useEffect(() => {
        const savedEmail = localStorage.getItem('vsol_remembered_email');
        if (savedEmail) {
            setRememberedEmail(savedEmail);
            setEmail(savedEmail);
            setIsRemembered(true);
        }
    }, []);

    // <-- MÉTODO ACTUALIZADO PARA VALIDAR LA PESTAÑA CON EL BACKEND
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            // 1. Llamada real de Autenticación al backend
            const userData = await api.login(email, password);
            
            // 2. ¡NUEVO! Validamos que el rol de la Base de Datos coincida con la pestaña seleccionada
            if (userData.rol !== role) {
                // Si eligió mal la pestaña, lo bloqueamos
                const nombreRolPantalla = role === 'ADMIN' ? 'Brigadista' : 'Comunidad';
                alert(`Acceso denegado: Esta cuenta no tiene permisos de ${nombreRolPantalla}. Por favor, selecciona la pestaña correcta.`);
                setIsLoading(false);
                return; // Cortamos la ejecución aquí, no lo dejamos pasar
            }
            
            // 3. Si las credenciales y la pestaña son correctas, recordamos el email localmente
            localStorage.setItem('vsol_remembered_email', userData.email);
            
            // Iniciamos sesión inyectando el ROL REAL entregado por el backend (Autorización)
            onLogin(userData.email, userData.rol as UserRole);
            
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            alert("Error de acceso: Credenciales incorrectas");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSwitchAccount = () => {
        setIsRemembered(false);
        setEmail('');
        setPassword('');
    };

    return (
        <div className="min-h-screen w-full bg-charcoal flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-emergency/5 to-transparent pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[400px] z-10"
            >
                <div className="flex flex-col items-center mb-8">
                    <div className="w-14 h-14 bg-emergency rounded-xl flex items-center justify-center shadow-2xl shadow-emergency/30 mb-4">
                        <Flame className="text-white w-7 h-7" />
                    </div>
                    <h1 className="text-xl font-bold font-sans tracking-tight text-white uppercase">Valle del Sol</h1>
                    <p className="text-[#8E8E93] text-[10px] font-bold uppercase tracking-widest mt-1">Acceso Institucional</p>
                </div>

                <div className="glass p-8 rounded-[24px] bg-dark-bg/60 backdrop-blur-3xl border border-white/10 shadow-2xl">
                    <div className="mb-8">
                        {isRemembered ? (
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50">
                                    <UserCircle2 className="w-8 h-8" />
                                </div>
                                <div>
                                    <h2 className="text-[15px] font-semibold text-white">Hola de nuevo</h2>
                                    <p className="text-[13px] text-[#8E8E93] truncate max-w-[200px]">{rememberedEmail}</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-[17px] font-semibold text-white">Iniciar Sesión</h2>
                                <p className="text-[13px] text-[#8E8E93] mt-1">Ingresa tus credenciales de acceso</p>
                            </>
                        )}
                    </div>

                    <div className="flex bg-white/5 p-1 rounded-xl mb-6 border border-white/10">
                        <button
                            type="button"
                            onClick={() => setRole('ADMIN')}
                            className={cn(
                                "flex-1 py-2 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all",
                                role === 'ADMIN' ? "bg-emergency text-white shadow-lg" : "text-white/40 hover:text-white"
                            )}
                        >
                            Brigadista
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('USER')}
                            className={cn(
                                "flex-1 py-2 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all",
                                /* ACÁ ESTÁ EL CAMBIO: de bg-forest a bg-emergency */
                                role === 'USER' ? "bg-emergency text-white shadow-lg" : "text-white/40 hover:text-white"
                            )}
                        >
                            Comunidad
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {!isRemembered && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-widest ml-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="usuario@valledelsol.cl"
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-[14px] focus:outline-none focus:border-emergency/40 transition-all text-white"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-widest ml-1">Contraseña</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-[14px] focus:outline-none focus:border-emergency/40 transition-all text-white"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={cn(
                                "w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-xl mt-2",
                                isLoading
                                    ? "bg-white/5 text-white/20"
                                    : "bg-emergency text-white hover:brightness-110 shadow-emergency/20 active:scale-[0.98]"
                            )}
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Entrar al Panel
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {isRemembered && (
                        <button
                            onClick={handleSwitchAccount}
                            className="w-full mt-6 flex items-center justify-center gap-2 text-[11px] font-bold text-white/30 hover:text-white transition-colors uppercase tracking-widest"
                        >
                            <ChevronLeft className="w-3 h-3" />
                            Usar otra cuenta
                        </button>
                    )}
                </div>

                <p className="text-center mt-8 text-[10px] text-white/20 font-bold uppercase tracking-[0.2em]">Acceso Seguro • AES-256</p>
            </motion.div>
        </div>
    );
}