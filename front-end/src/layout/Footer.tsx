import React from 'react';
import { Instagram, Linkedin } from 'lucide-react';
import Logo from '../assets/images/logoSwissPadel.png';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 sm:py-12 mt-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-30 py-8 sm:py-12">
          {/* Logo and Description */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src={Logo} alt="Swiss Padel Stars Logo" className="h-12 sm:h-16 w-auto" />
              <h2 className="text-lg sm:text-xl font-bold">SWISS PADEL STARS</h2>
            </div>
            <p className="text-sm sm:text-base font-bold mb-4">
              Votre partenaire de référence,  <br className="hidden sm:block" /> pour vos projets liés au monde du padel.
            </p>
            <p className="text-xs sm:text-sm mt-4 sm:mt-20">Copyright © 2025 SwissPadelStars. Tous droits réservés.</p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-[#c5ff32]">Services</h3>
            <ul className="space-y-2">
              <li className="text-sm sm:text-base">Lorem ipsum</li>
              <li className="text-sm sm:text-base">Lorem ipsum</li>
              <li className="text-sm sm:text-base">Lorem ipsum</li>
              <li className="text-sm sm:text-base">Lorem ipsum</li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-[#c5ff32]">Légal</h3>
            <ul className="space-y-2">
              <li className="text-sm sm:text-base">Lorem ipsum</li>
              <li className="text-sm sm:text-base">Lorem ipsum</li>
              <li className="text-sm sm:text-base">Lorem ipsum</li>
              <li className="text-sm sm:text-base">Lorem ipsum</li>
            </ul>
          </div>

          {/* Contact and Social */}
          <div>
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-[#c5ff32]">Contact</h3>
            <ul className="space-y-2 mb-4 sm:mb-6">
              <li className="text-sm sm:text-base">Lorem ipsum</li>
              <li className="text-sm sm:text-base">Lorem ipsum</li>
              <li className="text-sm sm:text-base">Lorem ipsum</li>
              <li className="text-sm sm:text-base">Lorem ipsum</li>
            </ul>
            <div className="flex gap-3 sm:gap-4">
              <a href="#" className="bg-white p-2 sm:p-3 rounded-full text-gray-900 hover:bg-[#c5ff32] transition-colors">
                <Instagram size={20} className="sm:w-6 sm:h-6" />
              </a>
              <a href="#" className="bg-white p-2 sm:p-3 rounded-full text-gray-900 hover:bg-[#c5ff32] transition-colors">
                <Linkedin size={20} className="sm:w-6 sm:h-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
