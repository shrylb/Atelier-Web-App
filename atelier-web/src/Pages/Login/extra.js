import React, { useState, useEffect } from 'react';
//import { Link } from 'react-router-dom';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../../../FirebaseConfig';
import './artistProfileStyle.css';
import Header from '../../Header';
import Footer from '../../Footer';

const Artist: React.FC = () => {
    const [coverURL, setLogoIconURL] = useState('');
    const [profileURL, setProfileURL] = useState('');


    useEffect(() => {
        fetchIconURLs(); // Fetch icon URLs
    }, []);

    const fetchIconURLs = async () => {
        try {
          // Fetch icon URLs from Firebase Storage
          const iconsRef = ref(storage, 'img');
          const coverURL = await getDownloadURL(ref(iconsRef, 'hero3.jpg'));
          const profileURL = await getDownloadURL(ref(iconsRef, '/profile/pp3.jpg'));
          
          setLogoIconURL(coverURL);
          setProfileURL(profileURL);
          
        } catch (error) {
          console.error('Error fetching icon URLs:', error);
        }
    };
    
    return (
        <div>
            <Header />
            
            <div id='profile-banner'>

                <div id='profile-cover'>
                <img src={coverURL} className="cover-photo" alt="Artist cover photo" />
                </div>

                <div id='profile-elements'>

                    <div id='profile-cont'>
                        <div id='profile-picture'>
                        <img src={profileURL} className="profile-photo" alt="Artist profile photo" />
                        </div>

                        <div id='profile-deets'>
                            <p id='artist-name'>John Doe</p>
                            <p id='artist-username'>@johndoe</p>
                            <p id='artist-followers'>21 Followers</p>
                        </div>

                    </div>

                    <div id='profile-buttons'>
                        <button className='artist-profile-btns' id='msg-button'>
                            Message
                        </button>

                        <button className='artist-profile-btns' id='follow-button'>
                            Follow
                        </button>
                    </div>
                </div>

            </div>


            <Footer />
        </div>
    );
};

export default Artist;


import React, { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc, collection, addDoc, getDocs } from 'firebase/firestore';
import { Box, Typography, Avatar, Button, Tab, Tabs, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Checkbox, FormControlLabel } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import './userProfileStyle.css';
import Header from '../../Header';
import Footer from '../../Footer';

