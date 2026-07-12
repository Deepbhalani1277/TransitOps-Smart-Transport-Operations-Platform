import React from 'react';
import { Download } from 'lucide-react';

interface CSVExportButtonProps {
  data: Record<string, any>[] | undefined;
  filename: string;
  headers: { key: string; label: string }[];
  disabled?: boolean;
}

const CSVExportButton: React.FC<CSVExportButtonProps> = ({
  data,
  filename,
  headers,
  disabled = false,
}) => {
  const exportToCSV = () => {
    if (!data || data.length === 0) return;

    // Build headers row
    const headerRow = headers.map((h) => `"${h.label.replace(/"/g, '""')}"`).join(',');

    // Build data rows
    const dataRows = data.map((row) =>
      headers
        .map((h) => {
          const val = row[h.key];
          const stringified =
            val === null || val === undefined ? '' : String(val);
          return `"${stringified.replace(/"/g, '""')}"`;
        })
        .join(',')
    );

    const csvContent = [headerRow, ...dataRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={exportToCSV}
      disabled={disabled || !data || data.length === 0}
      className="inline-flex items-center gap-2 rounded-md bg-panel border border-gray-800 text-gray-300 hover:text-gray-150 hover:bg-gray-800/80 px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Download className="w-4 h-4" />
      Export CSV
    </button>
  );
};

export default CSVExportButton;
