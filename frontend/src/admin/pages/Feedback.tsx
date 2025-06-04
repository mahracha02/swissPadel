import { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { useTheme } from '../../contexts/ThemeContext';
import { Plus } from 'lucide-react';

interface Feedback {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  status: 'pending' | 'read' | 'replied';
}

type FeedbackFormData = Omit<Feedback, 'id' | 'createdAt'>;

// Temporary mock service until the real one is implemented
const feedbackService = {
  getAll: async () => {
    // Mock data
    return [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Great service!',
        createdAt: '2024-03-20T10:00:00Z',
        status: 'pending' as const,
      },
    ];
  },
  update: async (id: number, data: FeedbackFormData) => {
    console.log('Updating feedback:', id, data);
  },
  delete: async (id: number) => {
    console.log('Deleting feedback:', id);
  },
};

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<Feedback | null>(null);
  const { theme } = useTheme();

  const columns = [
    { key: 'name' as keyof Feedback, label: 'Name' },
    { key: 'email' as keyof Feedback, label: 'Email' },
    { key: 'message' as keyof Feedback, label: 'Message' },
    {
      key: 'status' as keyof Feedback,
      label: 'Status',
      render: (value: string) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            value === 'replied'
              ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
              : value === 'read'
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
          }`}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
  ];

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const data = await feedbackService.getAll();
      setFeedbacks(data);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (feedback: Feedback) => {
    setCurrentFeedback(feedback);
    setIsModalOpen(true);
  };

  const handleDelete = async (feedback: Feedback) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        await feedbackService.delete(feedback.id);
        fetchFeedbacks();
      } catch (error) {
        console.error('Error deleting feedback:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const feedbackData: FeedbackFormData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
      status: formData.get('status') as 'pending' | 'read' | 'replied',
    };

    try {
      if (currentFeedback) {
        await feedbackService.update(currentFeedback.id, feedbackData);
      }
      setIsModalOpen(false);
      fetchFeedbacks();
    } catch (error) {
      console.error('Error saving feedback:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-dark-500 dark:text-brand-blanc">Feedback</h1>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-300"
        >
          <Plus className="w-5 h-5" />
          Create Feedback
        </button>
      </div>

      <DataTable
        data={feedbacks}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="View Feedback"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-dark-500 dark:text-brand-blanc"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              defaultValue={currentFeedback?.name}
              disabled
              className="mt-1 block w-full rounded-md border-primary-200 dark:border-primary-700 shadow-sm bg-gray-50 dark:bg-dark-700 text-gray-500 dark:text-gray-400 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-dark-500 dark:text-brand-blanc"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              defaultValue={currentFeedback?.email}
              disabled
              className="mt-1 block w-full rounded-md border-primary-200 dark:border-primary-700 shadow-sm bg-gray-50 dark:bg-dark-700 text-gray-500 dark:text-gray-400 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-dark-500 dark:text-brand-blanc"
            >
              Message
            </label>
            <textarea
              name="message"
              id="message"
              rows={4}
              defaultValue={currentFeedback?.message}
              disabled
              className="mt-1 block w-full rounded-md border-primary-200 dark:border-primary-700 shadow-sm bg-gray-50 dark:bg-dark-700 text-gray-500 dark:text-gray-400 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-dark-500 dark:text-brand-blanc"
            >
              Status
            </label>
            <select
              name="status"
              id="status"
              defaultValue={currentFeedback?.status}
              className="mt-1 block w-full rounded-md border-primary-200 dark:border-primary-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-dark-600 dark:text-brand-blanc sm:text-sm"
            >
              <option value="pending">Pending</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-dark-500 bg-primary-100 hover:bg-primary-200 rounded-md transition-all duration-300 hover:scale-105"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-dark-500 bg-secondary-500 hover:bg-secondary-600 rounded-md transition-all duration-300 hover:scale-105"
            >
              Update Status
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Feedback; 