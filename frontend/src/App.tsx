import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Accueil from './pages/Accueil';
import Evenements from './pages/Evenements';
import Sponsors from './pages/Sponsors';
import Galerie from './pages/Galerie';
import Contact from './pages/Contact';
import Particulier from './pages/Particulier';
import Professionnel from './pages/Professionnel';
import Footer from './layout/Footer';
import Menu from './layout/Menu';
import { ThemeProvider } from './contexts/ThemeContext';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminLogin from './admin/pages/Login';
import AdminLayout from './admin/components/Layout';
import AdminDashboard from './admin/pages/Dashboard';
import AdminEvents from './admin/pages/Events';
import AdminGallery from './admin/pages/Gallery';
import AdminContacts from './admin/pages/Contacts';
import AdminSponsors from './admin/pages/Sponsors';
import AdminPartners from './admin/pages/Partners';
import AdminFeedback from './admin/pages/Feedback';
import AdminProfessionalServices from './admin/pages/ProfessionalServices';
import AdminParticularServices from './admin/pages/ParticularServices';
import AdminUsers from './admin/pages/Users';

// Layout Component for Public Routes
const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Menu />
      {children}
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route
                path="*"
                element={
                  <PublicLayout>
                    <Routes>
                      <Route index element={<Accueil />} />
                      <Route path="evenements" element={<Evenements />} />
                      <Route path="sponsors" element={<Sponsors />} />
                      <Route path="galerie" element={<Galerie />} />
                      <Route path="contact" element={<Contact />} />
                      <Route path="particulier" element={<Particulier />} />
                      <Route path="professionnel" element={<Professionnel />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </PublicLayout>
                }
              />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <Routes>
                        <Route path="/" element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="events" element={<AdminEvents />} />
                        <Route path="gallery" element={<AdminGallery />} />
                        <Route path="contacts" element={<AdminContacts />} />
                        <Route path="sponsors" element={<AdminSponsors />} />
                        <Route path="partners" element={<AdminPartners />} />
                        <Route path="feedback" element={<AdminFeedback />} />
                        <Route path="professional-services" element={<AdminProfessionalServices />} />
                        <Route path="particular-services" element={<AdminParticularServices />} />
                        <Route path="users" element={
                          <ProtectedRoute requiredRoles={['ROLE_SUPER_ADMIN']}>
                            <AdminUsers />
                          </ProtectedRoute>
                        } />
                      </Routes>
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;