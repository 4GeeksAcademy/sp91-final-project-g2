import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';
import LoadingSpinner from './LoadingSpinner.jsx';
import Pages from './Pages.jsx';
import '../../styles/profileform.css';

const ProfileForm = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    if (!store.token) {
      navigate('/login');
    } else {
      actions.getProfile();
    }
  }, [store.token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await actions.updateProfile(profile);
    if (response.success) {
      console.log('Perfil actualizado:', profile);
    } else {
      console.error('Error al actualizar el perfil:', response.message);
    }
  };

  if (store.loading) {
    return <LoadingSpinner />;
  }

  if (!store.profile) {
    return null;
  }

  // URL de una imagen aleatoria de Lorem Picsum
  const randomImageUrl = 'https://picsum.photos/100';

  const isVendor = store.profile.role === 'vendor';

  return (
    <div className="portfoliocard">
      <div className="coverphoto"></div>
      <div className="profile_picture">
        <img src={randomImageUrl} alt="Profile" />
      </div>
      <div className="left_col">
        {isVendor ? (
          <>
            <div className="followers">
              <div className="follow_count">{store.profile.productsOnSale}</div>
              Products on sale
            </div>
            <div className="following">
              <div className="follow_count">{store.profile.sales}</div>
              Sales
            </div>
          </>
        ) : (
          <>
            <div className="followers">
              <div className="follow_count">{store.profile.orders}</div>
              Orders
            </div>
            <div className="following">
              <div className="follow_count">{store.profile.purchases}</div>
              Purchases
            </div>
          </>
        )}
      </div>
      <div className="right_col">
        <h2 className="name">{store.profile.firstName} {store.profile.lastName}</h2>
        <h3 className="location">{store.profile.address}</h3>
        <ul className="contact_information">
          <li className="role">{isVendor ? 'Vendor' : 'Customer'}</li>
          <li className="mail">{store.profile.email}</li>
          <li className="phone">{store.profile.phone}</li>
        </ul>
        <div className="edit-button-container">
          <button className="edit-button" onClick={() => navigate('/edit-profile')}>Editar</button>
        </div>
      </div>
      <Pages items={store.profile.products} itemsPerPage={store.itemsPerPage} />
    </div>
  );
};

export default ProfileForm;

