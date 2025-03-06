import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../store/appContext';
import '../../styles/profilepage.css';

const ProfilePage = () => {
  const { store, actions } = useContext(Context);
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    address: '',
    phone: '',
    email: '',
    role: ''
  });

  useEffect(() => {
    // Obtener los datos del perfil del usuario
    const fetchProfile = async () => {
      const data = await actions.getProfile();
      if (data) {
        setProfile(data);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="profile-page">
      <h2>Profile</h2>
      <div className="profile-picture">
        <img src="https://picsum.photos/100" alt="Profile" />
      </div>
      <div className="form-group">
        <label htmlFor="first_name">First Name</label>
        <input
          type="text"
          id="first_name"
          name="first_name"
          value={profile.first_name}
          disabled
        />
      </div>
      <div className="form-group">
        <label htmlFor="last_name">Last Name</label>
        <input
          type="text"
          id="last_name"
          name="last_name"
          value={profile.last_name}
          disabled
        />
      </div>
      <div className="form-group">
        <label htmlFor="address">Address</label>
        <input
          type="text"
          id="address"
          name="address"
          value={profile.address}
          disabled
        />
      </div>
      <div className="form-group">
        <label htmlFor="phone">Phone</label>
        <input
          type="text"
          id="phone"
          name="phone"
          value={profile.phone}
          disabled
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={profile.email}
          disabled
        />
      </div>
      <div className="form-group">
        <label htmlFor="role">Role</label>
        <input
          type="text"
          id="role"
          name="role"
          value={profile.role}
          disabled
        />
      </div>
    </div>
  );
};

export default ProfilePage;