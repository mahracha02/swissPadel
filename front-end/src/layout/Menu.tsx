import { useState } from 'react';
import { ChevronRight, Menu as MenuIcon, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Logo1 from '../assets/images/logoSwissPadel.png';
import Logo2 from '../assets/images/logo2.png';

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isServiceOpen, setIsServiceOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const closeMenu = () => {
    setIsOpen(false);
    setIsServiceOpen(false);
  };

  return (
    <>
      {/* Header */}
      <header className={`flex justify-between items-center px-10 py-6 w-full ${
        isHomePage 
          ? 'fixed bg-transparent text-white z-50' // Home page
          : 'static bg-transparent text-black' // Normal flow on other pages
      }`}>
        <button
          onClick={() => setIsOpen(true)}
          className={`flex items-center gap-2 text-lg font-medium transition mt-4 ml-4 ${
            isHomePage ? 'hover:text-[#646cff]' : 'hover:text-blue-900'
          }`}
        >
          <MenuIcon />
          <span>Menu</span>
        </button>

        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link to="/">
            {isHomePage ? (
                <img src={Logo1} alt="Logo" className="h-20 w-30" />
              ) : (
                <img src={Logo2} alt="Logo" className="h-20 w-30" />

              ) 
            }
          </Link>
        </div>

        <div className={`font-medium text-2xl mt-4 ${isHomePage ? 'text-white' : 'text-black'}`}>FR</div>
      </header>

      {/* Menu Overlay */}
      <div
        className={`fixed top-0 left-0 h-full w-full bg-black bg-opacity-80 z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        {/* Container for both panels */}
        <div className="flex h-full w-full">
          {/* Panel Gauche (menu principal) */}
          <div
            className={`h-full w-[50%] sm:w-[40%] md:w-[30%] bg-white text-black transform transition-transform duration-500 ease-in-out shadow-lg ${
              isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="flex justify-end p-6">
              <button
                onClick={closeMenu}
                className="text-black hover:text-[#646cff] transition"
              >
                <X size={28} />
              </button>
            </div>

            <ul className="px-6 space-y-6 text-lg animate-fadeIn">
              <li>
                <Link to="/" className="block hover:text-[#646cff] transition duration-200" onClick={closeMenu}>
                  Accueil
                </Link>
              </li>

              <li
                className="cursor-pointer flex justify-between items-center border border-[#646cff] rounded-lg px-4 py-2 hover:bg-[#f0f0f0] transition duration-200"
                onClick={() => setIsServiceOpen(!isServiceOpen)}
              >
                Nos services <ChevronRight size={20} />
              </li>

              <li>
                <Link to="/evenements" className="block hover:text-[#646cff] transition duration-200" onClick={closeMenu}>
                  Nos évènements
                </Link>
              </li>
              <li>
                <Link to="/sponsors" className="block hover:text-[#646cff] transition duration-200" onClick={closeMenu}>
                  Nos sponsors
                </Link>
              </li>
              <li>
                <Link to="/galerie" className="block hover:text-[#646cff] transition duration-200" onClick={closeMenu}>
                  Notre galerie
                </Link>
              </li>
              <li>
                <Link to="/contact" className="block hover:text-[#646cff] transition duration-200" onClick={closeMenu}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Panel Droite (sous-menu services) */}
          {isServiceOpen && (
            <div className="h-full w-[30%] hidden md:flex bg-blue-100/50 backdrop-blur-sm text-black flex-col justify-center items-start p-10 space-y-6 text-lg animate-slideRight shadow-lg rounded-r-2xl">
              <Link
                to="/particulier"
                className="w-full text-left hover:text-white hover:bg-[#646cff] px-4 py-2 rounded transition duration-200"
                onClick={closeMenu}
              >
                Je suis particulier
              </Link>
              <Link
                to="/professionnel"
                className="w-full text-left hover:text-white hover:bg-[#646cff] px-4 py-2 rounded transition duration-200"
                onClick={closeMenu}
              >
                Je suis professionnel
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
