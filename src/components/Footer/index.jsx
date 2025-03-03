// src/components/Footer/index.jsx

import React from 'react';
import './Footer.css'; // Import the CSS file

const Footer = () => {
  return (
      <footer className="#353935">
          <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
              <div className="md:flex md:justify-between">
                  <div className="mb-6 md:mb-0">
                      <a href="#" className="flex items-center">
                      <img src="public/FW Logo.png" alt="Logo" />
        <span className="navbar-name-orange">Fin</span>
        <span className="navbar-name-white">Wizard</span>
                      </a>
                  </div>
                  <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
                      <div>
                          
                      </div>
                      <div>
                          <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Follow us</h2>
                          <ul className="text-gray-500 dark:text-gray-400 font-medium">
                              <li className="mb-4">
                                  <a href="https://github.com/nibirabeer/nibirabeer" className="hover:underline">GitHub</a>
                              </li>
                              <li>
                                  <a href="http://discord.com/channels/@me" className="hover:underline">Discord</a>
                              </li>
                          </ul>
                      </div>
                      <div>
                          <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Legal</h2>
                          <ul className="text-gray-500 dark:text-gray-400 font-medium">
                              <li className="mb-4">
                                  <a href="#" className="hover:underline">Privacy Policy</a>
                              </li>
                              <li>
                                  <a href="#" className="hover:underline">Terms & Conditions</a>
                              </li>
                          </ul>
                      </div>
                  </div>
              </div>
              <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
              <div className="sm:flex sm:items-center sm:justify-between">
                  <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
                      © 2025 FinWizard™. All Rights Reserved.
                  </span>
              </div>
          </div>
      </footer>
  );
};

export default Footer;
