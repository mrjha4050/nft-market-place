import React from 'react';
import Header from './components/Header';
import WalletLogin from './components/WalletLogin';
import TokenizationSteps from './components/TokenizationSteps';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto p-4">
        <WalletLogin />
        <TokenizationSteps />
      </div>
    </div>
  );
}

export default App;
