import React, { useState, useEffect } from "react";
import "./Navbar.css";
import LoginModal from "../LoginModal";
import AboutDrawer from "../AboutDrawer";
import PricingDrawer from "../PricingDrawer";

const Navbar = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isAboutDrawerOpen, setAboutDrawerOpen] = useState(false);
  const [isPricingDrawerOpen, setPricingDrawerOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Check if screen size is mobile

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Update state on resize
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo" onClick={() => (window.location.href = "#")}>
          <img src="public/FW Logo.png" alt="Logo" />
          <span className="navbar-name-orange">Fin</span>
          <span className="navbar-name-white">Wizard</span>
        </div>

        {/* Desktop Buttons */}
        {!isMobile && (
          <div className="button-container">
            <span className="about-text" onClick={() => setAboutDrawerOpen(true)}>
              About
            </span>
            <span className="pricing-text" onClick={() => setPricingDrawerOpen(true)}>
              Pricing
            </span>
            <button className="gradient-button" onClick={() => setModalOpen(true)}>
              <span className="button-text">LOGIN</span>
            </button>
          </div>
        )}

        {/* Mobile Menu Icon */}
        {isMobile && (
          <div className="hamburger-menu" onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
            ☰
          </div>
        )}
      </nav>

      {/* Mobile Dropdown Menu */}
      {isMobile && isMobileMenuOpen && (
        <div className="mobile-dropdown">
          <span className="dropdown-item" onClick={() => setAboutDrawerOpen(true)}>
            About
          </span>
          <span className="dropdown-item" onClick={() => setPricingDrawerOpen(true)}>
            Pricing
          </span>
          <span className="dropdown-item" onClick={() => setModalOpen(true)}>
            Login
          </span>
        </div>
      )}

      {/* Modals & Drawers */}
      {isModalOpen && <LoginModal onClose={() => setModalOpen(false)} />}
      <AboutDrawer isOpen={isAboutDrawerOpen} onClose={() => setAboutDrawerOpen(false)} />
      <PricingDrawer isOpen={isPricingDrawerOpen} onClose={() => setPricingDrawerOpen(false)} />
    </>
  );
};

export default Navbar;
