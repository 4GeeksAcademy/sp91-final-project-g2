import React from 'react';
import '../../styles/profileform.css';

const ProfileForm = () => {
  // URL de una imagen aleatoria de Lorem Picsum
  const randomImageUrl = 'https://picsum.photos/100';

  return (
    <div className="portfoliocard">
      <div className="coverphoto"></div>
      <div className="profile_picture">
        <img src={randomImageUrl} alt="Profile" />
      </div>
      <div className="left_col">
        <div className="followers">
          <div className="follow_count">78</div>
          Products on sale
        </div>
        <div className="following">
          <div className="follow_count">18</div>
          Sales
        </div>
      </div>
      <div className="right_col">
        <h2 className="name">John Doe</h2>
        <h3 className="location">San Francisco, CA</h3>
        <ul className="contact_information">
          <li className="work">CEO</li>
          <li className="website"><a className="nostyle" href="#">www.apple.com</a></li>
          <li className="mail">john.doe@apple.com</li>
          <li className="phone">1-(732)-757-2923</li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileForm;