import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore(s => s.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }
    setError('');
    setIsLoading(true);
    const { error } = await login(email, password);
    setIsLoading(false);
    
    if (error) {
      setError(error.message === 'Invalid login credentials' ? 'Correo o contraseña incorrectos' : error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #FAF3E0 0%, #FDFAF6 50%, #F0E5CB 100%)' }}>
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10"
          style={{ background: 'var(--color-caramel)' }}
        />
        <motion.div
          animate={{ y: [0, 15, 0], rotate: [0, -3, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-8"
          style={{ background: 'var(--color-cacao)' }}
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/4 left-10 text-8xl opacity-20 select-none"
        >
          🍫
        </motion.div>
        <motion.div
          animate={{ scale: [1, 0.9, 1], rotate: [0, 10, 0] }}
          transition={{ duration: 7, repeat: Infinity }}
          className="absolute bottom-20 right-20 text-7xl opacity-15 select-none"
        >
          🌿
        </motion.div>
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="glass-card p-8">
          {/* Logo */}
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8"
          >
            <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-4xl mb-4 shadow-lg"
              style={{ background: 'linear-gradient(135deg, #C47B2B, #D4943E)' }}>
              🍫
            </div>
            <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-cacao)' }}>
              ChocoDash
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--color-gray-medium)' }}>
              Sistema de Gestión para Fábrica de Chocolates
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <label>Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@chocodash.ec"
                autoFocus
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <label>Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </motion.div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm px-3 py-2 rounded-lg"
                style={{ background: 'rgba(178, 34, 34, 0.08)', color: 'var(--color-danger)' }}
              >
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              disabled={isLoading}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              whileHover={!isLoading ? { scale: 1.02, boxShadow: '0 8px 25px rgba(196, 123, 43, 0.35)' } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm shadow-lg cursor-pointer disabled:opacity-70 flex justify-center items-center"
              style={{ background: 'linear-gradient(135deg, #C47B2B, #A86820)' }}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Iniciar Sesión'
              )}
            </motion.button>
          </form>

          <p className="text-center text-xs mt-6" style={{ color: 'var(--color-gray-light)' }}>
            Fábrica de Chocolates • Azuay, Ecuador
          </p>
        </div>
      </motion.div>
    </div>
  );
}
