import { useState, useEffect, useRef } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { eventsService } from '../../services/events';
import { Plus, Eye, Pencil, Trash2, Upload } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface Event {
  id: number;
  title: string;
  date: string;
  description: string;
  place: string;
  image: string;
  published: boolean;
}

interface Column {
  key: keyof Event | 'actions';
  label: string;
  render?: (value: unknown, item?: Event) => React.ReactNode;
}

const Events = () => {
  const { user: connectedUser } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<Partial<Event>>({
    title: '',
    date: '',
    description: '',
    place: '',
    image: '',
    published: false,
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if user has admin privileges using the same logic as ProfileBanner
  const isAdmin = connectedUser?.roles?.some(role => {
    const cleanRole = role.replace('ROLE_', '');
    return cleanRole === 'SUPER_ADMIN' || cleanRole === 'ADMIN' || role === 'ROLE_SUPER_ADMIN' || role === 'ROLE_ADMIN';
  });

  const fetchEvents = async () => {
    try {
      const data = await eventsService.getAll();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreate = () => {
    setSelectedEvent(null);
    setFormData({
      title: '',
      date: '',
      description: '',
      place: '',
      image: '',
      published: false,
    });
    setImagePreview(null);
    setShowModal(true);
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      date: event.date,
      description: event.description,
      place: event.place,
      image: event.image,
      published: event.published,
    });
    setImagePreview(event.image ? `https://127.0.0.1:8000${event.image}` : null);
    setShowModal(true);
  };

  const handleDelete = async (event: Event) => {
    setEventToDelete(event);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!eventToDelete) return;

    try {
      await eventsService.delete(eventToDelete.id);
      await fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    } finally {
      setDeleteModalOpen(false);
      setEventToDelete(null);
    }
  };

  const handleTogglePublish = async (event: Event) => {
    try {
      await eventsService.togglePublish(event.id);
      await fetchEvents();
    } catch (error) {
      console.error('Error toggling event publish status:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setFormData(prev => ({ ...prev, image: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedEvent) {
        await eventsService.update(selectedEvent.id, formData);
      } else {
        await eventsService.create(formData);
      }
      setShowModal(false);
      await fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const columns: Column[] = [
    { key: 'title', label: 'Title' },
    { key: 'date', label: 'Date' },
    { key: 'place', label: 'Place' },
    {
      key: 'image',
      label: 'Image',
      render: (value: unknown) => {
        const imageUrl = value as string;
        return imageUrl ? (
          <img 
            src={`https://127.0.0.1:8000${imageUrl}`} 
            alt="Event" 
            className="w-16 h-16 object-cover rounded-lg"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <span className="text-gray-400 dark:text-gray-500">No image</span>
          </div>
        );
      },
    },
    {
      key: 'published',
      label: 'Published',
      render: (value: unknown) => {
        const isPublished = value as boolean;
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            isPublished 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' 
              : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
          }`}>
            {isPublished ? 'Oui' : 'Non'}
          </span>
        );
      },
    },
    ...(isAdmin ? [{
      key: 'actions' as const,
      label: 'Actions',
      render: (_: unknown, item?: Event) => {
        if (!item) return null;
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleTogglePublish(item)}
              className={`p-1 rounded-md transition-colors duration-200 ${
                item.published
                  ? 'text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/50'
                  : 'text-gray-400 hover:bg-gray-100 dark:text-gray-500 dark:hover:bg-gray-700'
              }`}
              title={item.published ? 'Dépublier' : 'Publier'}
            >
              <Eye className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleEdit(item)}
              className="p-1 text-blue-600 hover:bg-blue-100 rounded-md transition-colors duration-200 dark:text-blue-400 dark:hover:bg-blue-900/50"
              title="Modifier"
            >
              <Pencil className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleDelete(item)}
              className="p-1 text-red-600 hover:bg-red-100 rounded-md transition-colors duration-200 dark:text-red-400 dark:hover:bg-red-900/50"
              title="Supprimer"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        );
      },
    }] : []),
  ];

  if (loading) {
    return <div className="text-center py-4">Chargement...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-dark-500 dark:text-brand-blanc">Events</h1>
        {isAdmin && (
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-300"
          >
            <Plus className="w-5 h-5" />
            Create Event
          </button>
        )}
      </div>

      <DataTable
        data={events}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onTogglePublish={handleTogglePublish}
        isPublished={(event) => event.published}
      />

      {isAdmin && (
        <>
          <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title={selectedEvent ? 'Edit Event' : 'Create Event'}
          >
            <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Date</label>
                <input
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Place</label>
                <input
                  type="text"
                  value={formData.place}
                  onChange={(e) => setFormData({ ...formData, place: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Image</label>
                <div className="mt-1 flex items-center gap-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300"
                    >
                      <Upload className="w-5 h-5" />
                      Choose Image
                    </button>
                  </div>
                  {imagePreview && (
                    <div className="relative w-24 h-24">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setFormData(prev => ({ ...prev, image: '' }));
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <label className="ml-2 block text-sm text-gray-700 dark:text-gray-200">Published</label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 rounded-md transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-md transition-all duration-300"
                >
                  {selectedEvent ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </Modal>

          <DeleteConfirmationModal
            isOpen={deleteModalOpen}
            onClose={() => {
              setDeleteModalOpen(false);
              setEventToDelete(null);
            }}
            onConfirm={handleConfirmDelete}
            title="Supprimer l'événement"
            itemName={eventToDelete?.title || ''}
          />
        </>
      )}
    </div>
  );
};

export default Events; 