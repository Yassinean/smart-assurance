
import { cn } from '@/lib/utils';
import { ApplicationStatus, ConnectionStatus } from '@/lib/types';

interface StatusBadgeProps {
  status: ApplicationStatus | ConnectionStatus;
  size?: 'sm' | 'md' | 'lg';
  withDot?: boolean;
  className?: string;
}

export function StatusBadge({ status, size = 'md', withDot = true, className }: StatusBadgeProps) {
  const statusConfig = {
    // Connection statuses
    connected: {
      color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30',
      dotColor: 'bg-green-500',
      label: 'Connected'
    },
    disconnected: {
      color: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30',
      dotColor: 'bg-amber-500',
      label: 'Disconnected'
    },
    error: {
      color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30',
      dotColor: 'bg-red-500',
      label: 'Error'
    },
    
    // Application statuses
    pending: {
      color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30',
      dotColor: 'bg-blue-500',
      label: 'Pending'
    },
    approved: {
      color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30',
      dotColor: 'bg-green-500',
      label: 'Approved'
    },
    rejected: {
      color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30',
      dotColor: 'bg-red-500',
      label: 'Rejected'
    },
    under_review: {
      color: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-900/30',
      dotColor: 'bg-purple-500',
      label: 'Under Review'
    },
    cancelled: {
      color: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-900/30',
      dotColor: 'bg-gray-500',
      label: 'Cancelled'
    },
    active: {
      color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30',
      dotColor: 'bg-green-500',
      label: 'Active'
    },
    expired: {
      color: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-900/30',
      dotColor: 'bg-gray-500',
      label: 'Expired'
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig];
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full border',
        config.color,
        sizeClasses[size],
        className
      )}
    >
      {withDot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full',
            config.dotColor
          )}
          aria-hidden="true"
        />
      )}
      {config.label}
    </span>
  );
}
