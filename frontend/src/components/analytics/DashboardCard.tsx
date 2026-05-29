/**
 * DashboardCard — Shared card wrapper for dashboard grid items.
 *
 * Provides consistent styling using design system card classes.
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
    <div className={`vl-card-dashboard p-5 ${className}`}>
      {/* Header */}
      <div className="vl-card-header">
        <div>
          <h3 className="vl-card-title">
            {title}
          </h3>
          {subtitle && (
            <p className="vl-card-subtitle">
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
