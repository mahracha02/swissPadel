import React, { useState, useEffect } from 'react';
import Header from '../layout/Header';
import PadelSolutions from "../assets/images/padelSolutions.jpg"
import {  Mail, Send, User, MessageSquare, Instagram, Linkedin, Loader2, Tag } from 'lucide-react';

interface ContactObject {
  id: number;
  type: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    object: '',
    message: '',
  });

  const [objects, setObjects] = useState<ContactObject[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({
    type: null,
    message: '',
  });

  useEffect(() => {
    const fetchObjects = async () => {
      try {
        const response = await fetch('https://127.0.0.1:8000/api/objects');
        if (!response.ok) {
          throw new Error('Failed to fetch objects');
        }
        const data = await response.json() as ContactObject[];
        setObjects(data);
      } catch (error) {
        console.error('Error fetching objects:', error);
      }
    };

    fetchObjects();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      console.log('Sending form data:', formData);
      const response = await fetch('https://127.0.0.1:8000/api/contact/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          object: parseInt(formData.object),
          message: formData.message
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Server response:', response.status, errorData);
        throw new Error(errorData?.detail || errorData?.message || 'Failed to send message');
      }

      const data = await response.json();
      console.log('Server response:', data);

      setSubmitStatus({
        type: 'success',
        message: 'Votre message a été envoyé avec succès! Nous vous répondrons dans les plus brefs délais.',
      });

      // Reset form
      setFormData({
        fullName: '',
        email: '',
        object: '',
        message: '',
      });
    } catch (error) {
      console.error('Error details:', error);
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="w-full mx-auto overflow-hidden">
        {/* Hero Section */}
        <section className="text-center mb-50 pt-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            Prêts à faire équipe avec <br />
            <span className="text-[#c5ff32]">Swiss Padel Stars</span> ?
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto px-4">
            Contactez-nous dès aujourd'hui pour réaliser vos projets
          </p>
        </section>

        {/* Contact Methods */}
        <section className="max-w-5xl mx-auto mb-50 px-4 ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="w-16 h-16 mx-auto mb-6 bg-[#c5ff32] rounded-2xl flex items-center justify-center transform rotate-45 group-hover:rotate-0 transition-transform duration-300">
                <Mail className="w-8 h-8 text-black -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-center">E-mail</h3>
              <p className="text-gray-600 text-center">contact@swisspadelstars.ch</p>
            </div>

            <div className="group bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="w-16 h-16 mx-auto mb-6 bg-[#c5ff32] rounded-2xl flex items-center justify-center transform rotate-45 group-hover:rotate-0 transition-transform duration-300">
                <Tag className="w-8 h-8 text-black -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-center">Objets</h3>
              <p className="text-gray-600 text-center">Choisissez parmi nos différents objets</p>
            </div>
          </div>
        </section>

        {/* Contact Form and Map Section */}
        <section className="max-w-7xl mx-auto px-4 mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-xl">
              <h2 className="text-4xl font-bold mb-8">Contactez-nous</h2>
              {submitStatus.type && (
                <div 
                  className={`mb-6 p-4 rounded-xl ${
                    submitStatus.type === 'success' 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {submitStatus.message}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="fullName">
                    Nom et prénom
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#c5ff32] focus:border-transparent transition-all duration-300"
                      required
                      disabled={isSubmitting}
                    />
                    <User className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#c5ff32] focus:border-transparent transition-all duration-300"
                      required
                      disabled={isSubmitting}
                    />
                    <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="object">
                    Objet
                  </label>
                  <div className="relative">
                    <select
                      id="object"
                      name="object"
                      value={formData.object}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#c5ff32] focus:border-transparent transition-all duration-300 appearance-none bg-white"
                      required
                      disabled={isSubmitting}
                    >
                      <option value="">Sélectionnez un objet</option>
                      {objects.map((obj) => (
                        <option key={obj.id} value={obj.id}>
                          {obj.type}
                        </option>
                      ))}
                    </select>
                    <Tag className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="message">
                    Message
                  </label>
                  <div className="relative">
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#c5ff32] focus:border-transparent transition-all duration-300"
                      required
                      disabled={isSubmitting}
                    ></textarea>
                    <MessageSquare className="w-5 h-5 text-gray-400 absolute left-4 top-6" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center gap-2 font-medium group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                      Envoyer le message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Map */}
            <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-xl">
              <h2 className="text-4xl font-bold mb-8">Suivez-nous sur les reseaux</h2>
              <div className="flex gap-4 mb-6">
                <a 
                  href="https://www.instagram.com/swisspadelstars/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-[#c5ff32] transition-colors"
                >
                  <Instagram className="w-8 h-8" />
                </a>
                <a 
                  href="https://www.facebook.com/SwissPadelStars" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-[#c5ff32] transition-colors"
                >
                  <Linkedin className="w-8 h-8" />
                </a>
              </div>

              <div className="relative w-full h-[400px] sm:h-[500px] rounded-xl overflow-hidden shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent pointer-events-none z-10"></div>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2745.5750419368086!2d6.6314844!3d46.5167774!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478c31ca1c7b6bc9%3A0x9c9e3c521e37f613!2sLausanne%2C%20Switzerland!5e0!3m2!1sen!2sus!4v1625764428458!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-xl"
                  title="Swiss Padel Stars Location"
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-cover bg-center text-white py-24 mt-30" style={{ backgroundImage: `url(${PadelSolutions})` }}>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">
              Découvrez nos solutions adaptées à tous vos besoins particuliers ou professionnels, choisissez votre expérience padel.
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-[#c5ff32] text-black px-8 py-3 rounded-full font-bold hover:bg-opacity-90 transition-colors">
                En savoir plus
              </button>
              <button className="border-2 border-withe text-white px-8 py-3 rounded-full font-bold hover:bg-[#c5ff32] hover:text-black transition-colors">
                Nous contacter
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact; 