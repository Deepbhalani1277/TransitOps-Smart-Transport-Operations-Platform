import React from 'react';
import SkeletonRow from './SkeletonRow';
import EmptyState from './EmptyState';

export interface ColumnDef<T> {
  header: string;
  accessor: (row: T) => React.ReactNode;
  cellClassName?: string;
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[] | undefined;
  isLoading: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionButton?: React.ReactNode;
  keyExtractor: (row: T) => string | number;
}

function DataTable<T>({
  columns,
  data,
  isLoading,
  emptyTitle = 'No data available',
  emptyDescription = 'There are no records to display.',
  emptyActionButton,
  keyExtractor,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="bg-panel border border-gray-800 rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-gray-900/50">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {Array.from({ length: 5 }).map((_, idx) => (
              <SkeletonRow key={idx} cols={columns.length} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionButton={emptyActionButton}
      />
    );
  }

  return (
    <div className="bg-panel border border-gray-800 rounded-lg overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-800">
        <thead className="bg-gray-900/50">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800 text-sm text-gray-300">
          {data.map((row) => (
            <tr key={keyExtractor(row)} className="hover:bg-gray-900/30 transition-colors">
              {columns.map((col, idx) => (
                <td
                  key={idx}
                  className={`px-6 py-4 whitespace-nowrap ${col.cellClassName || ''}`}
                >
                  {col.accessor(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
