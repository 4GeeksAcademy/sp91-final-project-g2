import React, { useState, useContext } from 'react';
import { Context } from '../store/appContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/signup.css';
import LoadingSpinner from './LoadingSpinner.jsx';


const SignUp = () => {
  const { actions } = useContext(Context);
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // Estado para el componente de carga

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Mostrar el componente de carga
    const response = await actions.signup(firstName, lastName, address, phone, email, password, role);

    if (response.success) {
      setLoading(false); // Ocultar el componente de carga
      navigate('/profile'); // Redirigir al perfil
    } else {
      setLoading(false);
      setMessage('Error en el registro: ' + response.message);
    }
  };

  return (
    <div className="body">
       {loading && <LoadingSpinner />}
      <div className="grad"></div>
      <div className="header">
        <div>Cafe<span>taleros</span></div>
      </div>
      <br />
      <div className="login">
      {!loading && (
          <form onSubmit={handleSubmit}>
            <h2 className="signup-title"> Únete, ¡más café, más opciones!</h2>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            /><br />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            /><br />
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            /><br />
            <input
              type="text"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            /><br />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            /><br />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            /><br />
            <div className="role-container">
              <label htmlFor="role">Role</label>
              <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="customer">Customer</option>
                <option value="vendor">Vendor</option>
              </select>
            </div><br />
            <input type="submit" value="Sign Up" />
          </form>
        )}
        {message && <p>{message}</p>}
        <p className="log">¿Ya tienes una cuenta? <a href="/login" id="login-link">Log In</a></p>
      </div>
    </div>
  );
};

export default SignUp;