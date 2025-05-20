import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 text-center">
      <p>© {new Date().getFullYear()} Crypto Sphere Risk Manager. All rights reserved.</p>
    </footer>
  );
};

export default Footer;