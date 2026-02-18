import React from 'react';
import { Bell } from 'lucide-react';

interface NotificationBadgeProps {
  count: number;
  onClick: () => void;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ count, onClick }) => {
  if (count === 0) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      className="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-100 hover:bg-red-200 transition-colors"
      title={`${count} unread announcement${count === 1 ? '' : 's'}`}
    >
      <Bell className="w-5 h-5 text-red-600" />
      <span className="absolute inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full top-0 right-0 min-w-max">
        {count}
      </span>
    </button>
  );
};

export default NotificationBadge;
