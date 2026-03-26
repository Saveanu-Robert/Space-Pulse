import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode; // for refresh button, badges, etc.
  className?: string;
}

export function SectionHeader({ title, description, children, className }: SectionHeaderProps) {
  return (
    <div className={cn('mb-6 flex items-start justify-between gap-4', className)}>
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-white md:text-2xl">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children && <div className="flex items-center gap-2 shrink-0">{children}</div>}
    </div>
  );
}
