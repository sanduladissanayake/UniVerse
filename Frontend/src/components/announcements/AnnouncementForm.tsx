import React, { useState, useEffect } from 'react';
import { Announcement } from '../../types';

interface AnnouncementFormProps {
  announcement?: (Announcement & { id: number }) | null;
  clubId: number;
  createdBy: number;
  onSubmit: (data: Partial<Announcement>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({
  announcement,
  clubId,
  createdBy,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (announcement) {
      setTitle(announcement.title);
      setContent(announcement.content);
    } else {
      setTitle('');
      setContent('');
    }
    setErrors({});
  }, [announcement]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!content.trim()) {
      newErrors.content = 'Content is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const data: Partial<Announcement> = {
      title: title.trim(),
      content: content.trim(),
      clubId,
      createdBy,
    };

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">
        {announcement ? 'Edit Announcement' : 'Create New Announcement'}
      </h2>

      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-700 font-semibold mb-2">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter announcement title"
          disabled={isLoading}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title}</p>
        )}
      </div>

      <div className="mb-6">
        <label htmlFor="content" className="block text-gray-700 font-semibold mb-2">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
            errors.content ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter announcement content"
          disabled={isLoading}
        />
        {errors.content && (
          <p className="text-red-500 text-sm mt-1">{errors.content}</p>
        )}
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
        >
          {isLoading ? 'Saving...' : announcement ? 'Update Announcement' : 'Create Announcement'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed font-semibold"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AnnouncementForm;
