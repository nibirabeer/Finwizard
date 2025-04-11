import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '/firebase';
import { signOut, reauthenticateWithCredential, updatePassword, EmailAuthProvider } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './LoggedNavbar.css';

const LoggedNavbar = ({ user }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [profileIconUrl, setProfileIconUrl] = useState('public/default-profile.png');
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [userData, setUserData] = useState({});
  const [editData, setEditData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('free');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const navigate = useNavigate();
  const storage = getStorage();
  const dropdownRef = useRef(null); // Ref to track the dropdown menu
  const profileModalRef = useRef(null); // Ref to track the profile modal
  const settingsModalRef = useRef(null); // Ref to track the settings modal

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false); // Close the dropdown
      }
    };

    // Add event listener when the dropdown is open
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Close profile modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileModalRef.current && !profileModalRef.current.contains(event.target)) {
        setProfileModalOpen(false); // Close the profile modal
      }
    };

    // Add event listener when the profile modal is open
    if (isProfileModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileModalOpen]);

  // Close settings modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsModalRef.current && !settingsModalRef.current.contains(event.target)) {
        setSettingsModalOpen(false); // Close the settings modal
      }
    };

    // Add event listener when the settings modal is open
    if (isSettingsModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSettingsModalOpen]);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
          setProfileIconUrl(data.profileIcon || 'public/default-profile.png');
          setEditData(data);

          // Check if the user signed in with Google and has no password set
          if (user.providerData.some((provider) => provider.providerId === 'google.com') && !data.hasPassword) {
            setPasswordModalOpen(true); // Open password modal
          }
        }
      }
    };
    fetchProfileData();
  }, [user]);

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert('Logged out successfully!');
      navigate('/');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleDashboardClick = () => navigate('/dashboard');

  const handleMonthlyPlannerClick = () => {
    navigate('/monthly-planner');
  };

  const handleProfileClick = () => {
    setProfileModalOpen(true);
    setDropdownOpen(false);
  };

  const handleSettingsClick = () => {
    setSettingsModalOpen(true);
    setDropdownOpen(false);
  };

  const handleAdminPanelClick = () => {
    navigate('/admin');
    setDropdownOpen(false);
  };

  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    if (name === 'currentPassword') {
      setCurrentPassword(value);
    } else if (name === 'newPassword') {
      setNewPassword(value);
    } else if (name === 'confirmNewPassword') {
      setConfirmNewPassword(value);
    } else {
      setEditData({ ...editData, [name]: value });
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const storageRef = ref(storage, `profileImages/${user.uid}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        setProfileIconUrl(downloadURL);
        setEditData({ ...editData, profileIcon: downloadURL }); // Update editData with new profile icon URL
      } catch (error) {
        alert(`Error uploading profile image: ${error.message}`);
      }
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      alert('Please fill in all password fields.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      alert('New password and confirm password do not match.');
      return;
    }

    try {
      // Reauthenticate the user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);

      // Update the password
      await updatePassword(auth.currentUser, newPassword);
      alert('Password updated successfully!');

      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      alert(`Error updating password: ${error.message}`);
    }
  };

  const handleSetPasswordAndProfile = async () => {
    if (!newPassword || !confirmNewPassword || !dob || !gender || !selectedPlan) {
      alert('Please fill in all required fields.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      alert('New password and confirm password do not match.');
      return;
    }

    if (selectedPlan === 'premium' && (!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv)) {
      alert('Please fill in all card details for the Premium Plan.');
      return;
    }

    try {
      // Set the password
      await updatePassword(auth.currentUser, newPassword);

      // Update Firestore with profile details
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        hasPassword: true,
        dob,
        gender,
        plan: selectedPlan,
        cardDetails: selectedPlan === 'premium' ? cardDetails : null, // Save card details only for premium plan
        firstName: editData.firstName || userData.firstName || '', // Use existing data if available
        lastName: editData.lastName || userData.lastName || '', // Use existing data if available
        profileIcon: profileIconUrl, // Save the profile icon URL
        createdAt: userData.createdAt || new Date(), // Use existing creation date or set a new one
        isAdmin: userData.isAdmin || false, // Preserve admin status
      });

      alert('Profile completed successfully!');
      setPasswordModalOpen(false);
    } catch (error) {
      alert(`Error completing profile: ${error.message}`);
    }
  };

  const handleSaveSettings = async () => {
    if (user) {
      let updatedData = { ...editData };

      // Update profile photo if a new file is selected
      if (selectedFile) {
        const storageRef = ref(storage, `profileImages/${user.uid}`);
        await uploadBytes(storageRef, selectedFile);
        const downloadURL = await getDownloadURL(storageRef);
        updatedData.profileIcon = downloadURL;
      }

      // Save profile settings to Firestore
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, updatedData);

      // Update local state
      setUserData(updatedData);
      setProfileIconUrl(updatedData.profileIcon);

      // Handle password change if fields are filled
      if (currentPassword || newPassword || confirmNewPassword) {
        await handlePasswordChange();
      }

      alert('Settings updated successfully!');
      setSettingsModalOpen(false);
    }
  };

  const formatCreatedAt = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate('/')}>
        <img src="public/FW Logo.png" alt="Logo" />
        <span className="navbar-name-orange">Fin</span>
        <span className="navbar-name-white">Wizard</span>
      </div>

      <div className="button-container">
        {/* Monthly Planner Button - Only visible for premium users */}
        {userData.plan === 'premium' && (
          <button className="monthly-planner-button" onClick={handleMonthlyPlannerClick}>
            <span className="monthly-planner-button-text">
              <img src="public/t.png" alt="Monthly Planner" className="button-icon" />
              Tools
            </span>
          </button>
        )}

        {/* Dashboard Button */}
        <button className="gradient-button" onClick={handleDashboardClick}>
          <span className="button-text">
            <img src="public/d.png" alt="Dashboard" className="gradient-button-icon" />
            Dashboard
          </span>
        </button>

        {/* Profile Dropdown */}
        <div className="profile-dropdown" ref={dropdownRef}>
          <button className="profile-icon" onClick={toggleDropdown}>
            <img src={profileIconUrl} alt="Profile" className="profile-photo" />
          </button>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              {/* User Info Section */}
              <div className="px-4 py-3 pb-0.5 text-base text-gray-900 dark:text-white">
                <div>{userData.firstName} {userData.lastName}</div>
                <div className="font-medium truncate">{userData.email}</div>
              </div>
              <hr />

              {/* Dropdown Options */}
              <ul>
                <li onClick={handleProfileClick}>View Profile</li>
                <li onClick={handleSettingsClick}>Settings</li>
                {/* Show Admin Panel link only if user is an admin */}
                {userData.isAdmin && <li onClick={handleAdminPanelClick}>Admin Panel</li>}
                <li onClick={handleLogout}>Logout</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content profile-modal" ref={profileModalRef}>
            <h2>User Profile</h2>
            <img src={profileIconUrl} alt="Profile" className="profile-photo-large" />
            <p><strong>Name:</strong> {userData.firstName} {userData.lastName}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Date of Birth:</strong> {userData.dob}</p>
            <p><strong>Gender:</strong> {userData.gender}</p>
            <p><strong>Plan:</strong> {userData.plan || 'No plan selected'}</p>
            <p><strong>Member Since:</strong> {formatCreatedAt(userData.createdAt)}</p>
            <button onClick={() => setProfileModalOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content settings-modal" ref={settingsModalRef}>
            <h2>Settings</h2>
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={editData.firstName || ''}
              onChange={handleSettingsChange}
            />

            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={editData.lastName || ''}
              onChange={handleSettingsChange}
            />

            <label>Profile Photo</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />

            {/* Password Change Section */}
            <h3>Change Password</h3>
            <label>Current Password</label>
            <input
              type="password"
              name="currentPassword"
              placeholder="Enter current password"
              onChange={handleSettingsChange}
            />

            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              placeholder="Enter new password"
              onChange={handleSettingsChange}
            />

            <label>Confirm New Password</label>
            <input
              type="password"
              name="confirmNewPassword"
              placeholder="Confirm new password"
              onChange={handleSettingsChange}
            />

            {/* Save and Cancel Buttons */}
            <button onClick={handleSaveSettings}>Save</button>
            <button onClick={() => setSettingsModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {isPasswordModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content password-modal">
            <h2>Complete Your Profile</h2>
            <p>You signed in with Google. Please complete your profile to continue.</p>

            {/* Password Fields */}
            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              placeholder="Enter new password"
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <label>Confirm New Password</label>
            <input
              type="password"
              name="confirmNewPassword"
              placeholder="Confirm new password"
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />

            {/* Date of Birth */}
            <label>Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />

            {/* Gender Selection */}
            <label>Gender</label>
            <select
              name="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            {/* Plan Selection */}
            <div className="form-group1">
              <label>Choose Plan:</label>
              <div className="plan-options">
                <div
                  className={`plan-card ${selectedPlan === 'free' ? 'selected' : ''}`}
                  onClick={() => setSelectedPlan('free')}
                >
                  <h3>Free Plan</h3>
                  <p>Basic features for free</p>
                  <div className="price">£0 <small>/month</small></div>
                </div>
                <div
                  className={`plan-card ${selectedPlan === 'premium' ? 'selected' : ''}`}
                  onClick={() => setSelectedPlan('premium')}
                >
                  <h3>Premium Plan</h3>
                  <p>Access to all features</p>
                  <div className="price">£9 <small>/month</small></div>
                </div>
              </div>
            </div>

            {/* Card Details (for Premium Plan) */}
            {selectedPlan === 'premium' && (
              <div className="payment-details">
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Card Number"
                    className="form-input"
                    value={cardDetails.cardNumber}
                    onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Expiry Date (MM/YY)"
                    className="form-input"
                    value={cardDetails.expiryDate}
                    onChange={(e) => setCardDetails({ ...cardDetails, expiryDate: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="CVV"
                    className="form-input"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                    required
                  />
                </div>
              </div>
            )}

            {/* Save Button */}
            <button onClick={handleSetPasswordAndProfile}>Save</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default LoggedNavbar;