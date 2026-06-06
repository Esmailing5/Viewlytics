'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { Logo } from '@/components/shared/Logo';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const { user, login, isLoading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already authenticated, redirect to /
  useEffect(() => {
    if (!isLoading && user) {
      router.replace('/');
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor, ingresa tu correo y contraseña.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        router.replace('/');
      } else {
        setError(res.error || 'Credenciales incorrectas');
      }
    } catch (err) {
      setError('Ocurrió un error inesperado. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--vl-bg-primary)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[var(--vl-red)] border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--vl-text-secondary)] text-sm font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[var(--vl-bg-primary)] px-4 relative overflow-hidden">
      {/* Decorative premium radial gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[radial-gradient(circle,rgba(255,59,48,0.05)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[radial-gradient(circle,rgba(0,194,255,0.03)_0%,transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-[420px] z-10 flex flex-col items-center">
        {/* Logo */}
        <div className="mb-8 select-none animate-[vl-fade-in_0.4s_var(--ease-out)]">
          <Logo variant="full" width={200} height={52} />
        </div>

        {/* Card */}
        <div className="w-full bg-[var(--vl-bg-secondary)] border border-[var(--vl-border)] rounded-xl p-8 shadow-2xl relative backdrop-blur-md animate-[vl-slide-up_0.5s_var(--ease-out)_both]">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-[var(--vl-text-primary)] tracking-tight">Iniciar Sesión</h1>
            <p className="text-[var(--vl-text-secondary)] text-xs mt-1">
              Ingresa tus credenciales para acceder a la plataforma
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-[rgba(255,59,48,0.1)] border border-[rgba(255,59,48,0.2)] rounded-lg text-[var(--vl-red)] text-xs font-medium text-center">
                {error}
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-[var(--vl-text-secondary)]">
                Correo Electrónico
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[var(--vl-text-disabled)] pointer-events-none">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="admin@viewlytics.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[var(--vl-bg-primary)] border border-[var(--vl-border)] hover:border-[var(--vl-border-hover)] focus:border-[var(--vl-red)] rounded-lg text-sm text-[var(--vl-text-primary)] placeholder-[var(--vl-text-disabled)] focus:outline-none focus:ring-1 focus:ring-[var(--vl-red)] transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-semibold text-[var(--vl-text-secondary)]">
                Contraseña
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[var(--vl-text-disabled)] pointer-events-none">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-[var(--vl-bg-primary)] border border-[var(--vl-border)] hover:border-[var(--vl-border-hover)] focus:border-[var(--vl-red)] rounded-lg text-sm text-[var(--vl-text-primary)] placeholder-[var(--vl-text-disabled)] focus:outline-none focus:ring-1 focus:ring-[var(--vl-red)] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--vl-text-tertiary)] hover:text-[var(--vl-text-primary)] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-2.5 bg-[var(--vl-red)] hover:bg-[var(--vl-red-hover)] active:bg-[var(--vl-red-active)] disabled:opacity-50 text-[var(--vl-text-primary)] font-semibold rounded-lg text-sm transition-colors shadow-lg shadow-[rgba(255,59,48,0.2)] focus:outline-none flex justify-center items-center"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-[var(--vl-text-primary)] border-t-transparent rounded-full animate-spin" />
              ) : (
                'Entrar'
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <p className="text-[var(--vl-text-disabled)] text-[10px] mt-6 tracking-wide select-none">
          PROPIEDAD PRIVADA DE VIEWLYTICS • ACCESO RESTRINGIDO
        </p>
      </div>
    </div>
  );
}
