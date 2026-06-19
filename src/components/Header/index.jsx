import React from 'react';
import './Header.css';

const Header = ({ toggleModal }) => {
  return (
    <header className="hero">
      <div className="hero-overlay"></div>

      <div className="hero-content">
        <div className="hero-eyebrow">AI-Powered Finance</div>
        <h1 className="hero-title">
          Master Your Finances<br />
          with <span className="hero-title-highlight">FinWizard</span>
        </h1>
        <p className="hero-subtitle">
          Take control of your budget, savings, and investments in one intelligent platform.
        </p>
        <div className="hero-cta-group">
          <button className="hero-cta" onClick={() => toggleModal(true, 'signup')}>
            Get Started — It's Free
          </button>
        </div>
      </div>

      <div className="hero-features">
        <div className="hero-feature-pill"><span className="pill-dot"></span>Budget Tracking</div>
        <div className="hero-feature-pill"><span className="pill-dot"></span>AI Suggestions</div>
        <div className="hero-feature-pill"><span className="pill-dot"></span>Debt Planner</div>
        <div className="hero-feature-pill"><span className="pill-dot"></span>EMI Calculator</div>
        <div className="hero-feature-pill"><span className="pill-dot"></span>Investment Insights</div>
      </div>

      <div className="hero-stats">
        <div className="hero-stat">
          <div className="hero-stat-number">10K+</div>
          <div className="hero-stat-label">Users</div>
        </div>
        <div className="hero-stat">
          <div className="hero-stat-number">£2M+</div>
          <div className="hero-stat-label">Tracked</div>
        </div>
        <div className="hero-stat">
          <div className="hero-stat-number">98%</div>
          <div className="hero-stat-label">Satisfaction</div>
        </div>
      </div>
    </header>
  );
};

export default Header;
