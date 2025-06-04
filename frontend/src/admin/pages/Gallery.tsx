import { useState, useEffect, useRef } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { Plus, Eye, Pencil, Trash2, Upload, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface GalleryItem {
  id: number;
  title: string;
  image: string;
  description: string;
  published: boolean;
}

interface Column {
  key: keyof GalleryItem | 'actions';
  label: string;
  render?: (value: unknown, item?: GalleryItem) => React.ReactNode;
}

const Gallery = () => {
  const { user: connectedUser } = useAuth();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<GalleryItem | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if user has admin privileges 
  const isAdmin = connectedUser?.roles?.some(role => {
    const cleanRole = role.replace('ROLE_', '');
    return cleanRole === 'SUPER_ADMIN' || cleanRole === 'ADMIN' || role === 'ROLE_SUPER_ADMIN' || role === 'ROLE_ADMIN';
  });

  const columns: Column[] = [
    { key: 'title' as keyof GalleryItem, label: 'Title' },
    { 
      key: 'description' as keyof GalleryItem, 
      label: 'Description',
      render: (value: unknown) => (
        <div className="max-w-md">
          <p className="truncate" title={value as string}>
            {value as string}
          </p>
        </div>
      )
    },
    { 
      key: 'image' as keyof GalleryItem, 
      label: 'Image',
      render: (value: unknown) => (
        value ? (
          <img
            src={`https://127.0.0.1:8000${value as string}`}
            alt="Gallery"
            className="h-16 w-16 object-contain rounded"
          />
        ) : (
          <span className="text-gray-500">No image</span>
        )
      )
    },
    {
      key: 'published' as keyof GalleryItem,
      label: 'Published',
      render: (value: unknown) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' 
            : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
        }`}>
          {value ? 'Yes' : 'No'}
        </span>
      ),
    },
    ...(isAdmin ? [{
      key: 'actions' as keyof GalleryItem,
      label: 'Actions',
      render: (_: unknown, item?: GalleryItem) => {
        if (!item) return null;
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleTogglePublish(item)}
              className={`p-2 rounded-full transition-colors ${
                item.published
                  ? 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30'
                  : 'text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              title={item.published ? 'Unpublish' : 'Publish'}
            >
              <Eye className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleEdit(item)}
              className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors dark:text-blue-400 dark:hover:bg-blue-900/30"
              title="Edit"
            >
              <Pencil className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleDelete(item)}
              className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors dark:text-red-400 dark:hover:bg-red-900/30"
              title="Delete"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        );
      },
    }] : []),
  ];

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('https://127.0.0.1:8000/api/admin/gallery', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch gallery items');
      }
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setSelectedItem(item);
    setImagePreview(item.image ? `https://127.0.0.1:8000${item.image}` : null);
    setShowModal(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        // Update form data with base64 string
        if (selectedItem) {
          setSelectedItem({
            ...selectedItem,
            image: base64String
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async (item: GalleryItem) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      const response = await fetch(`https://127.0.0.1:8000/api/admin/gallery/${itemToDelete.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete gallery item');
      }
      fetchItems();
    } catch (error) {
      console.error('Error deleting gallery item:', error);
    } finally {
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const itemData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      image: imagePreview || selectedItem?.image || '',
      published: formData.get('published') === 'true'
    };

    try {
      if (selectedItem) {
        const response = await fetch(`https://127.0.0.1:8000/api/admin/gallery/${selectedItem.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(itemData),
        });
        if (!response.ok) {
          throw new Error('Failed to update gallery item');
        }
      } else {
        const response = await fetch('https://127.0.0.1:8000/api/admin/gallery', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(itemData),
        });
        if (!response.ok) {
          throw new Error('Failed to create gallery item');
        }
      }
      setShowModal(false);
      setImagePreview(null);
      fetchItems();
    } catch (error) {
      console.error('Error saving gallery item:', error);
    }
  };

  const handleTogglePublish = async (item: GalleryItem) => {
    try {
      const response = await fetch(`https://127.0.0.1:8000/api/admin/gallery/${item.id}/toggle-publish`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to toggle publish status');
      }
      
      fetchItems();
    } catch (error) {
      console.error('Error toggling publish status:', error);
    }
  };

  const handleCreate = () => {
    setSelectedItem(null);
    setImagePreview(null);
    setShowModal(true);
  };

  if (loading) {
    return <div className="text-center py-4">Chargement...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-dark-500 dark:text-brand-blanc">
          Gallery
        </h1>
        {isAdmin && (
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-300"
          >
            <Plus className="w-5 h-5" />
            Add Item
          </button>
        )}
      </div>

      <DataTable
        data={items}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onTogglePublish={handleTogglePublish}
        isPublished={(item) => item.published}
      />

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setImagePreview(null);
        }}
        title={selectedItem ? "Edit Item" : "Add Item"}
      >
        <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Titre
            </label>
            <input
              type="text"
              name="title"
              id="title"
              defaultValue={selectedItem?.title}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Description
            </label>
            <textarea
              name="description"
              id="description"
              rows={4}
              defaultValue={selectedItem?.description}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              required
            />
          </div>

          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Image
            </label>
            <div className="mt-1 flex items-center space-x-4">
              <input
                type="file"
                name="image"
                id="image"
                ref={fileInputRef}
                accept="image/png,image/jpeg"
                onChange={handleImageChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md transition-colors"
              >
                <Upload className="w-5 h-5" />
                Choisir une image
              </button>
              {imagePreview && (
                <div className="relative w-20 h-20">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-contain rounded"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Formats acceptés: PNG, JPEG. Taille maximale: 2MB
            </p>
          </div>

          <div>
            <label
              htmlFor="published"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Publié
            </label>
            <select
              name="published"
              id="published"
              defaultValue={selectedItem?.published.toString() || "false"}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setImagePreview(null);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 rounded-md transition-all duration-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-md transition-all duration-300"
            >
              <span>{selectedItem ? 'Mettre à jour' : 'Créer'}</span>
            </button>
          </div>
        </form>
      </Modal>

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Item"
        itemName={itemToDelete?.title || ''}
      />
    </div>
  );
};

export default Gallery; 