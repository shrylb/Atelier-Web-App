import React, { useState, useEffect } from "react";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../../FirebaseConfig";
import "./ProductStyle.css";
import Header from "../../Header";
import Footer from "../../Footer";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { Link } from "@mui/material";

const Product: React.FC = () => {
  var location = useLocation();
  const { artwork } = location.state;
  console.log("artwork", artwork); // Destructure artwork from location.state

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [stickerImageUrl, setStickerImageUrl] = useState<string | null>(null);
  const [bookmarkImageUrl, setBookmarkImageUrl] = useState<string | null>(null);
  const [mediumImageUrl, setMediumImageUrl] = useState<string | null>(null);

  useEffect(() => {
    // Reference to the image in Firebase storage
    const imageRef = ref(storage, "bg2.jpg");
    const stickerRef = ref(storage, "bg2.jpg");
    const bookmarkRef = ref(storage, "bg2.jpg");
    const mediumRef = ref(storage, "bg2.jpg");

    // Get the download URL of the images
    getDownloadURL(imageRef)
      .then((url) => {
        // Set the image URL to state
        setImageUrl(url);
      })
      .catch((error) => {
        console.error("Error getting download URL:", error);
      });

    getDownloadURL(stickerRef)
      .then((url) => {
        // Set the sticker image URL to state
        setStickerImageUrl(url);
      })
      .catch((error) => {
        console.error("Error getting sticker image download URL:", error);
      });

    getDownloadURL(bookmarkRef)
      .then((url) => {
        // Set the bookmark image URL to state
        setBookmarkImageUrl(url);
      })
      .catch((error) => {
        console.error("Error getting bookmark image download URL:", error);
      });

    getDownloadURL(mediumRef)
      .then((url) => {
        // Set the medium image URL to state
        setMediumImageUrl(url);
      })
      .catch((error) => {
        console.error("Error getting medium image download URL:", error);
      });
  }, []);

  return (
    <div>
      <Header isLoggedIn={false} />
      <div className="container">
        <div className="artwork-container">
          <div className="artwork">
            {imageUrl && <img src={artwork.coverPhoto} alt="Artwork" />}
          </div>
          <p>{artwork.name}</p>
        </div>
        <div className="details-container">
          <div className="artist-info">
            <div className="profile-pic"></div>
            {/* <p>artwork.</p> */}
            {/* // name of artist??? */}
          </div>
          <div className="description">
            <h3>Artwork Description</h3>
            <h5>{artwork.description}</h5>
          </div>
          <div className="tags">
            <div className="tag">Tag 1</div>
            <div className="tag">Tag 2</div>
            <div className="tag">Tag 3</div>
          </div>
          <div className="price">${artwork.price}</div>
          <div className="buttons">
            <Link to="/chats" className="button">
              Message
            </Link>
            {/* <a href="#" className="button">Buy</a>
            <a href="#" className="button">Add to Cart</a> */}
          </div>
        </div>
      </div>
      <div className="available">
        <h3>
          Available as:{" "}
          <div className="tags">
            <div className="tag">{artwork.tags[0]}</div>
          </div>
        </h3>
      </div>
      <div className="availability">
        <h2>Also available as:</h2>
        <div className="availability-options">
          <div className="availability-option">
            <div className="availability-item">
              {stickerImageUrl && <img src={stickerImageUrl} alt="Stickers" />}
              <p>Stickers</p>
            </div>
            <div className="price">$10</div>
          </div>
          <div className="availability-option">
            <div className="availability-item">
              {bookmarkImageUrl && (
                <img src={bookmarkImageUrl} alt="Bookmarks" />
              )}
              <p>Bookmarks</p>
            </div>
            <div className="price">$15</div>
          </div>
          <div className="availability-option">
            <div className="availability-item">
              {mediumImageUrl && <img src={mediumImageUrl} alt="Medium" />}
              <p>Medium</p>
            </div>
            <div className="price">$20</div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Product;
