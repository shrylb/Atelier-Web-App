import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import LogInPage from "./Pages/Login/LogIn";
import Home from "./Pages/home/HomePage";
import SignUpPage from "./Pages/Signup/SignUp";
import FirebaseTest from "./Pages/test pages/FirebaseTest";
import Product from "./Pages/Product/ProductPage";
import Shop from "./Pages/shop/shopPage";
import MyCart from "./Pages/MyCart/Cart";
import About from "./Pages/aboutUs/aboutPage";
import GetStarted from "./Pages/landingPage/getStarted";
import User from "./Pages/Profile/userProfile";
import Artist from "./Pages/Profile/artistProfilee";
import Explore from "./Pages/explore/explorePage";
import Notification from "./Pages/Notification";
import UserProfile from "./Pages/Profile/userProfile"; // Import UserProfile
import ArtistProfile from "./Pages/Profile/artistProfile";
import ForgotPassword from "./Pages/forgot-pass/ForgotPassword.tsx";
import ChatPage from "./Pages/Chat/ChatPage.tsx";
import TabsComponent from "./Pages/transaction/TabsComponent.tsx";
import { AuthContextProvider } from "./AuthContext.tsx";
import { ChatContextProvider } from "./ChatContext.tsx";
import Premium from "./Pages/Premium.tsx";

const router = createBrowserRouter([
  { path: "/", element: <GetStarted /> },
  { path: "/SignUp", element: <SignUpPage /> },
  { path: "/LogIn", element: <LogInPage /> },
  { path: "/home", element: <Home /> },
  { path: "/Product", element: <Product /> },
  { path: "/shop", element: <Shop /> },
  { path: "/explore", element: <Explore /> },
  { path: "/about", element: <About /> },
  { path: "/firebaseTest", element: <FirebaseTest /> },
  { path: "/landingPage", element: <GetStarted /> },
  { path: "/artist/:userId", element: <ArtistProfile /> }, // Corrected syntax
  { path: "/user/:userId", element: <UserProfile /> }, // Corrected syntax
  { path: "/Cart", element: <MyCart /> },
  { path: "/Notification", element: <Notification /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/Chats", element: <ChatPage /> },
  { path: "/transaction", element: <TabsComponent /> },
  { path: "/premium", element: <Premium /> },
  { path: "/Profile", element: <Artist /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthContextProvider>
    <ChatContextProvider>
      <React.StrictMode>
        <CssBaseline />
        <RouterProvider router={router} />
      </React.StrictMode>
    </ChatContextProvider>
  </AuthContextProvider>
);
