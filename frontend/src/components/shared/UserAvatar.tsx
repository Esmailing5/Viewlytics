'use client';

import React from 'react';
import type { User } from '@/types';

interface UserAvatarProps {
  user: User | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function UserAvatar({ user, size = 'md', className = '' }: UserAvatarProps) {
  if (!user) return null;

  const initials = user.email.substring(0, 2).toUpperCase();

  const sizeClasses = {
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm',
  }[size];

  return (
    <div
      className={`flex items-center justify-center rounded-full text-white font-bold select-none flex-shrink-0 ${sizeClasses} ${className}`}
      style={{ background: 'var(--vl-gradient-brand)' }}
      title={user.email}
    >
      {initials}
    </div>
  );
}
