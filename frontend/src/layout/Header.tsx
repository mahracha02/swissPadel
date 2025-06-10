import React from 'react';
import { useLocation } from 'react-router-dom';
import headerPhoto from '../assets/images/headerPhoto.png';

const Header: React.FC = () => {
  const location = useLocation();
  
  // Fonction pour obtenir le titre de la page
  const getPageTitle = () => {
    const path = location.pathname;
    // Enlever le slash initial et mettre la première lettre en majuscule
    const pageName = path.substring(1).charAt(0).toUpperCase() + path.substring(2);
    
    // Si c'est la page d'accueil ou si le chemin est vide
    if (path === '/' || path === '') {
      return 'Swiss Padel Stars';
    }
    
    // Gérer les cas spéciaux
    switch (pageName) {
      case 'Accueil':
        return 'Swiss Padel Stars';
      case 'Galerie':
        return 'Galerie';
      case 'Sponsors':
        return 'Nos Sponsors';
      case 'Services':
        return 'Nos Services';
      case 'Particulier':
        return 'Solutions Particuliers';
      case 'Professionnel':
        return 'Solutions Professionnels';
      case 'Evenements':
        return 'Nos Événements';
      case 'Contact':
        return 'Contactez-nous';
      default:
        return 'Swiss Padel Stars';
    }
  };

  return (
    <div className="relative w-full h-[300px] overflow-hidden">
      <div className="absolute inset-0"></div>
      <img
        src={headerPhoto}
        alt="Header Background"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold text-center px-4">
          {getPageTitle()}
        </h1>
      </div>
    </div>
  );
};

export default Header;
