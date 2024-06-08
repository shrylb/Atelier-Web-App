import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getDownloadURL, ref, listAll } from "firebase/storage";
import { storage } from "../../../FirebaseConfig";
import "./CartStyle.css";
import Header from "../../Header";
import Footer from "../../Footer";
//import remove_icon from '../assets/remove-icon.png';

const Cart: React.FC = () => {
  return (
    <div>
     <Header isLoggedIn={false} />
      <div className="CartItems">
        <div className="CartItems-main">
            <p>Product</p>
            <p>Title</p>
            <p>Price</p>
            <p>Quantitiy</p>
            <p>Total</p>
            <p>Remove</p>
        </div>
        <hr />
        <div>
            <div className="CartItems-format">
                <img src="" alt="cart-product-icon"/>
                <p></p>
                <p></p>
                <button className="quantity">0</button>
                <p></p>
                <img src="./src/assets/remove-icon.png" alt="" id="remove" />
            </div>
            <hr />

        </div>
      </div>
      <Footer />
    </div>
  );
};


export default Cart;
