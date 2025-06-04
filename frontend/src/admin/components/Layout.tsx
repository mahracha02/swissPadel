import { useState, ReactNode, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Image,
  MessageSquare,
  Users,
  Settings,
  LogOut,
  Briefcase,
  Building2,
  Handshake,
  Menu,
  X,
  Sun,
  Moon,
  Bell,
  User
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import ProfileBanner from './ProfileBanner';

const Layout = ({ children }: { children: ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isSuperAdmin = user?.roles?.some(role => 
    role === 'ROLE_SUPER_ADMIN' || role === 'SUPER_ADMIN'
  );

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Events', href: '/admin/events', icon: Calendar },
    { name: 'Gallery', href: '/admin/gallery', icon: Image },
    { name: 'Contacts', href: '/admin/contacts', icon: MessageSquare },
    { name: 'Sponsors', href: '/admin/sponsors', icon: Handshake },
    { name: 'Partners', href: '/admin/partners', icon: Handshake },
    { name: 'Professional Services', href: '/admin/professional-services', icon: Briefcase },
    { name: 'Particular Services', href: '/admin/particular-services', icon: Building2 },
    ...(isSuperAdmin ? [{ name: 'Users', href: '/admin/users', icon: Users }] : []),
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  useEffect(() => {
    if (!user) {
      navigate('/admin/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600/75 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white dark:bg-gray-800 shadow-xl">
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group relative flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-r-2 border-primary-500 transform scale-105 translate-x-1'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700/50 dark:hover:text-white'
                  }`}
                >
                  <div className={`absolute inset-0 bg-white dark:bg-gray-700 rounded-lg transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out ${isActive ? 'scale-x-100' : ''}`} />
                  <item.icon
                    className={`relative mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200 ${
                      isActive
                        ? 'text-primary-500 dark:text-primary-400'
                        : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-white'
                    }`}
                  />
                  <span className="relative">{item.name}</span>
                </Link>
              );
            })}
            <button
              onClick={logout}
              className="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/50 transition-all duration-200"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent dark:text-white">
              Admin Panel
            </h1>
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group relative flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-r-2 border-primary-500 transform scale-105 translate-x-1'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700/50 dark:hover:text-white'
                  }`}
                >
                  <div className={`absolute inset-0 bg-white dark:bg-gray-700 rounded-lg transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out ${isActive ? 'scale-x-100' : ''}`} />
                  <item.icon
                    className={`relative mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200 ${
                      isActive
                        ? 'text-primary-500 dark:text-primary-400'
                        : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-white'
                    }`}
                  />
                  <span className="relative">{item.name}</span>
                </Link>
              );
            })}
            <button
              onClick={logout}
              className="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/50 transition-all duration-200"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <button
            type="button"
            className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex flex-1 justify-between px-4">
            <div className="flex flex-1 items-center">
              <div className="relative group">
                <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-r-lg transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out" />
                <h2 className="relative text-2xl font-semibold px-4 py-2 rounded-r-lg border-r-2 border-primary-500 transform transition-all duration-300 group-hover:scale-105 group-hover:translate-x-1">
                  <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent dark:text-white">
                    {navigation.find((item) => item.href === location.pathname)?.name || 'Dashboard'}
                  </span>
                </h2>
              </div>
            </div>
            <div className="ml-4 flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 lg:hidden transition-colors duration-200"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
              <button className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors duration-200">
                <Bell className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user.first_name} {user.last_name}
                </span>
              </div>
            </div>
          </div>
        </div>

        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>

      {/* Profile Banner */}
      <ProfileBanner />
    </div>
  );
};

export default Layout;