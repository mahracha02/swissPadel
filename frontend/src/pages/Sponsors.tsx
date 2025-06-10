import React, { useState, useEffect } from 'react';
import Header from '../layout/Header';
import { Image, Eye, Rocket, Target, HandshakeIcon } from 'lucide-react';
import PadelSolutions from "../assets/images/padelSolutions.jpg"
import Slider from 'react-slick';
import PartnersSection from '../layout/PartnersSection';
import { Link } from 'react-router-dom';

interface Sponsor {
  id: number;
  name: string;
  description: string;
  image: string;
  siteUrl: string;
  published: boolean;
}

const Sponsors: React.FC = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    try {
      const response = await fetch('https://127.0.0.1:8000/api/sponsors');
      if (!response.ok) {
        throw new Error('Failed to fetch sponsors');
      }
      const data = await response.json();
      setSponsors(data);
    } catch (error) {
      console.error('Error fetching sponsors:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { number: '4', label: "Années d'expériences" },
    { number: '1,000+', label: 'Clients satisfaits' },
    { number: '15%', label: 'De solutions uniques' },
    { number: '5,000+', label: 'Spectateurs engagés' },
  ];

  const advantages = [
    {
      icon: Eye,
      number: 1,
      title: "ACCROÎTRE VOTRE VISIBILITÉ",
      description: "Votre marque sera présente sur nos terrains, nos événements, et nos supports de communication, touchant un large public actif et engagé."
    },
    {
      icon: Rocket,
      number: 2,
      title: "RENFORCER VOTRE NOTORIÉTÉ",
      description: "Associez votre image à un sport en pleine croissance, porteur de dynamisme, d'innovation et de convivialité."
    },
    {
      icon: Target,
      number: 3,
      title: "CIBLER UNE AUDIENCE PREMIUM",
      description: "Nos événements attirent des passionnés, des entreprises et des décideurs, offrant un accès privilégié à un réseau de qualité."
    },
    {
      icon: HandshakeIcon,
      number: 4,
      title: "SOUTENIR UN PROJET LOCAL",
      description: "En collaborant avec Swiss Padel Stars, vous participez activement au développement d'une discipline qui rassemble et inspire."
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl">Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="w-full">
        {/* Hero Section */}
        <section className="text-center py-16 px-4 mb-30">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            Des collaborations qui font la différence
          </h1>
          <p className="text-lg sm:text-xl text-gray-600">
            Nos partenaires qui soutiennent le développement du padel.
          </p>
        </section>

        {/* Stats Section */}
        <section className="bg-neutral-900 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="mb-4">
                    <Image className="w-16 h-16 mx-auto text-white" />
                  </div>
                  <div className="text-[#c5ff32] text-3xl sm:text-4xl font-bold mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm sm:text-base">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sponsors Section */}
        <section className="py-16 p-12">
          {sponsors.map((sponsor) => (
            <div key={sponsor.id} className="relative mb-16 max-w-7xl mx-auto mb-30">
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                {/* Left: Image */}
                <div className="w-full md:w-1/2 relative z-10">
                  <img 
                    src={`https://127.0.0.1:8000${sponsor.image}`}
                    alt={`${sponsor.name} Logo`}
                    className="w-full h-auto"
                  />
                </div>
                {/* Right: Feature Card */}
                <div className="w-full md:w-1/2 bg-neutral-900 text-white p-12 md:p-16 md:-ml-24 relative z-20 min-h-[400px] flex flex-col justify-between">
                  <div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-8">{sponsor.name}</h2>
                    <p className="text-gray-300 text-xl line-clamp-4">
                      {sponsor.description}
                    </p>
                  </div>
                  <div className="mt-8">
                    <a 
                      href={sponsor.siteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-[#c5ff32] text-black px-10 py-4 rounded-full font-medium hover:bg-opacity-90 transition-colors w-fit text-lg"
                    >
                      VISITER LE SITE INTERNET
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Advantages Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-20">
              Vos avantages à rejoindre l'aventure
            </h2>

            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-158 top-0 bottom-0 w-0.5 bg-neutral-800 hidden md:block" />

              {/* Advantages */}
              <div className="space-y-20">
                {advantages.map((advantage, index) => (
                  <div key={index} className="flex flex-col md:flex-row items-center gap-8 relative">
                    {/* Icon and number */}
                    <div className="md:w-1/2 flex md:justify-end">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full border-2 border-black flex items-center justify-center bg-white relative z-10">
                          <advantage.icon size={40} />
                        </div>
                        <div className="absolute -right-12 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#c5ff32] flex items-center justify-center text-xl font-bold">
                          {advantage.number}
                        </div>
                      </div>
                    </div>

                    {/* Text content */}
                    <div className="md:w-1/2 md:pl-16">
                      <h3 className="text-2xl font-bold mb-4">{advantage.title}</h3>
                      <p className="text-lg text-gray-600">{advantage.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-cover bg-center text-white py-24 mt-30" style={{ backgroundImage: `url(${PadelSolutions})` }}>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-6xl sm:text-5xl font-bold mb-6">
              Faites briller votre marque avec Swiss Padel Stars
            </h2>
            <p className="text-4xl sm:text-3xl text-withe mb-8">
              Associez votre image à un sport en plein essor et touchez 
              une audience passionnée et engagée.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-[#c5ff32] text-black px-8 py-3 rounded-full font-bold hover:bg-opacity-90 transition-colors">
                En savoir plus
              </button>
              <Link to="/contact" className="w-full sm:w-auto">
                <button className="border-2 border-withe text-white px-8 py-3 rounded-full font-bold hover:bg-[#c5ff32] hover:text-black transition-colors">
                  Nous contacter
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <PartnersSection  />
      </div>
    </div>
  );
};

export default Sponsors; 