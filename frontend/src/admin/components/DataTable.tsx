import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface Column<T> {
  key: keyof T | 'actions';
  label: string;
  render?: (value: any, item?: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onTogglePublish?: (item: T) => void;
  isPublished?: (item: T) => boolean;
  itemsPerPage?: number;
}

const DataTable = <T extends { id: number }>({ 
  data, 
  columns, 
  loading,
  onEdit, 
  onDelete,
  onTogglePublish,
  isPublished 
}: DataTableProps<T>) => {
  const { theme } = useTheme();

  if (loading) {
    return <div className="text-center py-4">Chargement...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-900 dark:text-gray-200 uppercase tracking-wider"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((item) => (
            <tr 
              key={item.id} 
              className={`hover:bg-gray-50 dark:hover:bg-gray-800 ${
                isPublished && !isPublished(item) ? 'opacity-50' : ''
              }`}
            >
              {columns.map((column) => (
                <td 
                  key={String(column.key)} 
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200"
                >
                  {column.key === 'actions' 
                    ? column.render?.(null, item)
                    : column.render 
                      ? column.render(item[column.key as keyof T], item)
                      : String(item[column.key as keyof T])
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable; 