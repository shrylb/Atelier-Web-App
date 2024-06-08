import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "../FirebaseConfig";
import "./HeaderStyle.css";
import { auth } from "../FirebaseConfig";
import { AuthContext } from "./AuthContext";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { Avatar } from "@mui/material";

const Header: React.FC = () => { 
  const currentUser = useContext(AuthContext);
  const [logoIconURL, setLogoIconURL] = useState("");
  const [profileIconURL, setProfileIconURL] = useState("");
  const [notifURL, setNotifIconURL] = useState("");
  const [messageURL, setMessageIconURL] = useState("");
  const [cartURL, setCartIconURL] = useState("");
  const navigate = useNavigate(); // Import useNavigate hook
  const [userData, setUserData] = useState(null);
  const { userId } = useParams();


  useEffect(() => {
    fetchIconURLs(); // Fetch icon URLs
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "accounts", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
          // Fetch collections
          const collectionsRef = collection(docRef, "collections");
          const collectionsSnapshot = await getDocs(collectionsRef);
          const collectionsList = collectionsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
         
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchData();
  }, [userId, db]);
  // console.log("USERDATA",userData)

  const fetchIconURLs = async () => {
    try {
      // Fetch icon URLs from Firebase Storage
      const iconsRef = ref(storage, "icons");
      const logoURL = await getDownloadURL(ref(iconsRef, "atelier-logo.png"));
      const profileURL = await getDownloadURL(ref(iconsRef, "avatar1.png"));
      const cartURL = await getDownloadURL(ref(iconsRef, "cart-icon.png"));
      const messageURL = await getDownloadURL(
        ref(iconsRef, "message-icon.png")
      );
      const notifURL = await getDownloadURL(ref(iconsRef, "notif-icon.png"));

      setLogoIconURL(logoURL);
      setProfileIconURL(profileURL);
      setCartIconURL(cartURL);
      setMessageIconURL(messageURL);
      setNotifIconURL(notifURL);
    } catch (error) {
      console.error("Error fetching icon URLs:", error);
    }
  };

  const handleProfileClick = () => {
    // Retrieve the document ID of the current user from local storage
    const docId = localStorage.getItem("currentUserDocId");

    // If the document ID exists
    if (docId) {
      // Navigate to the user's profile page with the document ID in the URL
      navigate(`/user/${docId}`);
    } else {
      console.error("Document ID not found in local storage.");
    }
  };

  return (
    <header>
      <section id="header">
        <div id="atelier-brand">
          <div>
            <Link to="/home">
              <img src={logoIconURL} className="logo" alt="Atelier Logo" />
            </Link>
          </div>
        </div>

        <div id="navi">
          <ul id="navbar">
            <li>
              <Link to="/home">Home</Link>
            </li>
            <li>
              <Link to="/explore">Explore</Link>
            </li>
            <li>
              <Link to="/shop">Shop</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
          </ul>
        </div>

        <div id="header-icons">
          <div id="icons-main-container">
            <div className="icons-box">
              <Link to="/transaction">
                <img src={cartURL} className="icons" alt="cart" />
              </Link>
              {/* <div className="cart-count">0</div> */}
            </div>
            <div>
              <Link to="/chats">
                <img src={messageURL} className="icons" alt="message" />
              </Link>
            </div>
            {/* <div>
              <Link to="/Notification">
                <img src={notifURL} className="icons" alt="notif" />
              </Link>
            </div> */}
          </div>

          <div id="profile-box">
            <Avatar
          src={userData?.profilePhoto || profileIconURL}
          className="profile"
              alt="Profile Circle"
              onClick={handleProfileClick}
            />
          </div>
        </div>
      </section>
    </header>
  );
};

export default Header;
