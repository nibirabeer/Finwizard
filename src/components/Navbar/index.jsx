import React, { useState } from 'react';
import './Navbar.css';
import LoginModal from '../LoginModal'; // Import the LoginModal component
import AboutDrawer from '../AboutDrawer'; // Import the AboutDrawer component
import PricingDrawer from '../PricingDrawer'; // Import the new PricingDrawer component

const Navbar = () => {
  const [isModalOpen, setModalOpen] = useState(false); // State for login modal
  const [isAboutDrawerOpen, setAboutDrawerOpen] = useState(false); // State for about drawer
  const [isPricingDrawerOpen, setPricingDrawerOpen] = useState(false); // State for pricing drawer

  // Function to toggle the modal
  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  // Function to toggle the about drawer
  const toggleAboutDrawer = () => {
    setAboutDrawerOpen(!isAboutDrawerOpen);
  };

  // Function to toggle the pricing drawer
  const togglePricingDrawer = () => {
    setPricingDrawerOpen(!isPricingDrawerOpen);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo" onClick={() => (window.location.href = '/home')}>
          <img src="public/FW Logo.png" alt="Logo" />
          <span className="navbar-name-orange">Fin</span>
          <span className="navbar-name-white">Wizard</span>
        </div>
        <div className="button-container">
          {/* About Text */}
          <span
            className="about-text"
            onClick={toggleAboutDrawer} // Open the about drawer on click
          >
            About
          </span>

          {/* Pricing Text */}
          <span
            className="pricing-text"
            onClick={togglePricingDrawer} // Open the pricing drawer on click
          >
            Pricing
          </span>

          {/* Login Button */}
          <button className="gradient-button" onClick={toggleModal}>
            <span className="button-text">LOGIN</span>
          </button>
        </div>
      </nav>

      {/* Modal for Login */}
      {isModalOpen && <LoginModal onClose={toggleModal} />}

      {/* About Drawer */}
      <AboutDrawer isOpen={isAboutDrawerOpen} onClose={toggleAboutDrawer} />

      {/* Pricing Drawer */}
      <PricingDrawer isOpen={isPricingDrawerOpen} onClose={togglePricingDrawer} />
    </>
  );
};

export default Navbar;