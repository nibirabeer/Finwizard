import React, { useState } from "react";
import "./AboutDrawer.css"; // Import the CSS file
import { X } from "lucide-react"; // Importing close icon from Lucide (or use any other icon library)

const AboutDrawer = ({ isOpen, onClose }) => {
  const [showForm, setShowForm] = useState(false); // State to toggle form
  const [comment, setComment] = useState(""); // Store user input

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const mailtoLink = `mailto:abirnibir10@gmail.com?subject=Help Request&body=${encodeURIComponent(comment)}`;
    window.location.href = mailtoLink; // Open mail client with message
    setShowForm(false); // Hide form after sending
  };

  return (
    <div className={`about-drawer ${isOpen ? "open" : ""}`}>
      <div className="drawer-content">
        {/* Close Button */}
        <button className="close-button-1" onClick={onClose} aria-label="Close">
          <X size={24} />
        </button>

        {/* Drawer Header */}
        <h2>About FinWizard</h2>
        <p>
          FinWizard is an AI-driven financial budgeting and management tool designed to help you take control of your finances. With advanced algorithms and intuitive features, FinWizard makes budgeting simple and effective.
        </p>

        {/* Help Button */}
        <button className="help-button" onClick={() => setShowForm(!showForm)}>
          Help
        </button>

        {/* Help Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="help-form">
            <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
              <div className="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
                <label htmlFor="comment" className="sr-only">
                  Your comment
                </label>
                <textarea
                  id="comment"
                  rows="4"
                  className="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                  placeholder="Write a comment..."
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
              </div>
              <div className="flex items-center justify-between px-3 py-2 border-t dark:border-gray-600 border-gray-200">
                <button
                  type="submit"
                  className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
                >
                  Post
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AboutDrawer;
