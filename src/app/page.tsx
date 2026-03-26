import { AppShell } from '@/components/layout/app-shell';
import { DashboardContent } from '@/features/dashboard/dashboard-content';

export default function Home() {
  return (
    <AppShell>
      <DashboardContent />
    </AppShell>
  );
}
