import React from 'react';
import { Announcement } from '../../types';
import AnnouncementCard from './AnnouncementCard';

interface AnnouncementListProps {
  announcements: (Announcement & { id: number })[];
  onEdit?: (announcement: Announcement & { id: number }) => void;
  onDelete?: (id: number) => void;
  onPublish?: (id: number) => void;
  onUnpublish?: (id: number) => void;
  isAdmin?: boolean;
  isLoading?: boolean;
}

const AnnouncementList: React.FC<AnnouncementListProps> = ({
  announcements,
  onEdit,
  onDelete,
  onPublish,
  onUnpublish,
  isAdmin = false,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          {isAdmin
            ? 'No announcements yet. Create your first announcement!'
            : 'No announcements from this club yet.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {announcements.map((announcement) => (
        <AnnouncementCard
          key={announcement.id}
          announcement={announcement}
          onEdit={onEdit}
          onDelete={onDelete}
          onPublish={onPublish}
          onUnpublish={onUnpublish}
          isAdmin={isAdmin}
        />
      ))}
    </div>
  );
};

export default AnnouncementList;
