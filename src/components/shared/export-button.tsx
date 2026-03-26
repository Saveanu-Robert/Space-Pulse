'use client';

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { showToast } from './toast-container';

interface ExportButtonProps {
  data: Record<string, unknown>[] | Record<string, unknown>;
  filename: string;
  format?: 'csv' | 'json';
  label?: string;
}

function toCSV(data: Record<string, unknown>[]): string {
  if (data.length === 0) return '';
  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers.map((h) => {
      const val = String(row[h] ?? '');
      return val.includes(',') || val.includes('"') ? `"${val.replace(/"/g, '""')}"` : val;
    }).join(',')
  );
  return [headers.join(','), ...rows].join('\n');
}

export function ExportButton({ data, filename, format = 'csv', label = 'Export' }: ExportButtonProps) {
  const handleExport = () => {
    let content: string;
    let mimeType: string;
    let ext: string;

    if (format === 'csv' && Array.isArray(data)) {
      content = toCSV(data);
      mimeType = 'text/csv';
      ext = 'csv';
    } else {
      content = JSON.stringify(data, null, 2);
      mimeType = 'application/json';
      ext = 'json';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast({ title: 'Downloaded', description: `${filename}.${ext}`, type: 'success' });
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleExport} className="gap-1.5 text-xs text-muted-foreground hover:text-white">
      <Download className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">{label}</span>
    </Button>
  );
}
