import React from 'react';

const Header = () => (
  <header className="bg-gray-800 text-white p-4 flex justify-between">
    <h1 className="text-2xl">EtherEase</h1>
    <nav>
      <a href="#home" className="mr-4">Home</a>
      <a href="#wallet" className="mr-4">Login</a>
    </nav>
  </header>
);

export default Header;
