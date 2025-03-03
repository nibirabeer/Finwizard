import React from 'react';
import './Header.css';

const Header = ({ toggleModal }) => {
    return (
      <header className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Master Your Finances with FinWizard</h1>
          <p className="hero-subtitle">Take control of your budget, savings, and investments in one place.</p>
          <button className="hero-cta" onClick={() => toggleModal('signup')}>Get Started</button>
        </div>
      </header>
    );
  };

export default Header;