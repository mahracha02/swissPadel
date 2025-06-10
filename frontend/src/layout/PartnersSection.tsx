import { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface Partner {
  id: number;
  name: string;
  image: string;
  site_url: string;
}

interface PartnersSectionProps {
  title?: string;
  className?: string;
}

const PartnersSection = ({ 
  title = "Nos Partenaires",
  className = ""
}: PartnersSectionProps) => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await fetch('https://127.0.0.1:8000/api/partners');
        if (!response.ok) {
          throw new Error('Failed to fetch partners');
        }
        const data = await response.json();
        setPartners(data);
      } catch (error) {
        console.error('Error fetching partners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  if (loading) {
    return (
      <section className={`py-20 bg-white ${className}`}>
        <div className="container mx-auto px-6">
          <div className="text-center">Chargement...</div>
        </div>
      </section>
    );
  }

  if (partners.length === 0) {
    return null;
  }

  // Determine if we need a slider based on partner count and screen size
  const needsSlider = isMobile ? partners.length > 1 : partners.length > 4;

  const renderPartners = () => {
    return partners.map((partner) => (
      <div key={partner.id} className="px-4">
        <a 
          href={partner.site_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full aspect-square border border-gray-200 rounded-lg shadow hover:shadow-md transition overflow-hidden relative"
        >
          <div className="absolute inset-0">
            {partner.image ? (
              <img 
                src={`https://127.0.0.1:8000${partner.image}`}
                alt={partner.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-lg font-bold text-gray-800">{partner.name}</span>
              </div>
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-800/90 py-2 px-4 text-center border-t border-gray-200">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{partner.name}</span>
          </div>
        </a>
      </div>
    ));
  };

  return (
    <section className={`py-20 ${className}`}>
      <div className="container mx-auto px-6">
        <h2 className="text-center text-3xl font-bold mb-10 text-blue-900">{title}</h2>

        {needsSlider ? (
          <Slider
            autoplay
            autoplaySpeed={2000}
            infinite
            slidesToShow={isMobile ? 1 : 4}
            slidesToScroll={1}
            arrows={!isMobile}
            dots={isMobile}
            responsive={[
              {
                breakpoint: 1024,
                settings: { slidesToShow: 3 },
              },
              {
                breakpoint: 768,
                settings: { 
                  slidesToShow: 1,
                  arrows: false,
                  dots: true
                },
              }
            ]}
          >
            {renderPartners()}
          </Slider>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {renderPartners()}
          </div>
        )}
      </div>
    </section>
  );
};

export default PartnersSection; 