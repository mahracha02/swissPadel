import React from 'react';
import headerPhoto from '../assets/images/headerPhoto.png';

const Header: React.FC = () => {
  return (
    <div className="relative w-full h-[300px] overflow-hidden">
      <div className="absolute inset-0 "></div>
      <img
        src={headerPhoto}
        alt="Header Background"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-white text-4xl md:text-5xl font-bold text-center px-4">
          Swiss Padel Stars
        </h1>
      </div>
    </div>
  );
};

export default Header;
