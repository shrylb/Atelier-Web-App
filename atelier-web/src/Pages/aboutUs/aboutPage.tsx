import React from 'react';
import './aboutStyle.css';
import Header from '../../Header';

const About: React.FC = () => {
    return (
        <div className="container">
            <Header />
            <div className="banner">
                <img src='./src/assets/Banner-fotor.png' alt="About Us Banner" className="bannerImage" />
                <div className="bannerText">
                    <h1 className="bannerHeading">Welcome to Atelier</h1>
                    <h2 className="bannerSubheading">we create a safe space for art</h2>
                </div>
            </div>
            <div className="pinkSection">
                <div className="textContainer">
                    <div className="textBox">
                        <img src='./src/assets/atelier-logo2.png' alt="About Us Banner" className="logoImage" />
                        <p className="paragraph">is an online platform dedicated to empowering local artists in the Philippines. At Atelier, we believe in the transformative power of art and strive to provide a safe and comfortable space for artists to showcase and sell their work.</p>
                    </div>
                </div>
                <div className="imageContainer">
                    <img src="./src/assets/aboutpicc1.png" alt="Image" />
                </div>
            </div>
            <div className="teamSection">
                <h2>Meet Our Team</h2>
                <div className="teamMembers">
                    <div className="teamMember">
                        <img src="./src/assets/jaren.png" alt="jaren" className="teamMemberImage" />
                        <p className="teamMemberName">Jaren Ong</p>
                        <p className="teamMemberPosition">CEO</p>
                    </div>
                    <div className="teamMember">
                        <img src="./src/assets/angel.png" alt="Team Member 2" className="teamMemberImage" />
                        <p className="teamMemberName">Angelica Custodio</p>
                        <p className="teamMemberPosition">CEO</p>
                    </div>
                    <div className="teamMember">
                        <img src="./src/assets/kyle.png" alt="Team Member 2" className="teamMemberImage" />
                        <p className="teamMemberName">Rojane Madera</p>
                        <p className="teamMemberPosition">CEO</p>
                    </div>
                    <div className="teamMember">
                        <img src="./src/assets/anne.png" alt="Team Member 2" className="teamMemberImage" />
                        <p className="teamMemberName">Trixie Depra</p>
                        <p className="teamMemberPosition">CEO</p>
                    </div>
                    <div className="teamMember">
                        <img src="./src/assets/shryl.png" alt="Team Member 2" className="teamMemberImage" />
                        <p className="teamMemberName">Sheryl Betonio</p>
                        <p className="teamMemberPosition">CEO</p>
                    </div>
                </div>
            </div>
            <div className="pinkSection2">
                <div className="imageContainer2">
                    <img src="./src/assets/aboutpic2.png" alt="Image" className='missionImg' />
                </div>
                <div className="textContainer2">
                    <div className="textBox2">
                        <h2>Our Mission</h2>
                        <p className="paragraph2">We are dedicated to fostering a vibrant artistic community in the Philippines by providing local artists with a platform to showcase their talent, connect with art enthusiasts, and thrive financially. Celebrating the diversity of Filipino art and culture, we empower artists to pursue their passion and contribute to society. Through innovation and inclusivity, we strive to be the premier destination for discovering and supporting artists in the Philippines.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
