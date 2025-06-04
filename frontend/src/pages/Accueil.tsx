import React from 'react';
import { Rocket, Image, ShieldCheck } from 'lucide-react';
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
        <section className="relative text-white min-h-screen flex items-center">
          {/* Background Image Container */}
          <div className="absolute inset-0 z-0">
            <img 
              src={Image1} 
              alt="Background" 
              className="w-full h-full object-cover"
              style={{ filter: 'brightness(0.5)' }}
            />
          </div>
          
          {/* Content Container */}
          <div className="container mx-auto flex flex-col md:flex-row items-center px-6 py-12 relative z-10">
            {/* Texte à gauche */}
            <div className="md:w-1/2 mb-12 md:mb-0">
              <h1 className="text-6xl lg:text-5xl font-bold mb-6 text-left">
                L'expertise du padel, <br/> au service de vos projets
              </h1>
              <p className="text-2xl mb-8 text-left py-10">
                Votre partenaire de référence pour vos projets liés au monde du padel.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-green-400 text-black py-3 px-6 rounded-full font-medium transition hover:bg-green-300">
                  JE SUIS UN PROFESSIONNEL
                </button>
                <button className="bg-transparent border border-white py-3 px-6 rounded-full font-medium transition hover:bg-white hover:text-black">
                  JE SUIS UN PARTICULIER
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Padel Tennis Section */}
        <section className="py-16 bg-white mt-24 ">
          <div className="container mx-auto flex flex-col md:flex-row items-center">
            {/* Image */}
            <div className="md:w-1/2 p-2">
              <img src={PadelTennis} alt="Padel Tennis" className="w-full rounded-2xl h-150" />
            </div>

            {/* Texte  */}
            <div className="md:w-1/2 p-2 flex flex-col justify-center text-left ml-12">
              <h2 className="text-5xl font-bold mb-12 text-[#202020]">Padel Tennis</h2>
              <p className="text-2xl text-gray-800 leading-relaxed mb-6">
                <strong className="font-semibold">L'histoire d'un sport en pleine expansion.</strong> Le padel tennis a été inventé en 1969 par Enrique Corcuera à Acapulco, au Mexique. 
                Ce sport dynamique et convivial combine des éléments du tennis et du squash, se jouant sur un court plus petit entouré de parois en verre. 
                Devenu rapidement populaire en Espagne, il se répand maintenant à l'international, attirant des joueurs de tous niveaux.
              </p>
              <p className="text-2xl text-gray-800 leading-relaxed font-semibold">
                Rejoignez la révolution du padel tennis et découvrez un jeu où stratégie et plaisir se rencontrent pour des échanges aussi intenses que divertissants.
              </p>
            </div>
          </div>
        </section>

        {/* Padel PingPong Section */}
        <section className="py-16 bg-white mt-24 ">
          <div className="container mx-auto flex flex-col md:flex-row items-center">
            {/* Texte  */}
            <div className="md:w-2/4 p-2 flex flex-col justify-center text-left mr-10 ">
              <h2 className="text-5xl font-bold mb-12 text-[#202020]">Padel PingPong</h2>
              <p className="text-2xl text-gray-800 leading-relaxed mb-6">
                <strong className="font-semibold">L'innovation au service du divertissement.</strong><br/> Le padel PingPong est une innovation récente qui fusionne 
                les concepts du pingpong et du padel. Joué sur une table spécialement conçue avec des raquettes et 
                des balles spécifiques, ce sport allie la rapidité et la précision du pingpong avec les mouvements 
                et les stratégies du padel.
              </p>
              <p className="text-2xl text-gray-800 leading-relaxed font-semibold">
                Vivez une nouvelle dimension de divertissement avec le padel pingpong, idéal pour les compétitions 
                et les événements d'entreprise, et laissez-vous surprendre par cette expérience unique.
              </p>
            </div>

            {/* Image */}
            <div className="md:w-2/4 p-2 ">
              <img src={PadelPingPong} alt="Padel Ping Pong" className="w-full rounded-2xl h-150" />
            </div>

          </div>
        </section>

        {/* CEO Section */}
        <section className="py-16  text-center text-black">
          <div className="container mx-auto">
            <div className="max-w-md mx-auto">
              <img src={CEO} alt="CEO" className="w-62 h-62 rounded-xl mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Sherif MAMDOUH - CEO</h2>
              <hr className="w-24 mx-auto my-6 border-blue-500 border-t-2" />
              <blockquote className="italic text-xl mb-6">
                " En tant que CEO de Swiss Padel Stars, je m'engage à offrir une expérience padel où l'excellence 
                suisse brille dans chaque projet. "
              </blockquote>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
              
              {/* Confiance */}
              <div className="p-8 shadow-md rounded-xl hover:shadow-lg transition duration-300">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 text-blue-600 flex items-center justify-center bg-blue-100 rounded-full">
                    <ShieldCheck size={48} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-blue-600">Confiance</h3>
                <p className="text-gray-700 text-lg">Bâtir des relations solides et transparentes.</p>
              </div>

              {/* Performance */}
              <div className="p-8 shadow-md rounded-xl hover:shadow-lg transition duration-300">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 text-blue-600 flex items-center justify-center bg-blue-100 rounded-full">
                    <Rocket size={48} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-blue-600">Performance</h3>
                <p className="text-gray-700 text-lg">Allier expertise et innovation pour des résultats exceptionnels.</p>
              </div>

              {/* Plaisir */}
              <div className="p-8 shadow-md rounded-xl hover:shadow-lg transition duration-300">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 text-blue-600 flex items-center justify-center bg-blue-100 rounded-full">
                    <Image size={48} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-blue-600">Plaisir</h3>
                <p className="text-gray-700 text-lg">Vivre chaque moment avec passion.</p>
              </div>

            </div>
          </div>
        </section>

        {/* Solutions Section */}
        <section className=" bg-cover bg-center text-white py-24" style={{ backgroundImage: `url(${PadelSolutions})` }}>
          <div className="container mx-auto text-center">
            <div className="max-w-8xl mx-auto p-6">
              <h2 className="text-5xl font-bold mb-16">
                Découvrez nos solutions adaptées à tous vos besoins :<br/> particuliers ou professionnels, 
                choisissez votre expérience padel.
              </h2>
              <div className="flex flex-col sm:flex-row gap-8 justify-center">
                <button className="bg-yellow-300 text-black py-5 px-15 rounded-full font-medium hover:bg-yellow-400 transition">
                  <span className="p-4 text-2xl">JE SUIS PARTICULIER</span>
                </button>
                <button className="bg-transparent border border-white py-3 px-15 rounded-full font-medium hover:bg-white hover:text-black transition">
                  <span className="p-4 text-2xl">JE SUIS PROFESSIONNEL</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <PartnersSection  />

      </main>

     
    </div>
  );
};

export default Accueil;
