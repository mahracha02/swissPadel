import React from 'react';
import Header from '../layout/Header';

const Services: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center mb-8">Nos Services</h2>
        {/* Add your services content here */}
      </div>
    </div>
  );
};

export default Services; 