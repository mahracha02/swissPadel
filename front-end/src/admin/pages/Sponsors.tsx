import { useState, useEffect, useRef } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { useTheme } from '../../contexts/ThemeContext';
import { Plus, Eye, Pencil, Trash2, Upload, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
interface Sponsor {
  id: number;
  name: string;
  description: string;
  image: string;
  site_url: string;
  published: boolean;
}

const Sponsors = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSponsor, setCurrentSponsor] = useState<Sponsor | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [sponsorToDelete, setSponsorToDelete] = useState<Sponsor | null>(null);
  const { theme } = useTheme();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user: connectedUser } = useAuth();

  const isAdmin = connectedUser?.roles?.some(role => {
    const cleanRole = role.replace('ROLE_', '');
    return cleanRole === 'SUPER_ADMIN' || cleanRole === 'ADMIN' || role === 'ROLE_SUPER_ADMIN' || role === 'ROLE_ADMIN';
  });

  const columns = [
    { key: 'name' as keyof Sponsor, label: 'Nom' },
    { 
      key: 'description' as keyof Sponsor, 
      label: 'Description',
      render: (value: string) => (
        <div className="max-w-md">
          <p className="truncate" title={value}>
            {value}
          </p>
        </div>
      )
    },
    { 
      key: 'image' as keyof Sponsor, 
      label: 'Image',
      render: (value: string) => (
        value ? (
          <img
            src={`https://127.0.0.1:8000${value}`}
            alt="Sponsor"
            className="h-16 w-16 object-contain rounded"
          />
        ) : (
          <span className="text-gray-500">Pas d'image</span>
        )
      )
    },
    {
      key: 'site_url' as keyof Sponsor,
      label: 'Site Web',
      render: (value: string) => (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-600 hover:text-primary-800"
        >
          {value}
        </a>
      )
    },
    {
      key: 'published' as keyof Sponsor,
      label: 'Publié',
      render: (value: boolean) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' 
            : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
        }`}>
          {value ? 'Oui' : 'Non'}
        </span>
      )
    },
    ...(isAdmin ? [{
      key: 'actions' as keyof Sponsor,
      label: 'Actions',
      render: (value: any, item?: Sponsor) => {
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

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    try {
      const response = await fetch('https://127.0.0.1:8000/api/admin/sponsors');
      if (!response.ok) {
        throw new Error('Failed to fetch sponsors');
      }
      const data = await response.json();
      setSponsors(data);
    } catch (error) {
      console.error('Error fetching sponsors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (sponsor: Sponsor) => {
    setCurrentSponsor(sponsor);
    setPreviewImage(sponsor.image ? `https://127.0.0.1:8000${sponsor.image}` : null);
    setIsModalOpen(true);
  };

  const handleDelete = async (sponsor: Sponsor) => {
    setSponsorToDelete(sponsor);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!sponsorToDelete) return;

    try {
      const response = await fetch(`https://127.0.0.1:8000/api/admin/sponsors/${sponsorToDelete.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete sponsor');
      }
      fetchSponsors();
    } catch (error) {
      console.error('Error deleting sponsor:', error);
    } finally {
      setDeleteModalOpen(false);
      setSponsorToDelete(null);
    }
  };

  const handleTogglePublish = async (sponsor: Sponsor) => {
    try {
      const response = await fetch(`https://127.0.0.1:8000/api/admin/sponsors/${sponsor.id}/toggle-publish`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to toggle publish status');
      }
      
      fetchSponsors();
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
        // Update form data with base64 string
        if (currentSponsor) {
          setCurrentSponsor({
            ...currentSponsor,
            image: base64String
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const sponsorData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      image: previewImage || currentSponsor?.image || '',
      site_url: formData.get('site_url') as string,
      published: formData.get('published') === 'true'
    };

    try {
      if (currentSponsor) {
        const response = await fetch(`https://127.0.0.1:8000/api/admin/sponsors/${currentSponsor.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(sponsorData),
        });
        if (!response.ok) {
          throw new Error('Failed to update sponsor');
        }
      } else {
        const response = await fetch('https://127.0.0.1:8000/api/admin/sponsors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(sponsorData),
        });
        if (!response.ok) {
          throw new Error('Failed to create sponsor');
        }
      }
      setIsModalOpen(false);
      setPreviewImage(null);
      fetchSponsors();
    } catch (error) {
      console.error('Error saving sponsor:', error);
    }
  };

  const handleCreate = () => {
    setCurrentSponsor(null);
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
          Sponsors
        </h1>
        {isAdmin && (
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-300"
          >
          <Plus className="w-5 h-5" />
            Ajouter un sponsor
          </button>
        )}
      </div>

      <DataTable
        data={sponsors}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onTogglePublish={handleTogglePublish}
        isPublished={(sponsor) => sponsor.published}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setPreviewImage(null);
        }}
        title={currentSponsor ? "Modifier le Sponsor" : "Ajouter un Sponsor"}
      >
        <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Nom
            </label>
            <input
              type="text"
              name="name"
              id="name"
              defaultValue={currentSponsor?.name}
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
              defaultValue={currentSponsor?.description}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              required
            />
          </div>

          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Logo
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
              htmlFor="site_url"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              URL du site web
            </label>
            <input
              type="text"
              name="site_url"
              id="site_url"
              defaultValue={currentSponsor?.site_url}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              required
            />
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
              defaultValue={currentSponsor?.published.toString() || "false"}
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
              <span>{currentSponsor ? 'Mettre à jour' : 'Créer'}</span>
            </button>
          </div>
        </form>
      </Modal>

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSponsorToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Supprimer le sponsor"
        itemName={sponsorToDelete?.name || ''}
      />
    </div>
  );
};

export default Sponsors; 