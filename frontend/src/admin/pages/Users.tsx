import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Crown, Shield, User } from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import del from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  roles: string[];
  phone: string;
}

type UserFormData = Omit<User, 'id'> & {
  password?: string;
};

const Users = () => {
  const { user: connectedUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const columns = [
    { 
      key: 'first_name' as keyof User, 
      label: 'Prénom',
      render: (value: unknown, item?: User) => {
        const isConnectedUser = item?.email === connectedUser?.email;
        return (
          <div className={`flex items-center gap-2 ${isConnectedUser ? 'font-bold' : ''}`}>
            {String(value)}
            {isConnectedUser && (
              <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                Vous
              </span>
            )}
          </div>
        );
      }
    },
    { 
      key: 'last_name' as keyof User, 
      label: 'Nom',
    },
    { 
      key: 'email' as keyof User, 
      label: 'Email',
    },
    {
      key: 'roles' as keyof User,
      label: 'Rôle',
      render: (value: unknown) => {
        const roles = Array.isArray(value) ? value : [];
        // Get the primary role (first non-ROLE_USER role)
        const primaryRole = roles.find(role => role !== 'ROLE_USER') || 'ROLE_USER';
        
        // Remove ROLE_ prefix for display
        const displayRole = primaryRole.replace('ROLE_', '');
        let badgeClass = "px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ";
        let Icon = User;
        
        // Different styles and icons based on role
        if (primaryRole === 'ROLE_SUPER_ADMIN') {
          badgeClass += "bg-gradient-to-r from-[#c5ff32] to-[#a3d429] text-black shadow-md";
          Icon = Crown;
        } else if (primaryRole === 'ROLE_ADMIN') {
          badgeClass += "bg-gradient-to-r from-[#c5ff32]/80 to-[#a3d429]/80 text-black";
          Icon = Shield;
        } else {
          badgeClass += "bg-[#c5ff32]/60 text-black";
          Icon = User;
        }

        return (
          <span className={badgeClass}>
            <Icon className="w-3.5 h-3.5" />
            {displayRole}
          </span>
        );
      }
    },
    { 
      key: 'phone' as keyof User, 
      label: 'Téléphone',
    },
    {
      key: 'actions' as keyof User,
      label: 'Actions',
      render: (_: unknown, item?: User) => {
        if (!item) return null;
        return (
          <div className="flex items-center gap-2">
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
    },
  ];

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://127.0.0.1:8000/api/admin/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      const response = await fetch(`https://127.0.0.1:8000/api/admin/users/${userToDelete.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const userData: UserFormData = {
      email: formData.get('email') as string,
      first_name: formData.get('first_name') as string,
      last_name: formData.get('last_name') as string,
      phone: formData.get('phone') as string,
      roles: (formData.get('roles') as string).split(',').map(role => role.trim()),
    };

    // Add password only for new users
    if (!selectedUser) {
      userData.password = formData.get('password') as string;
    }

    try {
      const url = selectedUser 
        ? `https://127.0.0.1:8000/api/admin/users/${selectedUser.id}`
        : 'https://127.0.0.1:8000/api/admin/users';
      
      console.log('Sending user data:', userData);
      
      const response = await fetch(url, {
        method: selectedUser ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Server response:', errorData);
        
        // Handle duplicate email error
        if (errorData?.detail?.includes('UNIQ_IDENTIFIER_EMAIL')) {
          throw new Error('Cette adresse email est déjà utilisée par un autre utilisateur.');
        }
        
        throw new Error(errorData?.message || 'Failed to save user');
      }

      const responseData = await response.json();
      console.log('Server response:', responseData);
      
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      alert(error instanceof Error ? error.message : 'Failed to save user');
    }
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Chargement...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-dark-500 dark:text-brand-blanc">
          Users
        </h1>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-300"
        >
          <Plus className="w-5 h-5" />
          Ajouter un utilisateur
        </button>
      </div>

      <DataTable
        data={users}
        columns={columns}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        title={selectedUser ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
      >
        <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div>
            <label
              htmlFor="first_name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Prénom
            </label>
            <input
              type="text"
              name="first_name"
              id="first_name"
              defaultValue={selectedUser?.first_name}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              required
            />
          </div>

          <div>
            <label
              htmlFor="last_name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Nom
            </label>
            <input
              type="text"
              name="last_name"
              id="last_name"
              defaultValue={selectedUser?.last_name}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              defaultValue={selectedUser?.email}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              required
            />
          </div>

          <div>
            <label
              htmlFor="roles"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Rôles (séparés par des virgules)
            </label>
            <input
              type="text"
              name="roles"
              id="roles"
              defaultValue={selectedUser?.roles.join(', ')}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              required
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Téléphone
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              defaultValue={selectedUser?.phone}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              required
            />
          </div>

          {!selectedUser && (
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Mot de passe temporaire
              </label>
              <input
                type="password"
                name="password"
                id="password"
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                required={!selectedUser}
                placeholder="Mot de passe temporaire pour la première connexion"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                L'utilisateur devra changer ce mot de passe lors de sa première connexion.
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 rounded-md transition-all duration-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-md transition-all duration-300"
            >
              <span>{selectedUser ? 'Mettre à jour' : 'Créer'}</span>
            </button>
          </div>
        </form>
      </Modal>

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Supprimer l'utilisateur"
        itemName={userToDelete ? `${userToDelete.first_name} ${userToDelete.last_name}` : ''}
      />
    </div>
  );
};

export default Users; 