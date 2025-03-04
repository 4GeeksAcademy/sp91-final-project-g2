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
    email: ''
  });

  useEffect(() => {
    // Simular la obtención de datos del perfil
    const fetchProfile = async () => {
      const data = await actions.getProfile();
      if (data) {
        setProfile(data);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica para actualizar el perfil del usuario
    console.log('Perfil actualizado:', profile);
  };

  return (
    <div className="profile-page">
      <h2>Perfil</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="first_name">Nombre</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={profile.first_name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="last_name">Apellido</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={profile.last_name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Dirección</label>
          <input
            type="text"
            id="address"
            name="address"
            value={profile.address}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Teléfono</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="submit-button">Actualizar</button>
      </form>
    </div>
  );
};

export default ProfilePage;