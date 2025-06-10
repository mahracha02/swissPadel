import React from 'react';
import { Instagram, Facebook } from 'lucide-react';
import Logo from '../assets/images/logoSwissPadel.png';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 sm:py-12 mt-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 py-8 sm:py-12">
          {/* Logo and Description */}
          <div className="w-full lg:w-3/7">
            <div className="flex items-center gap-3 mb-4">
              <img src={Logo} alt="Swiss Padel Stars Logo" className="h-12 sm:h-16 w-auto" />
              <h2 className="text-lg sm:text-xl font-bold">SWISS PADEL STARS</h2>
            </div>
            <p className="text-sm sm:text-base font-bold mb-4">
              Votre partenaire de référence,  <br className="hidden sm:block" /> pour vos projets liés au monde du padel.
            </p>
            <b className="text-xs sm:text-sm mt-4 sm:mt-20">Copyright © 2025 SwissPadelStars. Tous droits réservés.</b>
          </div>

          {/* Services, Legal and Contact Group */}
          <div className="w-full lg:w-4/7 flex flex-col sm:flex-row justify-between gap-8 sm:gap-12">
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
              <div className="flex gap-4 mt-12 sm:mt-30">
                <a 
                  href="https://www.instagram.com/swisspadelstars" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#E1306C] hover:text-[#C13584] transition"
                  aria-label="Instagram"
                >
                  <Instagram size={50}  />
                </a>
                <a 
                  href="https://www.facebook.com/swisspadelstars" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#1877F2] hover:text-[#0B5FCC] transition"
                  aria-label="Facebook"
                >
                  <Facebook size={50} className='' />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
