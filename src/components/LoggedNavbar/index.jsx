import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '/firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './LoggedNavbar.css';

const LoggedNavbar = ({ user }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [profileIconUrl, setProfileIconUrl] = useState('public/default-profile.png');
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [userData, setUserData] = useState({});
  const [editData, setEditData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);

  const navigate = useNavigate();
  const storage = getStorage();

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
          setProfileIconUrl(data.profileIcon || 'public/default-profile.png');
          setEditData(data);
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

  const handleSettingsChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSaveSettings = async () => {
    if (user) {
      let updatedData = { ...editData };

      if (selectedFile) {
        const storageRef = ref(storage, `profileImages/${user.uid}`);
        await uploadBytes(storageRef, selectedFile);
        const downloadURL = await getDownloadURL(storageRef);
        updatedData.profileIcon = downloadURL;
      }

      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, updatedData);
      setUserData(updatedData);
      setProfileIconUrl(updatedData.profileIcon);
      alert('Settings updated successfully!');
      setSettingsModalOpen(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate('/')}>
        <img src="public/FW Logo.png" alt="Logo" />
        <span className="navbar-name-orange">Fin</span>
        <span className="navbar-name-white">Wizard</span>
      </div>

      <div className="button-container">
        {/* Monthly Planner Button */}
        <button className="monthly-planner-button" onClick={handleMonthlyPlannerClick}>
          <span className="monthly-planner-button-text">
            <img src="public/p.png" alt="Monthly Planner" className="button-icon" />
            Monthly Planner
          </span>
        </button>

        {/* Dashboard Button */}
        <button className="gradient-button" onClick={handleDashboardClick}>
          <span className="button-text">
            <img src="public/dasboard.png" alt="Dashboard" className="button-icon" />
            Dashboard
          </span>
        </button>

        {/* Profile Dropdown */}
        <div className="profile-dropdown">
          <button className="profile-icon" onClick={toggleDropdown}>
            <img src={profileIconUrl} alt="Profile" className="profile-photo" />
          </button>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              {/* User Info Section */}
              <div className="px-4 py-3 pb-0.5  text-base text-gray-900 dark:text-white">
                <div>{userData.firstName} {userData.lastName}</div>
                <div className="font-medium truncate">{userData.email}</div>
              </div><hr />

              {/* Dropdown Options */}
              <ul>
                <li onClick={handleProfileClick}>View Profile</li>
                <li onClick={handleSettingsClick}>Settings</li>
                <li onClick={handleLogout}>Logout</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content profile-modal">
            <h2>User Profile</h2>
            <img src={profileIconUrl} alt="Profile" className="profile-photo-large" />
            <p><strong>Name:</strong> {userData.firstName} {userData.lastName}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Date of Birth:</strong> {userData.dob}</p>
            <p><strong>Gender:</strong> {userData.gender}</p>
            {/* Add Plan and Registration Date */}
            <p><strong>Plan:</strong> {userData.plan || 'No plan selected'}</p>
            <p><strong>Member Since:</strong> {userData.registrationDate || 'N/A'}</p>
            <button onClick={() => setProfileModalOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content settings-modal">
            <h2>Settings</h2>
            <label>First Name</label>
            <input type="text" name="firstName" value={editData.firstName || ''} onChange={handleSettingsChange} />
            
            <label>Last Name</label>
            <input type="text" name="lastName" value={editData.lastName || ''} onChange={handleSettingsChange} />

            <label>Profile Photo</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            
            <button onClick={handleSaveSettings}>Save</button>
            <button onClick={() => setSettingsModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default LoggedNavbar;