import React, { useState, useEffect } from 'react';
import Header from '../layout/Header';
import Slider from 'react-slick';
import PadelSolutions from "../assets/images/padelSolutions.jpg";
import PartnersSection from '../layout/PartnersSection';
import { Link } from 'react-router-dom';

interface GalleryItem {
  id: number;
  title: string;
  image: string;
  description: string;
}

const Galerie: React.FC = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      const response = await fetch('https://127.0.0.1:8000/api/gallery');
      if (!response.ok) {
        throw new Error('Failed to fetch gallery items');
      }
      const data = await response.json();
      setGalleryItems(data);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
    } finally {
      setLoading(false);
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    beforeChange: (current: number, next: number) => setCurrentSlide(next),
    customPaging: (i: number) => (
      <div className={`w-2 h-2 rounded-full mt-4 ${currentSlide === i ? 'bg-primary-500' : 'bg-gray-300'}`} />
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true
        }
      }
    ]
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="w-full mx-auto overflow-hidden px-4 sm:px-6 lg:px-8">
        {/* Gallery Hero Section */}
        <section className="text-center py-12 sm:py-16 md:py-20">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 md:mb-12">
            L'art du padel en images
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez nos installations et moments forts
          </p>
        </section>

        {/* Image Slider Section */}
        <section className="mb-12 sm:mb-16 md:mb-20 relative">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {galleryItems.length > 0 ? (
              <Slider {...sliderSettings}>
                {galleryItems.map((item) => (
                  <div key={item.id} className="outline-none px-2 sm:px-4">
                    <div className="aspect-[16/9] overflow-hidden rounded-lg shadow-xl">
                      <img
                        src={`https://127.0.0.1:8000${item.image}`}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center mt-6 sm:mt-8 md:mt-10 mb-8 sm:mb-12 md:mb-16">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3">
                        {item.title}
                      </h3>
                      <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </Slider>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-base sm:text-lg">Aucune image disponible pour le moment.</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-cover bg-center text-white py-16 sm:py-20 md:py-24" style={{ backgroundImage: `url(${PadelSolutions})` }}>
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8">
              Découvrez nos solutions adaptées à tous vos besoins particuliers ou professionnels, choisissez votre expérience padel.
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-[#c5ff32] text-black px-6 sm:px-8 py-3 rounded-full font-bold hover:bg-opacity-90 transition-colors w-full sm:w-auto">
                En savoir plus
              </button>
              <Link to="/contact">
                <button className="border-2 border-white text-white px-6 sm:px-8 py-3 rounded-full font-bold hover:bg-[#c5ff32] hover:text-black transition-colors w-full sm:w-auto">
                  Nous contacter
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <PartnersSection />
      </div>
    </div>
  );
};

export default Galerie; 