import { useState, useEffect, useRef } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { Plus, Eye, Pencil, Trash2, Upload, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface ParticularService {
  id: number;
  title: string;
  description: string;
  price: number;
  duration: string;
  image: string;
  published: boolean;
  createdAt: string;
}

export default function ParticularServices() {
  const [services, setServices] = useState<ParticularService[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState<ParticularService | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<ParticularService | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user: connectedUser } = useAuth();

  const isAdmin = connectedUser?.roles?.some(role => {
    const cleanRole = role.replace('ROLE_', '');
    return cleanRole === 'SUPER_ADMIN' || cleanRole === 'ADMIN' || role === 'ROLE_SUPER_ADMIN' || role === 'ROLE_ADMIN';
  });

  const columns = [
    { 
      key: 'title' as keyof ParticularService, 
      label: 'Titre',
      render: (value: string) => (
        <div className="max-w-md">
          <p className="truncate" title={value}>
            {value}
          </p>
        </div>
      ),
    },
    { 
      key: 'description' as keyof ParticularService, 
      label: 'Description',
      render: (value: string) => (
        <div className="max-w-md">
          <p className="truncate" title={value}>
            {value}
          </p>
        </div>
      ),
    },
    { 
      key: 'price' as keyof ParticularService, 
      label: 'Prix',
      render: (value: number) => (
        <span className="font-medium">
          {value.toFixed(2)} CHF
        </span>
      ),
    },
    { 
      key: 'duration' as keyof ParticularService, 
      label: 'Durée',
    },
    { 
      key: 'image' as keyof ParticularService, 
      label: 'Image',
      render: (value: string) => (
        value ? (
          <img
            src={`https://127.0.0.1:8000${value}`}
            alt="Particular Service"
            className="h-16 w-16 object-contain rounded"
          />
        ) : (
          <span className="text-gray-500">Pas d'image</span>
        )
      )
    },
    {
      key: 'published' as keyof ParticularService,
      label: 'Publié',
      render: (value: boolean) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' 
            : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
        }`}>
          {value ? 'Oui' : 'Non'}
        </span>
      ),
    },
    ...(isAdmin ? [{
      key: 'actions' as keyof ParticularService,
      label: 'Actions',
      render: (_: unknown, item?: ParticularService) => {
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
              title={item.published ? 'Dépublier' : 'Publier'}
            >
              <Eye className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleEdit(item)}
              className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors dark:text-blue-400 dark:hover:bg-blue-900/30"
              title="Modifier"
            >
              <Pencil className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleDelete(item)}
              className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors dark:text-red-400 dark:hover:bg-red-900/30"
              title="Supprimer"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        );
      },
    }] : []),
  ];

  const fetchServices = async () => {
    try {
      const response = await fetch('https://127.0.0.1:8000/api/admin/particular-services');
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleEdit = (service: ParticularService) => {
    setCurrentService(service);
    setPreviewImage(service.image ? `https://127.0.0.1:8000${service.image}` : null);
    setIsModalOpen(true);
  };

  const handleDelete = (service: ParticularService) => {
    setServiceToDelete(service);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!serviceToDelete) return;

    try {
      const response = await fetch(`https://127.0.0.1:8000/api/admin/particular-services/${serviceToDelete.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete service');
      }
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
    } finally {
      setDeleteModalOpen(false);
      setServiceToDelete(null);
    }
  };

  const handleTogglePublish = async (service: ParticularService) => {
    try {
      const response = await fetch(`https://127.0.0.1:8000/api/admin/particular-services/${service.id}/toggle-publish`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to toggle publish status');
      }
      
      fetchServices();
    } catch (error) {
      console.error('Error toggling publish status:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const serviceData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      duration: formData.get('duration') as string,
      image: previewImage || currentService?.image || '',
      published: formData.get('published') === 'true'
    };

    try {
      if (currentService) {
        const response = await fetch(`https://127.0.0.1:8000/api/admin/particular-services/${currentService.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(serviceData),
        });
        if (!response.ok) {
          throw new Error('Failed to update service');
        }
      } else {
        const response = await fetch('https://127.0.0.1:8000/api/admin/particular-services', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(serviceData),
        });
        if (!response.ok) {
          throw new Error('Failed to create service');
        }
      }
      setIsModalOpen(false);
      setPreviewImage(null);
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const handleCreate = () => {
    setCurrentService(null);
    setPreviewImage(null);
    setIsModalOpen(true);
  };

  if (loading) {
    return <div className="text-center py-4">Chargement...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-dark-500 dark:text-brand-blanc">
          Services Particuliers
        </h1>
        {isAdmin && (
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-300"
          >
          <Plus className="w-5 h-5" />
            Ajouter un service
          </button>
        )}
      </div>

      <DataTable
        data={services}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onTogglePublish={handleTogglePublish}
        isPublished={(service) => service.published}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setPreviewImage(null);
        }}
        title={currentService ? "Modifier le Service" : "Ajouter un Service"}
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
              defaultValue={currentService?.title}
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
              defaultValue={currentService?.description}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              required
            />
          </div>

          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Prix (CHF)
            </label>
            <input
              type="number"
              name="price"
              id="price"
              defaultValue={currentService?.price}
              min="0"
              step="0.01"
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              required
            />
          </div>

          <div>
            <label
              htmlFor="duration"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Durée
            </label>
            <input
              type="text"
              name="duration"
              id="duration"
              defaultValue={currentService?.duration}
              placeholder="e.g., 1 heure, 2 heures"
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
              {previewImage && (
                <div className="relative w-20 h-20">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-contain rounded"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewImage(null);
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
              defaultValue={currentService?.published.toString() || "false"}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            >
              <option value="true">Oui</option>
              <option value="false">Non</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setPreviewImage(null);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 rounded-md transition-all duration-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-md transition-all duration-300"
            >
              <span>{currentService ? 'Mettre à jour' : 'Créer'}</span>
            </button>
          </div>
        </form>
      </Modal>

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setServiceToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Supprimer le service"
        itemName={serviceToDelete?.title || ''}
      />
    </div>
  );
} 