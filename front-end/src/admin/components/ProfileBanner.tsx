import { useAuth } from '../../contexts/AuthContext';
import { Crown, Shield, User } from 'lucide-react';

const ProfileBanner = () => {
  const { user, logout } = useAuth();

  const getRoleBadge = () => {
    const role = user?.roles?.[0];
    
    // Remove ROLE_ prefix if it exists
    const cleanRole = role?.replace('ROLE_', '') || '';
    
    if (cleanRole === 'SUPER_ADMIN' || role === 'ROLE_SUPER_ADMIN') {
      return (
        <div className="flex items-center gap-2 bg-gradient-to-r from-[#c5ff32] to-[#a3d429] px-3 py-1.5 rounded-full shadow-lg">
          <Crown className="w-4 h-4 text-black" />
          <span className="text-xs font-bold text-black">Super Admin</span>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        </div>
      );
    }
    
    if (cleanRole === 'ADMIN' || role === 'ROLE_ADMIN') {
      return (
        <div className="flex items-center gap-2 bg-gradient-to-r from-[#c5ff32]/80 to-[#a3d429]/80 px-3 py-1.5 rounded-full shadow-md">
          <Shield className="w-4 h-4 text-black" />
          <span className="text-xs font-bold text-black">Admin</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center gap-2 bg-[#c5ff32]/60 px-3 py-1.5 rounded-full shadow-sm">
        <User className="w-4 h-4 text-black" />
        <span className="text-xs font-bold text-black">User</span>
      </div>
    );
  };

  return (
    <div className="absolute top-2 right-4 flex items-center space-x-2 bg-brand-blanc dark:bg-dark-500 rounded-full px-4 py-2 shadow-lg backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 border border-primary-200 dark:border-primary-700 transition-all duration-300 hover:shadow-xl hover:scale-105 z-50">
      {/* Role Badge */}
      <div className="flex items-center relative">
        {getRoleBadge()}
      </div>

      <div className="h-4 w-px bg-primary-200 dark:bg-white/20"></div>

      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-md ring-1 ring-primary-200 dark:ring-primary-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-dark-500 dark:text-white">
            {user?.email}
          </span>
        </div>
      </div>

      <div className="h-4 w-px bg-primary-200 dark:bg-white/20"></div>

      <button
        onClick={logout}
        className="group relative p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-300"
        title="Logout"
      >
        <div className="absolute inset-0 rounded-full bg-red-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-primary-600 dark:text-white transform group-hover:scale-110 transition-transform duration-300"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Logout
        </span>
      </button>
    </div>
  );
};

export default ProfileBanner; 