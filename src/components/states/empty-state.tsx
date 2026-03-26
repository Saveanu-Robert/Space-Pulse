import { type LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  message?: string;
}

export function EmptyState({ icon: Icon = Inbox, title, message }: EmptyStateProps) {
  return (
    <div className="glass-card p-8 text-center">
      <Icon className="mx-auto mb-4 h-10 w-10 text-muted-foreground/40" />
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {message && <p className="mt-2 text-sm text-muted-foreground">{message}</p>}
    </div>
  );
}
