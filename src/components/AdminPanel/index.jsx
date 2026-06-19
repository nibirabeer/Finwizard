import React, { useEffect, useState } from 'react';
import { db } from '/firebase';
import { collection, onSnapshot, doc, deleteDoc, addDoc, updateDoc } from 'firebase/firestore';
import './AdminPanel.css';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setEditUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dob: '',
    gender: '',
    plan: 'free',
    isAdmin: false,
    profileIcon: '', // Add this field for the profile image URL
  });

  // Real-time listener for users collection
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
    });
    return () => unsubscribe();
  }, []);

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteDoc(doc(db, 'users', id));
        alert('User deleted successfully!');
      } catch (error) {
        alert(`Error deleting user: ${error.message}`);
      }
    }
  };

  const openAddUserModal = () => {
    setAddUserModalOpen(true);
  };

  const closeAddUserModal = () => {
    setAddUserModalOpen(false);
    resetUserForm();
  };

  const openEditUserModal = (user) => {
    setSelectedUser(user);
    setEditUserModalOpen(true);
  };

  const closeEditUserModal = () => {
    setEditUserModalOpen(false);
    setSelectedUser(null);
  };

  const resetUserForm = () => {
    setNewUser({
      firstName: '',
      lastName: '',
      email: '',
      dob: '',
      gender: '',
      plan: 'free',
      isAdmin: false,
      profileIcon: '', // Reset profile icon URL
    });
  };

  const handleUserChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (selectedUser) {
      setSelectedUser({
        ...selectedUser,
        [name]: type === 'checkbox' ? checked : value,
      });
    } else {
      setNewUser({
        ...newUser,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const handleAddUser = async () => {
    if (!newUser.firstName || !newUser.lastName || !newUser.email) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      await addDoc(collection(db, 'users'), {
        ...newUser,
        createdAt: new Date(),
        savings: 0,
        expenses: 0,
        profileIcon: '', // Default to empty or provide a default image URL
      });
      alert('User added successfully!');
      closeAddUserModal();
    } catch (error) {
      alert(`Error adding user: ${error.message}`);
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser.firstName || !selectedUser.lastName || !selectedUser.email) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      await updateDoc(doc(db, 'users', selectedUser.id), selectedUser);
      alert('User updated successfully!');
      closeEditUserModal();
    } catch (error) {
      alert(`Error updating user: ${error.message}`);
    }
  };

  return (
    <div className="admin-panel">
      <h1 className="admin-panel-title">ADMIN PANEL</h1>
      <button className="add-user-button" onClick={openAddUserModal}>
        Add New User
      </button>

      {/* Users List */}
      <div className="users-list-container">
        <div className="users-list-header">
          <h5 className="users-list-title">Latest Users</h5>
        </div>
        <div className="users-list-content">
  <ul className="users-list">
    {users.map((user) => (
      <li key={user.id} className={`user-item ${user.isAdmin ? 'admin' : ''}`}>
        <div className="user-item-content">
          <div className="user-item-avatar">
            <img
              className="user-avatar-img"
              src={user.profileIcon || '/path/to/default-image.jpg'}
              alt={`${user.firstName} ${user.lastName}`}
            />
          </div>
          <div className="user-item-info">
            <p className="user-name">{user.firstName} {user.lastName}</p>
            <p className="user-email">{user.email}</p>
          </div>
          <div className="user-item-plan">
            {user.plan === 'premium' ? 'Premium' : 'Free'}
          </div>
          <div className="user-item-actions">
            <button className="edit-user-button" onClick={() => openEditUserModal(user)}>Edit</button>
            <button className="delete-user-button" onClick={() => handleDeleteUser(user.id)}>Delete</button>
          </div>
        </div>
      </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <UserModal
          title="Add New User"
          userData={newUser}
          handleChange={handleUserChange}
          handleSave={handleAddUser}
          handleClose={closeAddUserModal}
        />
      )}

      {/* Edit User Modal */}
      {isEditUserModalOpen && (
        <UserModal
          title="Edit User"
          userData={selectedUser}
          handleChange={handleUserChange}
          handleSave={handleEditUser}
          handleClose={closeEditUserModal}
        />
      )}
    </div>
  );
};

const UserModal = ({ title, userData, handleChange, handleSave, handleClose }) => (
  <div className="modal1-overlay">
    <div className="modal1-content">
      <h2>{title}</h2>
      <form>
        <label className="modal1-label">First Name</label>
        <input className="modal1-input" type="text" name="firstName" value={userData.firstName} onChange={handleChange} required />

        <label className="modal1-label">Last Name</label>
        <input className="modal1-input" type="text" name="lastName" value={userData.lastName} onChange={handleChange} required />

        <label className="modal1-label">Email</label>
        <input className="modal1-input" type="email" name="email" value={userData.email} onChange={handleChange} required />

        <label className="modal1-label">Date of Birth</label>
        <input className="modal1-input" type="date" name="dob" value={userData.dob} onChange={handleChange} />

        <label className="modal1-label">Gender</label>
        <select className="modal1-select" name="gender" value={userData.gender} onChange={handleChange}>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <label className="modal1-label">Plan</label>
        <select className="modal1-select" name="plan" value={userData.plan} onChange={handleChange}>
          <option value="free">Free</option>
          <option value="premium">Premium</option>
        </select>

        <label className="modal1-label">
          <input className="modal1-checkbox" type="checkbox" name="isAdmin" checked={userData.isAdmin} onChange={handleChange} />
          Is Admin
        </label>

        <label className="modal1-label">Profile Picture</label>
        <input className="modal1-input" type="url" name="profileIcon" value={userData.profileIcon} onChange={handleChange} placeholder="Profile Picture URL" />

        <div className="modal1-buttons">
          <button className="modal1-save-button" type="button" onClick={handleSave}>Save</button>
          <button className="modal1-cancel-button" type="button" onClick={handleClose}>Cancel</button>
        </div>
      </form>
    </div>
  </div>
);

export default AdminPanel;
