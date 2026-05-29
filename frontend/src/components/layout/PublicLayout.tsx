import Link from 'next/link';
import { Logo } from '@/components/shared/Logo';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Footer } from '@/components/layout/Footer';

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--vl-bg-primary)]">
      {/* Public Header */}
      <header className="sticky top-0 z-50 w-full border-b border-[var(--vl-border)] bg-[var(--vl-bg-primary)]/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo variant="full" className="h-10 w-auto" />
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/rankings" className="text-sm font-medium text-[var(--vl-text-secondary)] hover:text-[var(--vl-text-primary)] vl-transition-fast">Rankings</Link>
            <Link href="/trending" className="text-sm font-medium text-[var(--vl-text-secondary)] hover:text-[var(--vl-text-primary)] vl-transition-fast">Tendencias</Link>
            <Link href="/search" className="text-sm font-medium text-[var(--vl-text-secondary)] hover:text-[var(--vl-text-primary)] vl-transition-fast">Buscar</Link>
          </nav>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link 
              href="/search"
              className="vl-btn vl-btn-primary vl-btn-md hidden md:inline-flex"
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
