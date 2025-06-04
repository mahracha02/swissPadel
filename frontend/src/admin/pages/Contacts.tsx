import { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { useTheme } from '../../contexts/ThemeContext';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface Contact {
  id: number;
  fullName: string;
  email: string;
  message: string;
  status: boolean | null;
}

interface ContactFormData {
  fullName: string;
  email: string;
  message: string;
  status: boolean | null;
}

interface Column {
  key: keyof Contact | 'actions';
  label: string;
  render?: (value: any, item?: Contact) => React.ReactNode;
}

const Contacts = () => {
  const { user: connectedUser } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    email: '',
    message: '',
    status: null,
  });
  const { theme } = useTheme();

  // Check if user has admin privileges 
  const isAdmin = connectedUser?.roles?.some(role => {
    const cleanRole = role.replace('ROLE_', '');
    return cleanRole === 'SUPER_ADMIN' || cleanRole === 'ADMIN' || role === 'ROLE_SUPER_ADMIN' || role === 'ROLE_ADMIN';
  });

  const columns: Column[] = [
    { key: 'fullName', label: 'Nom' },
    { key: 'email', label: 'Email' },
    { 
      key: 'message', 
      label: 'Message',
      render: (value: string) => (
        <div className="max-w-md">
          <p className="truncate" title={value}>
            {value}
          </p>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Statut',
      render: (value: boolean | null) => {
        let statusText: string;
        let statusClass: string;

        if (value === null) {
          statusText = 'En cours';
          statusClass = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
        } else if (value === true) {
          statusText = 'Traité';
          statusClass = 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
        } else {
          statusText = 'Non traité';
          statusClass = 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
        }

        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClass}`}>
            {statusText}
          </span>
        );
      }
    },
    ...(isAdmin ? [{
      key: 'actions' as keyof Contact,
      label: 'Actions',
      render: (_: unknown, item?: Contact) => {
        if (!item) return null;
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleToggleStatus(item)}
              className={`p-1 rounded-md transition-colors duration-200 ${
                item.status === true
                  ? 'text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/50'
                  : 'text-gray-400 hover:bg-gray-100 dark:text-gray-500 dark:hover:bg-gray-700'
              }`}
              title={item.status === true ? 'Marquer comme non traité' : 'Marquer comme traité'}
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

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch('https://127.0.0.1:8000/api/admin/contacts');
      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
      }
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (contact: Contact) => {
    setSelectedContact(contact);
    setFormData({
      fullName: contact.fullName,
      email: contact.email,
      message: contact.message,
      status: contact.status,
    });
    setShowModal(true);
  };

  const handleDelete = async (contact: Contact) => {
    setContactToDelete(contact);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!contactToDelete) return;

    try {
      const response = await fetch(`https://127.0.0.1:8000/api/admin/contacts/${contactToDelete.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete contact');
      }
      fetchContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
    } finally {
      setDeleteModalOpen(false);
      setContactToDelete(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        status: formData.status === null ? null : Boolean(formData.status)
      };

      if (selectedContact) {
        const response = await fetch(`https://127.0.0.1:8000/api/admin/contacts/${selectedContact.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(submitData),
        });
        if (!response.ok) {
          throw new Error('Failed to update contact');
        }
      } else {
        const response = await fetch('https://127.0.0.1:8000/api/admin/contacts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(submitData),
        });
        if (!response.ok) {
          throw new Error('Failed to create contact');
        }
      }
      setShowModal(false);
      fetchContacts();
    } catch (error) {
      console.error('Error saving contact:', error);
    }
  };

  const handleToggleStatus = async (contact: Contact) => {
    try {
      const response = await fetch(`https://127.0.0.1:8000/api/admin/contacts/${contact.id}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to toggle status');
      }
      
      fetchContacts();
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Chargement...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-dark-500 dark:text-brand-blanc">
          Contacts
        </h1>
      </div>
    
      <DataTable
        data={contacts}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedContact ? 'Edit Contact' : 'Create Contact'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">Message</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">Status</label>
            <select
              value={formData.status === null ? '' : formData.status.toString()}
              onChange={(e) => {
                const value = e.target.value;
                setFormData({
                  ...formData,
                  status: value === '' ? null : value === 'true'
                });
              }}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            >
              <option value="">En cours</option>
              <option value="false">Non traité</option>
              <option value="true">Traité</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-900 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 rounded-md transition-all duration-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-md transition-all duration-300"
            >
              {selectedContact ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </Modal>

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setContactToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Supprimer le contact"
        itemName={contactToDelete?.fullName || ''}
      />
    </div>
  );
};

export default Contacts; 