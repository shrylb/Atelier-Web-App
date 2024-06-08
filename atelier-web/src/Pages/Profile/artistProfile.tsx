import React, { useEffect, useState } from "react";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { Box, Typography, Avatar, Tabs, Tab, Button } from "@mui/material";
import { useParams } from "react-router-dom";
import "./artistProfileStyle.css";
import Header from "../../Header";
import Footer from "../../Footer";

const ArtistProfile = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [followers, setFollowers] = useState(0);
  const [tabIndex, setTabIndex] = useState(0);
  const [collections, setCollections] = useState([]);
  const [exhibits, setExhibits] = useState([]);
  const db = getFirestore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "accounts", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData(data);
          setFollowers(data.followers || 0);

          // Fetch collections
          const collectionRef = collection(db, "collections");
          const collectionsQuery = query(
            collectionRef,
            where("userId", "==", userId)
          );
          const collectionsSnapshot = await getDocs(collectionsQuery);
          setCollections(collectionsSnapshot.docs.map((doc) => doc.data()));

          // Fetch exhibits
          const exhibitRef = collection(db, "exhibits");
          const exhibitsQuery = query(
            exhibitRef,
            where("userId", "==", userId)
          );
          const exhibitsSnapshot = await getDocs(exhibitsQuery);
          setExhibits(exhibitsSnapshot.docs.map((doc) => doc.data()));
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchData();
  }, [userId, db]);

  const handleTabChange = (_event, newValue) => {
    setTabIndex(newValue);
  };

  const handleFollow = async () => {
    try {
      const docRef = doc(db, "accounts", userId);
      const newFollowersCount = followers + 1;
      await updateDoc(docRef, { followers: newFollowersCount });
      setFollowers(newFollowersCount);
    } catch (error) {
      console.error("Error updating followers count:", error);
    }
  };

  const handleUnfollow = async () => {
    try {
      const docRef = doc(db, "accounts", userId);
      const newFollowersCount = followers - 1;
      await updateDoc(docRef, { followers: newFollowersCount });
      setFollowers(newFollowersCount);
    } catch (error) {
      console.error("Error updating followers count:", error);
    }
  };

  if (!userData) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <div>
      <Header />
      <Box display="flex" flexDirection="column" alignItems="center" p={2}>
        {userData.coverPhoto && (
          <img
            src={userData.coverPhoto}
            alt="Cover"
            style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }}
          />
        )}
        <Avatar
          src={userData.profilePhoto}
          alt={userData.fullName}
          sx={{ width: 100, height: 100 }}
        />
        <Typography variant="h5">{userData.fullName}</Typography>
        <Typography variant="body1">@{userData.username}</Typography>
        <Typography variant="body2">{userData.description}</Typography>
        <Box mt={2}>
          <Button
            variant="contained"
            onClick={() => console.log("Message Button Clicked")}
          >
            Message
          </Button>
          {followers === 0 ? (
            <Button variant="contained" onClick={handleFollow}>
              Follow
            </Button>
          ) : (
            <Button variant="outlined" onClick={handleUnfollow}>
              Unfollow
            </Button>
          )}
          <Typography variant="body2">Followers: {followers}</Typography>
        </Box>
      </Box>
      <Tabs value={tabIndex} onChange={handleTabChange} centered>
        <Tab label="About" />
        <Tab label="Collection" />
        <Tab label="Exhibit" />
      </Tabs>
      {tabIndex === 0 && (
        <Box p={2}>
          <Typography variant="h6">About</Typography>
          <Typography>{userData.bio}</Typography>
        </Box>
      )}
      {tabIndex === 1 && (
        <Box p={2}>
          <Typography variant="h6">Collection</Typography>
          {collections.map((collection, index) => (
            <Box key={index} p={1}>
              <Typography variant="body1">{collection.name}</Typography>
              <Typography variant="body2">{collection.description}</Typography>
            </Box>
          ))}
        </Box>
      )}
      {tabIndex === 2 && (
        <Box p={2}>
          <Typography variant="h6">Exhibit</Typography>
          {exhibits.map((exhibit, index) => (
            <Box key={index} p={1}>
              <Typography variant="body1">{exhibit.title}</Typography>
              <Typography variant="body2">{exhibit.description}</Typography>
              <Typography variant="body2">Price: {exhibit.price}</Typography>
            </Box>
          ))}
        </Box>
      )}
      <Footer />
    </div>
  );
};

export default ArtistProfile;
