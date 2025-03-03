import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom'; // Import Routes and Route
import { auth } from '/firebase'; // Import Firebase auth
import Navbar from './components/Navbar'; // Import the normal Navbar
import LoggedNavbar from './components/LoggedNavbar'; // Import the logged-in Navbar
import Header from './components/Header'; // Import the Header component
import WelcomeHeader from './components/WelcomeHeader'; // Import the WelcomeHeader component
import Footer from './components/Footer'; // Import the Footer component
import Dashboard from './components/Dashboard'; // Import the Dashboard component
import MonthlyPlanner from './components/MonthlyPlanner'; // Import the MonthlyPlanner component
import LoginModal from './components/LoginModal'; // Import the LoginModal component

function App() {
  const [user, setUser] = useState(null); // State to track the authenticated user
  const [isModalOpen, setModalOpen] = useState(false); // State to manage modal visibility

  // Track authentication state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user); // User is logged in
      } else {
        setUser(null); // User is logged out
      }
    });

    return () => unsubscribe(); // Cleanup subscription
  }, []);

  // Function to toggle the modal
  const toggleModal = (isOpen) => {
    setModalOpen(isOpen);
  };

  return (
    <Router>
      <div>
        {/* Display LoggedNavbar if user is logged in, otherwise display Navbar */}
        {user ? <LoggedNavbar user={user} /> : <Navbar onLoginClick={() => toggleModal(true)} />}

        {/* Define Routes */}
        <Routes>
          <Route
            path="/"
            element={
              <>
                {/* Display WelcomeHeader if user is logged in, otherwise display Header */}
                {user ? <WelcomeHeader userName={user.displayName || 'User'} /> : <Header toggleModal={toggleModal} />}
                <Footer />
              </>
            }
          />
          <Route
            path="/dashboard"
            element={<Dashboard user={user} />}
          />
          {/* Add Route for MonthlyPlanner */}
          <Route
            path="/monthly-planner"
            element={<MonthlyPlanner />}
          />
        </Routes>

        {/* Modal for Login */}
        {isModalOpen && <LoginModal onClose={() => toggleModal(false)} />}
      </div>
    </Router>
  );
}

export default App;