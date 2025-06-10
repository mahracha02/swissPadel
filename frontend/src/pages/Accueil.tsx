import React from 'react';
import { Rocket, Image, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import Image1 from '../assets/images/padel1.png';
import PadelTennis from '../assets/images/padelTennis.png';
import PadelPingPong from '../assets/images/padelPingPong.png';
import CEO from '../assets/images/CEO.png';
import PadelSolutions from '../assets/images/padelSolutions.jpg';
import PartnersSection from '../layout/PartnersSection'; 

const Accueil: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen text-white">
      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative text-white min-h-screen flex items-center">
          {/* Background Image Container */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img 
              src={Image1} 
              alt="Background" 
              className="w-full h-full object-cover object-center transform scale-105"
              style={{ 
                filter: 'brightness(0.4)',
                minHeight: '100vh',
                width: '100%',
                objectPosition: 'center center'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30"></div>
          </div>
          
          {/* Content Container */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-center sm:text-left" aria-label='Bienvenue chez Swiss Padel Stars'>
                L'expertise du padel, <br className="hidden sm:block"/> au service de vos projets
              </h1>
              <p className="text-xl sm:text-2xl mb-8 text-center sm:text-left py-6 sm:py-10">
                Votre partenaire de référence pour vos projets liés au monde du padel.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
                <Link to="/professionnel">
                  <button className="bg-yellow-400 text-black py-3 px-6 rounded-full font-medium transition hover:bg-yellow-300 w-full sm:w-auto" aria-label='Je suis un professionnel'>
                    JE SUIS UN PROFESSIONNEL
                  </button>
                </Link>
                <Link to="/particulier">
                  <button className="bg-transparent border border-white py-3 px-6 rounded-full font-medium transition hover:bg-white hover:text-black w-full sm:w-auto" aria-label='Je suis un particulier'>
                    JE SUIS UN PARTICULIER
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Padel Tennis Section */}
        <section className="py-12 sm:py-16 bg-white mt-12 sm:mt-24" aria-label='Padel Tennis Section'>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              {/* Image */}
              <div className="w-full lg:w-1/2">
                <img 
                  src={PadelTennis} 
                  alt="Padel Tennis" 
                  className="w-full rounded-2xl object-cover h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px]" 
                />
              </div>

              {/* Texte */}
              <div className="w-full lg:w-1/2 lg:pl-8">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 lg:mb-12 text-[#202020]">Padel Tennis</h2>
                <p className="text-base sm:text-lg lg:text-xl text-gray-800 leading-relaxed mb-6">
                  <strong className="font-semibold">L'histoire d'un sport en pleine expansion.</strong> Le padel tennis a été inventé en 1969 par Enrique Corcuera à Acapulco, au Mexique. 
                  Ce sport dynamique et convivial combine des éléments du tennis et du squash, se jouant sur un court plus petit entouré de parois en verre. 
                  Devenu rapidement populaire en Espagne, il se répand maintenant à l'international, attirant des joueurs de tous niveaux.
                </p>
                <p className="text-base sm:text-lg lg:text-xl text-gray-800 leading-relaxed font-semibold">
                  Rejoignez la révolution du padel tennis et découvrez un jeu où stratégie et plaisir se rencontrent pour des échanges aussi intenses que divertissants.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Padel PingPong Section */}
        <section className="py-12 sm:py-16 bg-white mt-12 sm:mt-24" aria-label='Padel PingPong Section'>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              {/* Texte */}
              <div className="w-full lg:w-1/2 lg:pr-8 order-2 lg:order-1">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 lg:mb-12 text-[#202020]">Padel PingPong</h2>
                <p className="text-base sm:text-lg lg:text-xl text-gray-800 leading-relaxed mb-6">
                  <strong className="font-semibold">L'innovation au service du divertissement.</strong><br/> Le padel PingPong est une innovation récente qui fusionne 
                  les concepts du pingpong et du padel. Joué sur une table spécialement conçue avec des raquettes et 
                  des balles spécifiques, ce sport allie la rapidité et la précision du pingpong avec les mouvements 
                  et les stratégies du padel.
                </p>
                <p className="text-base sm:text-lg lg:text-xl text-gray-800 leading-relaxed font-semibold">
                  Vivez une nouvelle dimension de divertissement avec le padel pingpong, idéal pour les compétitions 
                  et les événements d'entreprise, et laissez-vous surprendre par cette expérience unique.
                </p>
              </div>

              {/* Image */}
              <div className="w-full lg:w-1/2 order-1 lg:order-2">
                <img 
                  src={PadelPingPong} 
                  alt="Padel Ping Pong" 
                  className="w-full rounded-2xl object-cover h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px]" 
                />
              </div>
            </div>
          </div>
        </section>

        {/* CEO Section */}
        <section className="py-12 sm:py-16 text-center text-black" aria-label='CEO Section'>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
              <img src={CEO} alt="CEO" className="w-48 h-48 sm:w-62 sm:h-62 rounded-xl mx-auto mb-4 object-cover" />
              <h2 className="text-xl sm:text-2xl font-bold mb-2">Sherif MAMDOUH - CEO</h2>
              <hr className="w-24 mx-auto my-6 border-blue-500 border-t-2" />
              <blockquote className="italic text-lg sm:text-xl mb-6">
                " En tant que CEO de Swiss Padel Stars, je m'engage à offrir une expérience padel où l'excellence 
                suisse brille dans chaque projet. "
              </blockquote>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-12 sm:py-20 bg-white" aria-label='Values Section'>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 text-center">
              
              {/* Confiance */}
              <div className="p-6 sm:p-8 shadow-md rounded-xl hover:shadow-lg transition duration-300">
                <div className="flex justify-center mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600 flex items-center justify-center bg-blue-100 rounded-full">
                    <ShieldCheck size={32} className="sm:w-12 sm:h-12" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 text-blue-600">Confiance</h3>
                <p className="text-base sm:text-lg text-gray-700">Bâtir des relations solides et transparentes.</p>
              </div>

              {/* Performance */}
              <div className="p-6 sm:p-8 shadow-md rounded-xl hover:shadow-lg transition duration-300">
                <div className="flex justify-center mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600 flex items-center justify-center bg-blue-100 rounded-full">
                    <Rocket size={32} className="sm:w-12 sm:h-12" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 text-blue-600">Performance</h3>
                <p className="text-base sm:text-lg text-gray-700">Allier expertise et innovation pour des résultats exceptionnels.</p>
              </div>

              {/* Plaisir */}
              <div className="p-6 sm:p-8 shadow-md rounded-xl hover:shadow-lg transition duration-300">
                <div className="flex justify-center mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600 flex items-center justify-center bg-blue-100 rounded-full">
                    <Image size={32} className="sm:w-12 sm:h-12" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 text-blue-600">Plaisir</h3>
                <p className="text-base sm:text-lg text-gray-700">Vivre chaque moment avec passion.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Solutions Section */}
        <section className="bg-cover bg-center text-white py-12 sm:py-16 md:py-24 relative" aria-label='Solutions Section' style={{ backgroundImage: `url(${PadelSolutions})` }}>
          {/* Overlay pour améliorer la lisibilité */}
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 md:mb-12">
                Découvrez nos solutions adaptées à tous vos besoins :
                <br className="hidden sm:block"/> 
                particuliers ou professionnels, 
                choisissez votre expérience padel.
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 justify-center">
                <Link to="/particulier" className="bg-yellow-300 text-black py-3 sm:py-4 md:py-5 px-6 sm:px-8 md:px-12 rounded-full font-medium hover:bg-yellow-400 transition w-full sm:w-auto text-base sm:text-lg md:text-xl text-center" aria-label='Je suis un particulier'>  
                  JE SUIS PARTICULIER
                </Link>
                <Link to="/professionnel" className="bg-transparent border border-white py-3 sm:py-4 md:py-5 px-6 sm:px-8 md:px-12 rounded-full font-medium hover:bg-white hover:text-black transition w-full sm:w-auto text-base sm:text-lg md:text-xl text-center" aria-label='Je suis un professionnel'>
                  JE SUIS PROFESSIONNEL
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <PartnersSection />
      </main>
    </div>
  );
};

export default Accueil;
