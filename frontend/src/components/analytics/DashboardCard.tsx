/**
 * DashboardCard — Shared card wrapper for dashboard grid items.
 *
 * Provides consistent styling: 20px radius, subtle border, hover effect.
 */

interface DashboardCardProps {
  /** Card title */
  title: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Optional right-side action element */
  action?: React.ReactNode;
  /** Card content */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export function DashboardCard({ title, subtitle, action, children, className = '' }: DashboardCardProps) {
  return (
    <div className={`dashboard-card p-5 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>

      {/* Content */}
      <div className="min-h-0">
        {children}
      </div>
    </div>
  );
}
