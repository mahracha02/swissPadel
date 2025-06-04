import { useState, useEffect, useRef } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { Plus, Eye, Pencil, Trash2, Upload, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface Partner {
  id: number;
  name: string;
  image: string;
  site_url: string;
  published: boolean;
}

const Partners = () => {
  const { user: connectedUser } = useAuth();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [partnerToDelete, setPartnerToDelete] = useState<Partner | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if user has admin privileges using the same logic as ProfileBanner
  const isAdmin = connectedUser?.roles?.some(role => {
    const cleanRole = role.replace('ROLE_', '');
    return cleanRole === 'SUPER_ADMIN' || cleanRole === 'ADMIN' || role === 'ROLE_SUPER_ADMIN' || role === 'ROLE_ADMIN';
  });

  const handleCreate = () => {
    setSelectedPartner(null);
    setImagePreview(null);
    setShowModal(true);
  };

  const handleEdit = (partner: Partner) => {
    setSelectedPartner(partner);
    setImagePreview(partner.image ? `https://127.0.0.1:8000${partner.image}` : null);
    setShowModal(true);
  };

  const handleDelete = (partner: Partner) => {
    setPartnerToDelete(partner);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!partnerToDelete) return;

    try {
      const response = await fetch(`https://127.0.0.1:8000/api/admin/partners/${partnerToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete partner');
      }

      await fetchPartners();
    } catch (error) {
      console.error('Error deleting partner:', error);
    } finally {
      setDeleteModalOpen(false);
      setPartnerToDelete(null);
    }
  };

  const handleTogglePublish = async (partner: Partner) => {
    try {
      const response = await fetch(`https://127.0.0.1:8000/api/admin/partners/${partner.id}/toggle-publish`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to toggle partner publish status');
      }

      await fetchPartners();
    } catch (error) {
      console.error('Error toggling partner publish status:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        if (selectedPartner) {
          setSelectedPartner({
            ...selectedPartner,
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

    const partnerData = {
      name: formData.get('name') as string,
      image: imagePreview || selectedPartner?.image || '',
      site_url: formData.get('site_url') as string,
      published: formData.get('published') === 'true'
    };

    try {
      const url = selectedPartner 
        ? `https://127.0.0.1:8000/api/admin/partners/${selectedPartner.id}`
        : 'https://127.0.0.1:8000/api/admin/partners/new';
      
      const response = await fetch(url, {
        method: selectedPartner ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(partnerData),
      });

      if (!response.ok) {
        throw new Error('Failed to save partner');
      }

      setShowModal(false);
      await fetchPartners();
    } catch (error) {
      console.error('Error saving partner:', error);
    }
  };

  const fetchPartners = async () => {
    try {
      const response = await fetch('https://127.0.0.1:8000/api/admin/partners');
      if (!response.ok) {
        throw new Error('Failed to fetch partners');
      }
      const data = await response.json();
      setPartners(data);
    } catch (error) {
      console.error('Error fetching partners:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const columns = [
    { key: 'name' as keyof Partner, label: 'Name' },
    {
      key: 'image' as keyof Partner,
      label: 'Image',
      render: (value: string) => (
        value ? (
          <img 
            src={`https://127.0.0.1:8000${value}`} 
            alt="Partner" 
            className="w-16 h-16 object-cover rounded-lg"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <span className="text-gray-400 dark:text-gray-500">No image</span>
          </div>
        )
      ),
    },
    { key: 'site_url' as keyof Partner, label: 'Website' },
    {
      key: 'published' as keyof Partner,
      label: 'Published',
      render: (value: boolean) => (
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
      key: 'actions' as keyof Partner,
      label: 'Actions',
      render: (_: unknown, item?: Partner) => {
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

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-dark-500 dark:text-brand-blanc">Partners</h1>
        {isAdmin && (
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-300"
          >
            <Plus className="w-5 h-5" />
            Add Partner
          </button>
        )}
      </div>

      <DataTable
        data={partners}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onTogglePublish={handleTogglePublish}
        isPublished={(partner) => partner.published}
      />

      {isAdmin && (
        <>
          <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title={selectedPartner ? 'Edit Partner' : 'Add Partner'}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={selectedPartner?.name}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Website URL</label>
                <input
                  type="url"
                  name="site_url"
                  defaultValue={selectedPartner?.site_url}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
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
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="published"
                  defaultChecked={selectedPartner?.published}
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
                  {selectedPartner ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </Modal>

          <DeleteConfirmationModal
            isOpen={deleteModalOpen}
            onClose={() => {
              setDeleteModalOpen(false);
              setPartnerToDelete(null);
            }}
            onConfirm={handleConfirmDelete}
            title="Delete Partner"
            itemName={partnerToDelete?.name || ''}
          />
        </>
      )}
    </div>
  );
};

export default Partners; 