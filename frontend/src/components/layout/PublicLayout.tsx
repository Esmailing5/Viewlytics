import Link from 'next/link';
import { Logo } from '@/components/shared/Logo';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Footer } from '@/components/layout/Footer';

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)]">
      {/* Public Header */}
      <header className="sticky top-0 z-50 w-full border-b border-[var(--border-color)] bg-[var(--bg-main)]/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo variant="full" className="h-10 w-auto" />
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/rankings" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Rankings</Link>
            <Link href="/trending" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Tendencias</Link>
            <Link href="/search" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Buscar</Link>
          </nav>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link 
              href="/search"
              className="hidden md:inline-flex items-center justify-center h-10 px-6 rounded-xl bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-blue)] text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-[var(--accent-blue)]/20"
            >
              Explorar Plataforma
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      <Footer />
    </div>
  );
}
