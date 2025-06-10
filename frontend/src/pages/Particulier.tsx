import React from 'react';
import Header from '../layout/Header';
import { CheckCircle, Star } from 'lucide-react';
import tablePadel from '../assets/images/tablePadel.png'; 
import avantageImg from '../assets/images/avantagePadel.png';
import commandeImg from '../assets/images/tablePadel.png';
import PartnersSection from '../layout/PartnersSection';
import FeedbackSlider from '../layout/FeedbackSlider';
import { Link } from 'react-router-dom';




const Particulier: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      
      <div className=" mx-auto overflow-hidden">
        <Header />
        <section className="py-20">
          <div className="mx-auto text-center px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6">
                  Élevez votre jeu, transformez votre espace
              </h2>
              <p className="text-2xl sm:text-3xl md:text-5xl mb-6 sm:mb-8">Des solutions sur mesure pour intégrer le padel chez vous.</p>
            </div>
          </div>
        </section>

        {/* Feature Section */}
        <section className="mb-16 px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-center text-neutral-900 mb-12 sm:mb-24 leading-tight">
            Votre table de padel ping-pong,<br className="hidden md:block" />
            chez-vous.
          </h1>
          <div className="relative flex flex-col md:flex-row items-center justify-center max-w-[1920px] mx-auto min-h-[600px] md:min-h-[900px]">
            {/* Left: Image */}
            <div className="relative w-full md:w-4/5 flex justify-center z-0">
              <img
                src={tablePadel}
                alt="Padel Ping-Pong Table"
                className="rounded-2xl shadow-lg w-full md:w-[1200px] md:h-[900px] object-cover"
              />
            </div>
            {/* Right: Feature Card (overlapping with negative margin) */}
            <div
              className="
                bg-neutral-900 text-white rounded-xl shadow-xl p-6 sm:p-8 md:p-12 w-full md:w-[850px] md:h-[700px] flex flex-col gap-6 sm:gap-8 md:gap-10
                md:-ml-32 md:mt-8 z-10 border border-blue-800 mt-8 md:mt-0
              "
              style={{ maxWidth: 850 }}
            >
              <h3 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 sm:mb-12 mt-2 sm:mt-4">FEATURE #1</h3>
              <ul className="space-y-6 sm:space-y-8">
                <li className="flex items-center gap-4 sm:gap-5 mb-8 sm:mb-12">
                  <CheckCircle className="text-lime-400 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14" />
                  <span className="text-xl sm:text-2xl font-medium">Design premium</span>
                </li>
                <li className="flex items-center gap-4 sm:gap-5 mb-8 sm:mb-12">
                  <CheckCircle className="text-lime-400 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14" />
                  <span className="text-xl sm:text-2xl font-medium">Matériaux résistants</span>
                </li>
                <li className="flex items-center gap-4 sm:gap-5">
                  <CheckCircle className="text-lime-400 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14" />
                  <span>
                    <span className="font-medium text-xl sm:text-2xl">Personnalisations disponibles</span>
                    <br />
                    <span className="text-base sm:text-lg text-neutral-300">(couleurs, motifs)</span>
                  </span>
                </li>
              </ul>
              <button className="mt-8 sm:mt-12 md:mt-16 bg-lime-400 hover:bg-lime-500 text-black font-bold py-3 sm:py-4 md:py-5 rounded-lg text-xl sm:text-2xl transition">
                COMMANDER
              </button>
            </div>
          </div>
        </section>

        {/* Avantages Section */}
        <section className="min-h-[75vh] bg-gray-100 flex flex-col justify-center py-12 sm:py-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold text-center mb-12 sm:mb-30 px-4">
            Vos avantages
          </h2>
          <div className="flex flex-col md:flex-row items-start justify-start gap-12 sm:gap-20 max-w-[1920px] mx-auto px-4 sm:px-6">
            {/* Left: Image */}
            <div className="w-full md:w-[800px] h-[300px] sm:h-[400px] md:h-[500px] flex-shrink-0 overflow-hidden">
              <img
                src={avantageImg}
                alt="Avantage Padel"
                className="h-full w-full object-cover shadow-lg rounded-2xl md:rounded-l-2xl md:rounded-r-none"
                style={{ marginLeft: 0 }}
              />
            </div>
            {/* Right: List */}
            <div className="flex flex-col gap-12 sm:gap-20 w-full md:w-[600px]">
              {[
                "JEUX ADAPTÉS À TOUTE LA FAMILLE",
                "ÉLÉMENT DESIGN ET ÉLÉGANT\nPOUR LES ESPACES DE VIE",
                "OPTIONS SUR MESURE POUR\nPERSONNALISER SELON VOS GOÛTS"
              ].map((text, index) => (
                <div key={index} className="flex items-start gap-6 sm:gap-8">
                  <span className="flex-shrink-0">
                    <span className="flex items-center justify-center w-[70px] h-[70px] sm:w-[80px] sm:h-[80px] md:w-[90px] md:h-[90px] rounded-full border-2 border-black">
                      <Star className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16" strokeWidth={2.5} />
                    </span>
                  </span>
                  <span className="text-xl sm:text-2xl md:text-3xl font-bold text-neutral-900 whitespace-pre-line">
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-12 sm:py-20 min-h-[75vh] flex flex-col justify-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-center mb-12 sm:mb-30 px-4">
            Services mis à votre disposition
          </h2>

          <div className="relative w-full max-w-[1920px] mx-auto px-4 sm:px-6">
            {/* Line */}
            <div className="hidden md:block absolute top-10 left-70 right-70 h-[2px] bg-neutral-600 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-x-24 items-start relative z-10">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-black text-2xl sm:text-3xl font-bold flex items-center justify-center bg-white shadow-md z-10">
                  1
                </div>
                <div className="mt-4 sm:mt-6 text-lg sm:text-xl md:text-2xl font-bold leading-snug">
                  <span className="block whitespace-nowrap">LIVRAISON</span>
                  <span className="block whitespace-nowrap">À DOMICILE PREMIUM</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-black text-2xl sm:text-3xl font-bold flex items-center justify-center bg-white shadow-md z-10">
                  2
                </div>
                <div className="mt-4 sm:mt-6 text-lg sm:text-xl md:text-2xl font-bold leading-snug">
                  <span className="block whitespace-nowrap">INSTALLATION ET DÉMONSTRATION</span>
                  <span className="block whitespace-nowrap">PAR DES EXPERTS</span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-black text-black-500 text-2xl sm:text-3xl font-bold flex items-center justify-center bg-white shadow-md z-10">
                  3
                </div>
                <div className="mt-4 sm:mt-6 text-lg sm:text-xl md:text-2xl font-bold leading-snug">
                  <span className="block whitespace-nowrap">GARANTIE ET SERVICE</span>
                  <span className="block whitespace-nowrap">APRÈS-VENTE DÉDIÉ</span>
                </div>
              </div>
            </div>

            {/* Mobile vertical line */}
            <div className="md:hidden absolute left-1/2 top-20 bottom-0 w-1 bg-neutral-300 -translate-x-1/2 z-0"></div>
          </div>
        </section>

        {/* Feedback Slider */}
        <FeedbackSlider />

        {/* CTA Section */}
        <section className="relative py-32 overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#c5ff32] to-transparent opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#c5ff32] to-transparent opacity-50"></div>
          
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, #c5ff32 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }}></div>
          </div>

          {/* Content */}
          <div className="relative z-10 container mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-16">
              {/* Left content */}
              <div className="w-full md:w-1/2 text-white">
                <div className="relative">
                  <div className="absolute -left-4 top-0 w-1 h-full bg-[#c5ff32]"></div>
                  <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 leading-tight">
                    Commandez votre table<br />
                    <span className="text-[#c5ff32]">dès maintenant.</span>
                  </h2>
                </div>
                <p className="text-xl text-gray-300 mb-12 max-w-xl">
                  Découvrez notre table de padel innovante et transformez votre espace de jeu avec un design moderne et performant.
                </p>
              <Link to="/contact">  
                <button className="group relative inline-flex items-center justify-center px-12 py-4 text-lg font-bold text-black transition-all duration-300 ease-in-out">
                  <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-in-out transform translate-x-1 translate-y-1 bg-[#c5ff32] group-hover:translate-x-0 group-hover:translate-y-0"></span>
                  <span className="absolute inset-0 w-full h-full border-2 border-[#c5ff32]"></span>
                  <span className="relative">COMMANDER</span>
                </button>
              </Link>
              </div>

              {/* Right image */}
              <div className="w-full md:w-1/2">
                <div className="relative">
                  {/* Image glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#c5ff32] to-green-400 opacity-30 blur-xl"></div>
                  
                  <div className="relative">
                    <img
                      src={commandeImg}
                      alt="Table de padel"
                      className="w-full h-auto rounded-lg shadow-2xl transform transition-transform duration-500 hover:scale-105"
                    />
                    {/* Decorative corner elements */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#c5ff32]"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#c5ff32]"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#c5ff32]"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#c5ff32]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Partners Section */}
        <PartnersSection  />     
      </div>
    </div>
  );
};

export default Particulier; 