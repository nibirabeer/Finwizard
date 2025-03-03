import React, { useState } from 'react';
import './PricingDrawer.css'; // Import the CSS file
import LoginModal from '../LoginModal'; // Import the LoginModal component

const PricingDrawer = ({ isOpen, onClose }) => {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false); // State for LoginModal

  // Function to open the LoginModal
  const openLoginModal = () => {
    setLoginModalOpen(true);
  };

  // Function to close the LoginModal
  const closeLoginModal = () => {
    setLoginModalOpen(false);
  };

  return (
    <>
      <div className={`pricing-drawer ${isOpen ? 'open' : ''}`}>
        <button className="close-button-2" onClick={onClose}>
          &times;
        </button>
        <h2>Pricing Plans</h2>
        <p>Choose the best plan for your financial needs.</p>

        <div className="pricing-cards-container">
          {/* Free Plan */}
          <div className="pricing-card">
            <h5 className="plan-name">Free Plan</h5>
            <div className="price">
              <span className="currency">£</span>
              <span className="amount">0</span>
              <span className="duration">/month</span>
            </div>
            <ul className="features-list">
            <li className="feature">
              <svg className="icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
              </svg>
              <span>Basic AI-powered insights</span>
            </li>
            <li className="feature">
              <svg className="icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
              </svg>
              <span>Track up to 3 accounts</span>
            </li>
            <li className="feature">
              <svg className="icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
              </svg>
              <span>Monthly financial reports</span>
            </li>
            <li className="feature disabled">
              <svg className="icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
              </svg>
              <span>Advanced AI tools</span>
            </li>
            <li className="feature disabled">
              <svg className="icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
              </svg>
              <span>Priority support</span>
            </li>
          </ul>
            <button className="choose-plan-button" onClick={openLoginModal}>
            Choose Plan
            </button>
          </div>

          {/* Premium Plan */}
          <div className="pricing-card">
            <h5 className="plan-name">Premium Plan</h5>
            <div className="price">
              <span className="currency">£</span>
              <span className="amount">9</span>
              <span className="duration">/month</span>
            </div>
            <ul className="features-list">
            <li className="feature">
              <svg className="icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
              </svg>
              <span>Advanced AI-powered insights</span>
            </li>
            <li className="feature">
              <svg className="icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
              </svg>
              <span>Track unlimited accounts</span>
            </li>
            <li className="feature">
              <svg className="icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
              </svg>
              <span>Weekly financial reports</span>
            </li>
            <li className="feature">
              <svg className="icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
              </svg>
              <span>Advanced AI tools</span>
            </li>
            <li className="feature">
              <svg className="icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
              </svg>
              <span>Priority support</span>
            </li>
          </ul>
            <button className="choose-plan-button" onClick={openLoginModal}>
              Choose Plan
            </button>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {isLoginModalOpen && <LoginModal onClose={closeLoginModal} />}
    </>
  );
};

export default PricingDrawer;