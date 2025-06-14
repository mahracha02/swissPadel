import React, { useState, useEffect } from 'react';
import Header from '../layout/Header';
import { CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import Logo from '../assets/images/logo2.png';
import contactImg1 from '../assets/images/contactImage1.png';
import avatar1 from '../assets/images/avatar1.png';
import avatar2 from '../assets/images/avatar2.png';
import avatar3 from '../assets/images/avatar3.png';
import PartnersSection from '../layout/PartnersSection';

interface Service {
  id: number;
  title: string;
  description: string;
  image: string;
}

const feedbacks = [
  {
    name: 'Benoit .L',
    text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut',
    img: avatar1,
  },
  {
    name: 'Elisa .C',
    text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut',
    img: avatar2,
  },
  {
    name: 'Camille .L',
    text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut',
    img: avatar3,
  },
];

const Professionnel: React.FC = () => {
  const [start, setStart] = React.useState(0);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const visible = 3;

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('https://127.0.0.1:8000/api/professional-services');
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const prev = () => setStart((s) => (s - 1 + feedbacks.length) % feedbacks.length);
  const next = () => setStart((s) => (s + 1) % feedbacks.length);

  // For infinite loop, show 3 feedbacks in a row, wrapping around
  const getFeedbacks = () => {
    const arr = [];
    for (let i = 0; i < visible; i++) {
      arr.push(feedbacks[(start + i) % feedbacks.length]);
    }
    return arr;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="w-full mx-auto overflow-hidden">
        {/* Hero Section */}
        <section className="py-12 sm:py-16 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6">
                Parce que votre succès mérite de briller 
                dans l'univers du padel
              </h2>
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-700">
                Votre partenaire pour des projets padel clés en main.
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-12 sm:py-16 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c5ff32]"></div>
              </div>
            ) : (
              services.map((service, index) => (
                <div key={service.id} className="mb-38 last:mb-0">
                  <div className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 lg:gap-24 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                    {/* Image */}
                    <div className="w-full md:w-1/2">
                      <img 
                        src={`https://127.0.0.1:8000${service.image}`} 
                        alt={service.title} 
                        className="w-full h-auto rounded-2xl shadow-lg" 
                      />
                    </div>

                    {/* Text */}
                    <div className="w-full md:w-1/2">
                      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 md:mb-8">
                        {service.title}
                      </h1>
                      <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-800 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-12 sm:py-16 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-20">
              {/* Left side - Text content */}
              <div className="w-full md:w-1/2">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8">
                  Pourquoi choisir Swiss Padel Stars ?
                </h2>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-[#c5ff32] flex-shrink-0 mt-1" />
                    <span className="text-lg sm:text-xl text-gray-700">
                      Une expertise reconnue en Suisse
                    </span>
                  </li>
                  <li className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-[#c5ff32] flex-shrink-0 mt-1" />
                    <span className="text-lg sm:text-xl text-gray-700">
                      Des solutions clé-en-main adaptées à vos besoins
                    </span>
                  </li>
                  <li className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-[#c5ff32] flex-shrink-0 mt-1" />
                    <span className="text-lg sm:text-xl text-gray-700">
                      Un réseau solide pour maximiser l'impact de vos projets
                    </span>
                  </li>
                </ul>
              </div>

              {/* Right side - Image */}
              <div className="w-full md:w-1/2 flex justify-center">
                <div className="h-[300px] sm:h-[400px] flex items-center justify-center">
                  <img 
                    src={Logo} 
                    alt="Swiss Padel Stars" 
                    className="w-120 h-120 object-contain rounded-full bg-[#c5ff32] mt-4 border-2 border-black shadow-lg" 
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feedback Slider */}
        <section className="py-12 sm:py-16 md:py-20 bg-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-center mb-6">
              Retours clients
            </h2>
            <p className="text-xl sm:text-2xl md:text-3xl text-center mb-12 text-neutral-600">
              Votre satisfaction, notre priorité.
            </p>
            <div className="flex items-center justify-center gap-4 max-w-7xl mx-auto">
              {/* Left arrow */}
              <button
                onClick={prev}
                className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-black text-white hover:bg-neutral-800 transition"
                aria-label="Précédent"
              >
                <ChevronLeft size={24} className="sm:w-8 sm:h-8" />
              </button>
              {/* Feedback cards */}
              <div className="flex gap-4 sm:gap-8 w-full justify-center">
                {getFeedbacks().map((fb, idx) => (
                  <div
                    key={idx}
                    className="relative bg-white border border-neutral-400 rounded-2xl px-4 sm:px-8 pt-12 sm:pt-16 pb-4 sm:pb-8 w-[280px] sm:w-[340px] flex-shrink-0 flex flex-col items-center"
                  >
                    {/* Avatar */}
                    <div className="absolute -top-8 sm:-top-12 left-1/2 -translate-x-1/2">
                      <img
                        src={fb.img}
                        alt={fb.name}
                        className="w-16 h-16 sm:w-24 sm:h-24 rounded-full border-4 border-black shadow-lg object-cover"
                      />
                    </div>
                    <div className="mt-4 text-xl sm:text-2xl font-bold text-neutral-900">{fb.name}</div>
                    <div className="mt-2 text-sm sm:text-base text-neutral-800 text-center">{fb.text}</div>
                  </div>
                ))}
              </div>
              {/* Right arrow */}
              <button
                onClick={next}
                className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-black text-white hover:bg-neutral-800 transition"
                aria-label="Suivant"
              >
                <ChevronRight size={24} className="sm:w-8 sm:h-8" />
              </button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-16 sm:py-24 md:py-32 overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
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
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-16">
              {/* Left content */}
              <div className="w-full md:w-1/2 text-white">
                <div className="relative">
                  <div className="absolute -left-4 top-0 w-1 h-full bg-[#c5ff32]"></div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8 leading-tight">
                    Intégrez le padel à vos projets<br />
                    <span className="text-[#c5ff32]">dès maintenant.</span>
                  </h2>
                </div>
                
                <button className="group relative inline-flex items-center justify-center px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-bold text-black transition-all duration-300 ease-in-out">
                  <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-in-out transform translate-x-1 translate-y-1 bg-[#c5ff32] group-hover:translate-x-0 group-hover:translate-y-0"></span>
                  <span className="absolute inset-0 w-full h-full border-2 border-[#c5ff32]"></span>
                  <span className="relative">CONTACTER</span>
                </button>
              </div>
              
              {/* Right image */}
              <div className="w-full md:w-1/2">
                <div className="relative">
                  {/* Image glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#c5ff32] to-green-400 opacity-30 blur-xl"></div>
                  
                  <div className="relative">
                    <img
                      src={contactImg1}
                      alt="Table de padel"
                      className="w-full h-auto rounded-lg shadow-2xl transform transition-transform duration-500 hover:scale-105"
                    />
                    {/* Decorative corner elements */}
                    <div className="absolute top-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-t-2 border-l-2 border-[#c5ff32]"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-t-2 border-r-2 border-[#c5ff32]"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-b-2 border-l-2 border-[#c5ff32]"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-b-2 border-r-2 border-[#c5ff32]"></div>
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

export default Professionnel; 