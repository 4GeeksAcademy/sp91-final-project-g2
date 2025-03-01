import React, { useState, useContext } from 'react';
import { Context } from '../store/appContext';
import '../../styles/signup.css';

const SignUp = () => {
  const { actions } = useContext(Context);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');

  const handleSubmit = (e) => {
    e.preventDefault();
    actions.signup(firstName, lastName, address, phone, email, password, role);
  };

  return (
    <div className="body">
      <div className="grad"></div>
      <div className="header">
        <div>Cafe<span>taleros</span></div>
      </div>
      <br />
      <div className="login">
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
      </div>
    </div>
  );
};

export default SignUp;