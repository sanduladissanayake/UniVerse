import React from 'react';
import { Announcement } from '../../types';

interface AnnouncementCardProps {
  announcement: Announcement & { id: number };
  onEdit?: (announcement: Announcement & { id: number }) => void;
  onDelete?: (id: number) => void;
  onPublish?: (id: number) => void;
  onUnpublish?: (id: number) => void;
  isAdmin?: boolean;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  announcement,
  onEdit,
  onDelete,
  onPublish,
  onUnpublish,
  isAdmin = false,
}) => {
  const formatDate = (date: string | Date | null | undefined) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 border-l-4 border-blue-500">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">{announcement.title}</h3>
          <p className="text-sm text-gray-500">
            Posted on {formatDate(announcement.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                announcement.isPublished
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {announcement.isPublished ? 'Published' : 'Draft'}
            </span>
          )}
        </div>
      </div>

      <p className="text-gray-700 mb-4 whitespace-pre-wrap">{announcement.content}</p>

      {isAdmin && (
        <div className="flex gap-2 pt-4 border-t">
          <button
            onClick={() => onEdit?.(announcement)}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            Edit
          </button>

          {announcement.isPublished ? (
            <button
              onClick={() => onUnpublish?.(announcement.id)}
              className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
            >
              Unpublish
            </button>
          ) : (
            <button
              onClick={() => onPublish?.(announcement.id)}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
            >
              Publish
            </button>
          )}

          <button
            onClick={() => {
              if (
                window.confirm(
                  'Are you sure you want to delete this announcement?'
                )
              ) {
                onDelete?.(announcement.id);
              }
            }}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
          >
            Delete
          </button>
        </div>
      )}

      {!isAdmin && announcement.publishedAt && (
        <p className="text-xs text-gray-400 pt-2">
          Published: {formatDate(announcement.publishedAt)}
        </p>
      )}
    </div>
  );
};

export default AnnouncementCard;
