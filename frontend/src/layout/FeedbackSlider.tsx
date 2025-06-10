import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import avatar1 from '../assets/images/avatar1.png';
import avatar2 from '../assets/images/avatar2.png';
import avatar3 from '../assets/images/avatar3.png';

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

const FeedbackSlider: React.FC = () => {
  const [start, setStart] = React.useState(0);
  const [visible, setVisible] = React.useState(3);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisible(1);
      } else {
        setVisible(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
    <section className="py-20 w-screen relative left-1/2 right-1/2 -mx-[50vw] px-4 md:px-0 flex flex-col justify-center bg-gray-100">
      <h2 className="text-5xl md:text-7xl font-bold text-center mb-6">Retours clients</h2>
      <p className="text-3xl text-center mb-12 text-neutral-600">Votre satisfaction, notre priorité.</p>
      <div className="flex items-center justify-center gap-4 max-w-7xl mx-auto mt-20">
        {/* Left arrow */}
        <button
          onClick={prev}
          className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-black text-white hover:bg-neutral-800 transition"
          aria-label="Précédent"
        >
          <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
        </button>
        {/* Feedback cards */}
        <div className="flex gap-4 md:gap-8 w-full justify-center">
          {getFeedbacks().map((fb, idx) => (
            <div
              key={idx}
              className="relative bg-white border border-neutral-400 rounded-2xl px-6 md:px-8 pt-16 pb-8 w-full md:w-[340px] flex-shrink-0 flex flex-col items-center"
            >
              {/* Avatar */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                <img
                  src={fb.img}
                  alt={fb.name}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-black shadow-lg object-cover"
                />
              </div>
              <div className="mt-4 text-xl md:text-2xl font-bold text-neutral-900">{fb.name}</div>
              <div className="mt-2 text-sm md:text-base text-neutral-800 text-center">{fb.text}</div>
            </div>
          ))}
        </div>
        {/* Right arrow */}
        <button
          onClick={next}
          className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-black text-white hover:bg-neutral-800 transition"
          aria-label="Suivant"
        >
          <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
        </button>
      </div>
    </section>
  );
};

export default FeedbackSlider; 