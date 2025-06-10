import React, { useState, useEffect } from 'react';
import Header from '../layout/Header';
import { ChevronLeft, ChevronRight, Image, MapPin, Calendar } from 'lucide-react';
import Slider from 'react-slick';
import PadelCover from "../assets/images/padelCover.jpg"
import PartnersSection from '../layout/PartnersSection';
import { Link } from 'react-router-dom';

interface Event {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
  place: string;
}

const Evenements: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextEvent, setNextEvent] = useState<Event | null>(null);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('https://127.0.0.1:8000/api/events');
        
        if (!response.ok) {
          if (response.status === 404) {
            // If no events found, set empty array instead of throwing error
            setEvents([]);
            setLoading(false);
            return;
          }
          throw new Error('Failed to fetch events');
        }
        
        const data = await response.json() as Event[];
        
        // Remove duplicates based on id
        const uniqueEvents = Array.from(new Map(data.map((event) => [event.id, event])).values());
        
        // Sort events by date
        const sortedEvents = uniqueEvents.sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        
        setEvents(sortedEvents);
        
        // Set next event if available
        if (sortedEvents.length > 0) {
          setNextEvent(sortedEvents[0]);
          // Calculate time left for the next event
          const eventDate = new Date(sortedEvents[0].date);
          updateTimeLeft(eventDate);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue lors du chargement des événements');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Update countdown timer
  useEffect(() => {
    if (!nextEvent) return;

    const timer = setInterval(() => {
      const eventDate = new Date(nextEvent.date);
      updateTimeLeft(eventDate);
    }, 1000);

    return () => clearInterval(timer);
  }, [nextEvent]);

  const updateTimeLeft = (eventDate: Date) => {
    const now = new Date();
    const difference = eventDate.getTime() - now.getTime();

    if (difference <= 0) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    setTimeLeft({ days, hours, minutes, seconds });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-red-500 text-center">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const renderEvents = () => {
    if (events.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-24 h-24 mb-6 rounded-full bg-primary-100 flex items-center justify-center">
            <Calendar className="w-12 h-12 text-primary-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucun événement à venir</h3>
          <p className="text-gray-600 text-center max-w-md">
            Nous travaillons actuellement sur de nouveaux événements passionnants. 
            Revenez bientôt pour découvrir nos prochaines activités !
          </p>
        </div>
      );
    }

    const eventCards = events.map((event) => (
      <div key={event.id} className="px-3">
        <div className="bg-gray-100 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="h-48 bg-gray-200 relative">
            {event.image ? (
              <img 
                src= {`https://127.0.0.1:8000${event.image}`} 
                alt={event.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Image className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>
          <div className="p-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-bold">{event.title}</h3>
              <div className="flex items-center bg-gradient-to-r from-primary-500/10 to-primary-500/20 px-3 py-1 rounded-full text-sm font-medium group hover:from-primary-500/20 hover:to-primary-500/30 transition-all duration-300">
                <MapPin className="w-4 h-4 mr-1 text-primary-500 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-primary-600">{event.place}</span>
              </div>
            </div>
            <p className="text-gray-600 mb-4">{event.description}</p>
            <div className="flex items-center text-sm text-gray-500">
              <span>{new Date(event.date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    ));

    if (events.length <= 3) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventCards}
        </div>
      );
    }

    return (
      <div className="relative px-12">
        <Slider
          infinite={events.length > 3}
          speed={500}
          slidesToShow={3}
          slidesToScroll={1}
          arrows={true}
          dots={false}
          prevArrow={
            <button 
              className="absolute left-0 top-1/2 -translate-y-1/2 -ml-6 w-12 h-12 rounded-full bg-[#c5ff32] hover:bg-[#b3e32d] flex items-center justify-center z-10 transition-all duration-300 group"
              style={{ boxShadow: '0 4px 12px rgba(197, 255, 50, 0.3)' }}
            >
              <ChevronLeft className="w-8 h-8 text-black group-hover:scale-110 transition-transform duration-300" />
            </button>
          }
          nextArrow={
            <button 
              className="absolute right-0 top-1/2 -translate-y-1/2 -mr-6 w-12 h-12 rounded-full bg-[#c5ff32] hover:bg-[#b3e32d] flex items-center justify-center z-10 transition-all duration-300 group"
              style={{ boxShadow: '0 4px 12px rgba(197, 255, 50, 0.3)' }}
            >
              <ChevronRight className="w-8 h-8 text-black group-hover:scale-110 transition-transform duration-300" />
            </button>
          }
          responsive={[
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 2,
                infinite: events.length > 2
              }
            },
            {
              breakpoint: 640,
              settings: {
                slidesToShow: 1,
                infinite: events.length > 1
              }
            }
          ]}
          className="relative"
        >
          {eventCards}
        </Slider>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="py-20 text-center mb-30">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
          Le padel, c'est aussi une expérience à partager
        </h1>
        <p className="text-xl text-gray-600">
          Vivez l'univers du padel à travers nos événements.
        </p>
      </section>

      {/* Next Event Section */}
      {nextEvent && (
        <section className="bg-neutral-900 text-white py-16 mb-30">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold mb-2">Prochain événement</h2>
                <p className="text-xl text-gray-300">{nextEvent.place}</p>
              </div>
              <div className="flex gap-4 mt-6 md:mt-0">
                <div className="text-center">
                  <div className="text-4xl font-bold">{timeLeft.days.toString().padStart(2, '0')}</div>
                  <div className="text-sm text-gray-400">JOURS</div>
                </div>
                <div className="text-4xl font-bold">:</div>
                <div className="text-center">
                  <div className="text-4xl font-bold">{timeLeft.hours.toString().padStart(2, '0')}</div>
                  <div className="text-sm text-gray-400">HEURES</div>
                </div>
                <div className="text-4xl font-bold">:</div>
                <div className="text-center">
                  <div className="text-4xl font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                  <div className="text-sm text-gray-400">MINUTES</div>
                </div>
                <div className="text-4xl font-bold">:</div>
                <div className="text-center">
                  <div className="text-4xl font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                  <div className="text-sm text-gray-400">SECONDES</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-4xl font-bold mb-8">SwissPadelStars</h2>
          <p className="text-lg text-gray-800 leading-relaxed">
            Spécialisé dans le sponsoring, l'accompagnement d'événements et la création d'infrastructures, 
            l'entreprise soutient l'installation de terrains de padel dans des lieux stratégiques, 
            et offre des solutions innovantes pour les marques souhaitant s'implanter dans cet univers 
            en pleine expansion.
          </p>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Les événements à venir</h2>
          {renderEvents()}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-cover bg-center text-white relative" style={{ backgroundImage: `url(${PadelCover})` }} >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6">
            Vivez des événements sportifs inoubliables avec<br />
            Swiss Padel Stars
          </h2>
          <Link to="/contact" className="bg-[#c5ff32] text-black px-8 py-3 rounded-full font-bold hover:bg-opacity-90 transition-colors">
            ORGANISER UN ÉVÉNEMENT
          </Link>
        </div>
      </section>

      {/* Partners Section */}
      <PartnersSection  />
    </div>
  );
};

export default Evenements; 