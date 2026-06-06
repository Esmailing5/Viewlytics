'use client';

import React, { useState, useEffect, useRef } from 'react';
import type { User } from '@/types';
import { useAuth } from '@/providers/AuthProvider';
import { LogOut } from 'lucide-react';

interface UserAvatarProps {
  user: User | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function UserAvatar({ user, size = 'md', className = '' }: UserAvatarProps) {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!user) return null;

  const initials = user.email.substring(0, 2).toUpperCase();

  const sizeClasses = {
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm',
  }[size];

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      {/* Avatar Circle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center rounded-full text-white font-bold select-none flex-shrink-0 cursor-pointer transition-transform hover:scale-105 active:scale-95 ${sizeClasses} ${className}`}
        style={{ background: 'var(--vl-gradient-brand)' }}
        title={user.email}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {initials}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 min-w-[180px] rounded-xl border border-[var(--vl-border)] bg-[var(--vl-bg-surface)] p-2 shadow-xl z-50 backdrop-blur-md animate-[vl-slide-up_0.15s_var(--ease-out)_both]"
          role="menu"
        >
          {/* User info */}
          <div className="px-3 py-1.5 text-left">
            <p className="text-xs text-[var(--vl-text-secondary)] truncate select-all" title={user.email}>
              {user.email}
            </p>
          </div>

          <div className="my-1.5 h-px bg-[var(--vl-border)]" />

          {/* Action button */}
          <button
            onClick={() => {
              setIsOpen(false);
              logout();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-[var(--vl-text-secondary)] hover:text-[var(--vl-red)] hover:bg-[rgba(255,59,48,0.06)] rounded-lg transition-colors duration-150 cursor-pointer"
            role="menuitem"
          >
            <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      )}
    </div>
  );
}