const UserProfile = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [collections, setCollections] = useState([]);
  const [exhibitArtworks, setExhibitArtworks] = useState([]);
  const [openCollectionDialog, setOpenCollectionDialog] = useState(false);
  const [openArtworkDialog, setOpenArtworkDialog] = useState(false);
  const [openExhibitDialog, setOpenExhibitDialog] = useState(false);
  const [openEditProfileDialog, setOpenEditProfileDialog] = useState(false);
  const [newCollectionData, setNewCollectionData] = useState({ name: '', description: '', coverPhoto: '' });
  const [selectedCollectionId, setSelectedCollectionId] = useState('');
  const [newArtworkData, setNewArtworkData] = useState({ name: '', description: '', coverPhoto: '' });
  const [newExhibitArtwork, setNewExhibitArtwork] = useState({ name: '', photo: '', description: '', tags: [], price: '', stock: '' });
  const [editedUserData, setEditedUserData] = useState({});
  const db = getFirestore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, 'accounts', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
          // Fetch collections
          const collectionsRef = collection(docRef, 'collections');
          const collectionsSnapshot = await getDocs(collectionsRef);
          const collectionsList = collectionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setCollections(collectionsList);
          // Fetch exhibit artworks
          const exhibitRef = collection(docRef, 'exhibit');
          const exhibitSnapshot = await getDocs(exhibitRef);
          const exhibitList = exhibitSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setExhibitArtworks(exhibitList);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching document:', error);
      }
    };

    fetchData();
  }, [userId, db]);

  const handleTabChange = (_event, newValue) => {
    setTabIndex(newValue);
  };

  const handleEditProfile = () => {
    setEditedUserData(userData);
    setOpenEditProfileDialog(true);
  };

  const handleSaveProfileChanges = async () => {
    const docRef = doc(db, 'accounts', userId);
    await updateDoc(docRef, editedUserData);
    setUserData(editedUserData);
    setOpenEditProfileDialog(false);
  };

  const handleDeleteAccount = async () => {
    const docRef = doc(db, 'accounts', userId);
    await deleteDoc(docRef);
    navigate('/');
  };

  const handleLogout = () => {
    // Implement logout functionality here, e.g., clearing session, redirecting to login page
    navigate('/');
  };

  const handleAddCollection = async () => {
    const collectionRef = collection(db, 'accounts', userId, 'collections');
    await addDoc(collectionRef, newCollectionData);
    setNewCollectionData({ name: '', description: '', coverPhoto: '' }); // Reset the form after adding
    setOpenCollectionDialog(false);
    // Fetch collections again
    const collectionsSnapshot = await getDocs(collectionRef);
    const collectionsList = collectionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setCollections(collectionsList);
};

  const handleAddArtwork = async () => {
    const artworkRef = collection(db, 'accounts', userId, 'collections', selectedCollectionId, 'artworks');
    await addDoc(artworkRef, newArtworkData);
    setNewArtworkData({ name: '', description: '', coverPhoto: '' }); // Reset the form after adding
    // Fetch artworks again after adding
    const artworksSnapshot = await getDocs(collection(db, 'accounts', userId, 'collections', selectedCollectionId, 'artworks'));
    const updatedArtworksList = artworksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    saveArtworks(updatedArtworksList);
  };

  const handleDeleteCollection = async (collectionId) => {
    const collectionRef = doc(db, 'accounts', userId, 'collections', collectionId);
    await deleteDoc(collectionRef);
    // Fetch collections again after deletion
    const collectionsSnapshot = await getDocs(collection(db, 'accounts', userId, 'collections'));
    const updatedCollectionsList = collectionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setCollections(updatedCollectionsList);
  };
  
  const handleDeleteArtwork = async (collectionId, artworkId) => {
    const artworkRef = doc(db, 'accounts', userId, 'collections', collectionId, 'artworks', artworkId);
    await deleteDoc(artworkRef);
    // Fetch artworks again after deletion
    const artworksSnapshot = await getDocs(collection(db, 'accounts', userId, 'collections', collectionId, 'artworks'));
    const updatedArtworksList = artworksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    saveArtworks(updatedArtworksList);
  };

  const saveArtworks = async () => {
    for (const artwork of artwork) {
      const artworkRef = collection(db, 'accounts', userId, 'collections', selectedCollectionId, 'artworks');
      await addDoc(artworkRef, artwork);
    }
    setOpenArtworkDialog(false);
    saveArtworks([]);
  };

  const openArtworkDialogForCollection = (collectionId) => {
    setSelectedCollectionId(collectionId);
    setOpenArtworkDialog(true);
  };

  const handleAddExhibitArtwork = async () => {
    const exhibitRef = collection(db, 'accounts', userId, 'exhibit');
    await addDoc(exhibitRef, newExhibitArtwork);
    setNewExhibitArtwork({ name: '', photo: '', description: '', tags: [], price: '', stock: '' });
    setOpenExhibitDialog(false);
    // Fetch exhibit artworks again
    const exhibitSnapshot = await getDocs(exhibitRef);
    const exhibitList = exhibitSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setExhibitArtworks(exhibitList);
  };

  const handleTagChange = (tag) => {
    setNewExhibitArtwork(prevState => {
      const tags = prevState.tags.includes(tag)
        ? prevState.tags.filter(t => t !== tag)
        : [...prevState.tags, tag];
      return { ...prevState, tags };
    });
  };

  const availableTags = ['Painting', 'Oil Pastel', 'Digital', 'Sculpture', 'Photography'];

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
            style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }}
          />
        )}
        <Avatar src={userData.profilePhoto} alt={userData.fullName} sx={{ width: 100, height: 100 }} />
        <Typography variant="h5">{userData.fullName}</Typography>
        <Typography variant="body1">@{userData.username}</Typography>
        <Typography variant="body2">{userData.description}</Typography>
        <Button variant="contained" color="primary" onClick={handleEditProfile} sx={{ marginTop: 2 }}>
          Edit Profile
        </Button>
        <Button variant="contained" color="secondary" onClick={handleLogout} sx={{ marginTop: 2 }}>
          Logout
        </Button>
        <Button variant="contained" color="error" onClick={handleDeleteAccount} sx={{ marginTop: 2 }}>
          Delete Account
        </Button>
      </Box>
      <Tabs value={tabIndex} onChange={handleTabChange} centered>
        <Tab label="About" />
        <Tab label="Collection" />
        <Tab label="Exhibit" />
      </Tabs>
      {tabIndex === 0 && (
        <Box p={2}>
          <Typography variant="h6">About</Typography>
          <Typography>{userData.description}</Typography>
        </Box>
      )}
      {tabIndex === 1 && (
        <Box p={2}>
          <Typography variant="h6">Collection</Typography>
          <Button variant="contained" color="primary" onClick={() => setOpenCollectionDialog(true)}>
            Add Collection
          </Button>
          <Box mt={2}>
            {collections.map(collection => (
              <Box key={collection.id} p={2} border={1} borderColor="grey.400" mb={2}>
            <img src={collection.coverPhoto} alt={collection.name} style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />
            <Typography variant="h6">{collection.name}</Typography>
            <Typography>{collection.description}</Typography>
            <Button variant="contained" color="secondary" onClick={() => handleDeleteCollection(collection.id)}>Delete Collection</Button>
            <Button variant="contained" color="secondary" onClick={() => openArtworkDialogForCollection(collection.id)}>Add Artwork</Button>
          </Box>
            ))}
          </Box>
        </Box>
      )}
      {tabIndex === 2 && (
        <Box p={2}>
          <Typography variant="h6">Exhibit</Typography>
          <Button variant="contained" color="primary" onClick={() => setOpenExhibitDialog(true)}>
            Add Artwork to Exhibit
          </Button>
          <Box mt={2}>
            {exhibitArtworks.map(artwork => (
              <Box key={artwork.id} p={2} border={1} borderColor="grey.400" mb={2}>
            <img src={artwork.coverPhoto} alt={artwork.name} style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />
            <Typography variant="h6">{artwork.name}</Typography>
            <Typography>{artwork.description}</Typography>
            <Typography>Tags: {artwork.tags.join(', ')}</Typography>
            <Typography>Price: ${artwork.price}</Typography>
            <Typography>Stock: {artwork.stock}</Typography>
            <Button variant="contained" color="secondary" onClick={() => handleDeleteArtwork(selectedCollectionId, artwork.id)}>Delete Artwork</Button>
          </Box>
            ))}
          </Box>
        </Box>
      )}
      <Footer />

      // Dialog for adding collection:
      <DialogTitle>Add Collection</DialogTitle>
      <DialogContent>
          <TextField
              autoFocus
              margin="dense"
              label="Collection Name"
              type="text"
              fullWidth
              value={newCollectionData.name}
              onChange={(e) => setNewCollectionData({ ...newCollectionData, name: e.target.value })}
          />
          <TextField
              margin="dense"
              label="Description"
              type="text"
              fullWidth
              value={newCollectionData.description}
              onChange={(e) => setNewCollectionData({ ...newCollectionData, description: e.target.value })}
          />
          <TextField
              margin="dense"
              label="Cover Photo URL" // Add this input field
              type="text"
              fullWidth
              value={newCollectionData.coverPhoto}
              onChange={(e) => setNewCollectionData({ ...newCollectionData, coverPhoto: e.target.value })}
          />
      </DialogContent>

      // Dialog for adding artwork:
      <DialogTitle>Add Artwork</DialogTitle>
      <DialogContent>
          <TextField
              autoFocus
              margin="dense"
              label="Artwork Name"
              type="text"
              fullWidth
              value={newArtworkData.name}
              onChange={(e) => setNewArtworkData({ ...newArtworkData, name: e.target.value })}
          />
          <TextField
              margin="dense"
              label="Description"
              type="text"
              fullWidth
              value={newArtworkData.description}
              onChange={(e) => setNewArtworkData({ ...newArtworkData, description: e.target.value })}
          />
          <TextField
              margin="dense"
              label="Photo URL"
              type="text"
              fullWidth
              value={newArtworkData.photo}
              onChange={(e) => setNewArtworkData({ ...newArtworkData, photo: e.target.value })}
          />
          <TextField
              margin="dense"
              label="Cover Photo URL" // Add this input field
              type="text"
              fullWidth
              value={newArtworkData.coverPhoto}
              onChange={(e) => setNewArtworkData({ ...newArtworkData, coverPhoto: e.target.value })}
          />
      </DialogContent>

      {/* Dialog for adding exhibit artwork */}
      <Dialog open={openExhibitDialog} onClose={() => setOpenExhibitDialog(false)}>
        <DialogTitle>Add Artwork to Exhibit</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Artwork Name"
            type="text"
            fullWidth
            value={newExhibitArtwork.name}
            onChange={(e) => setNewExhibitArtwork({ ...newExhibitArtwork, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Photo URL"
            type="text"
            fullWidth
            value={newExhibitArtwork.photo}
            onChange={(e) => setNewExhibitArtwork({ ...newExhibitArtwork, photo: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            value={newExhibitArtwork.description}
            onChange={(e) => setNewExhibitArtwork({ ...newExhibitArtwork, description: e.target.value })}
          />
          <Typography>Tags</Typography>
          {availableTags.map(tag => (
            <FormControlLabel
              key={tag}
              control={
                <Checkbox
                  checked={newExhibitArtwork.tags.includes(tag)}
                  onChange={() => handleTagChange(tag)}
                  name={tag}
                />
              }
              label={tag}
            />
          ))}
          <TextField
            margin="dense"
            label="Price"
            type="number"
            fullWidth
            value={newExhibitArtwork.price}
            onChange={(e) => setNewExhibitArtwork({ ...newExhibitArtwork, price: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Stock"
            type="number"
            fullWidth
            value={newExhibitArtwork.stock}
            onChange={(e) => setNewExhibitArtwork({ ...newExhibitArtwork, stock: e.target.value })}
          />
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setOpenExhibitDialog(false)}>Cancel</Button>
          <Button onClick={handleAddExhibitArtwork}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for editing profile */}
      <Dialog open={openEditProfileDialog} onClose={() => setOpenEditProfileDialog(false)}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Full Name"
            type="text"
            fullWidth
            value={editedUserData.fullName}
            onChange={(e) => setEditedUserData({ ...editedUserData, fullName: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Username"
            type="text"
            fullWidth
            value={editedUserData.username}
            onChange={(e) => setEditedUserData({ ...editedUserData, username: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            value={editedUserData.description}
            onChange={(e) => setEditedUserData({ ...editedUserData, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Profile Photo URL"
            type="text"
            fullWidth
            value={editedUserData.profilePhoto}
            onChange={(e) => setEditedUserData({ ...editedUserData, profilePhoto: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Cover Photo URL"
            type="text"
            fullWidth
            value={editedUserData.coverPhoto}
            onChange={(e) => setEditedUserData({ ...editedUserData, coverPhoto: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditProfileDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveProfileChanges}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserProfile;
