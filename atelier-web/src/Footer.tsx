// Footer.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../FirebaseConfig';
import './FooterStyle.css';

const Footer: React.FC = () => {
  const [logoIconURL, setLogoIconURL] = useState('');
  const [twitterIconURL, setTwitterIconURL] = useState('');
  const [facebookIconURL, setFacebookIconURL] = useState('');
  const [messengerIconURL, setMessengerIconURL] = useState('');
  const [instagramIconURL, setInstagramIconURL] = useState('');

  useEffect(() => {
    fetchIconURLs(); // Fetch icon URLs
  }, []);

  const fetchIconURLs = async () => {
    try {
      // Fetch icon URLs from Firebase Storage
      const iconsRef = ref(storage, 'icons');
      const logoURL = await getDownloadURL(ref(iconsRef, 'atelier-logo.png'));
      const twitterURL = await getDownloadURL(ref(iconsRef, 'twitter-icon.png'));
      const facebookURL = await getDownloadURL(ref(iconsRef, 'facebook-icon.png'));
      const messengerURL = await getDownloadURL(ref(iconsRef, 'messenger-icon.png'));
      const instagramURL = await getDownloadURL(ref(iconsRef, 'insta-icon.png'));
      
      setLogoIconURL(logoURL);
      setTwitterIconURL(twitterURL);
      setFacebookIconURL(facebookURL);
      setMessengerIconURL(messengerURL);
      setInstagramIconURL(instagramURL);
    } catch (error) {
      console.error('Error fetching icon URLs:', error);
    }
  };

  return (
    <div id="footer">

      <footer id='footer-main'>

        <div id='footer-head'>
          <div><Link to="/"><img src={logoIconURL} className="logo" alt="Atelier Logo" /></Link></div>
        </div>

        <div id='footer-body'>

          <div id="footer-navbar">

            <div className='text-links'>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Terms and Conditions</a></li>
            </div>
            <div className='text-links'>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">About Us</a></li>
            </div>

          </div>

          <div id="footer-icons">
            <img src={twitterIconURL} alt="Twitter" className="socmed" />
            <img src={facebookIconURL} alt="Facebook" className="socmed" />
            <img src={messengerIconURL} alt="Messenger" className="socmed" />
            <img src={instagramIconURL} alt="Instagram" className="socmed" />
          </div>

        </div>

      </footer>

      <div id='footer-end'>
        <h4 id='copyright'>Copyright 2024</h4>
      </div>

    </div>
  );
};

export default Footer;
