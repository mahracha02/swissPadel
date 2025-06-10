import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Text with Animation */}
        <div className="relative mb-8">
          <h1 className="text-9xl font-bold text-[#c5ff32] animate-bounce">
            404
          </h1>
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-[#c5ff32]"></div>
        </div>

        {/* Message */}
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
          Oups ! Page non trouvée
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 mb-8">
          La page que vous recherchez semble avoir disparu dans le vide...
        </p>

        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 bg-[#c5ff32] text-black px-6 py-3 rounded-full font-medium hover:bg-[#b3e62e] transition-colors duration-300"
        >
          <ArrowLeft size={20} />
          Retour à l'accueil
        </Link>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#c5ff32] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-[#c5ff32] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-32 h-32 bg-[#c5ff32] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 