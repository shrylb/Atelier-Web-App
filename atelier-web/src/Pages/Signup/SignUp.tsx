import { Visibility, VisibilityOff } from "@mui/icons-material";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  addDoc,
  collection,
  setDoc,
  doc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { getDownloadURL } from "firebase/storage";
import { Link as RouterLink } from "react-router-dom";
import { auth } from "../../../FirebaseConfig";
import { useNavigate } from "react-router";
import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
  Link,
} from "@mui/material";

function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate(); // Import useNavigate hook
  const [userUid, setUserUid] = useState("");

  const db = getFirestore();
  const storage = getStorage();

  const uploadProfilePhoto = async (file: File) => {
    const storageRef = ref(storage, `profile_photos/${file.name}`);
    const uploadTask = uploadBytes(storageRef, file);

    // Wait for the upload to complete
    await uploadTask;

    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  };

  const uploadCoverPhoto = async (file: File) => {
    const storageRef = ref(storage, `cover_photos/${file.name}`);
    const uploadTask = uploadBytes(storageRef, file);

    // Wait for the upload to complete
    await uploadTask;

    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  };

  const saveDataToFirestore = async () => {
    try {
      const profilePhotoURL = profilePhoto
        ? await uploadProfilePhoto(profilePhoto)
        : null;
      const coverPhotoURL = coverPhoto
        ? await uploadCoverPhoto(coverPhoto)
        : null;
      const accountCollection = "accounts";
      const docRef = await addDoc(collection(db, accountCollection), {
        uid: userUid,
        email: email,
        fullName: fullName,
        username: username,
        description: description,
        profilePhoto: profilePhotoURL,
        coverPhoto: coverPhotoURL,
        followers: 0, // Initialize followers field to 0
      });
      console.log("Document written with ID: ", docRef.id);
      return docRef.id; // Return the document ID
    } catch (err) {
      console.error("Error adding document: ", err);
      return null;
    }
  };

  const signUp = async () => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{9,}$/;

    if (!passwordRegex.test(password)) {
      setError("Password does not meet password requirements.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await setDoc(doc(db, "userChats", userCredential.user.uid), {});
      setUserUid(userCredential.user.uid);

      setOpenDialog(true);
    } catch (err) {
      if (err.message.includes("auth/invalid-email")) {
        setError("Invalid email.");
      } else if (err.message.includes("auth/invalid-credential")) {
        setError("Your password is incorrect. Please try again.");
      } else if (err.message.includes("auth/email-already-in-use")) {
        setError("Email is already in use. Please try again.");
      } else {
        setError(err.message);
      }
    }
  };

  const handleDialogClose = async () => {
    setOpenDialog(false);
    const docId = await saveDataToFirestore(); // Get the document ID

    if (docId) {
      // Save the document ID to local storage
      localStorage.setItem("currentUserDocId", docId);

      // Navigate to the profile page with the document ID
      navigate(`/user/${docId}`);
    } else {
      // Handle error
      console.error("Failed to save data to Firestore.");
    }
  };

  return (
    <Box minHeight={"100vh"} sx={{ backgroundColor: "#E2C1BE" }}>
      <Box m="0 auto" maxWidth="500px">
        <Box m="0 auto" pt={"30px"} width={"280px"}>
          <img
            src="/src/assets/atelier-logo2.png"
            alt="Atelier"
            width={"100%"}
          />
        </Box>

        <Box mt={"8%"}>
          <Typography
            fontFamily={"Inknut Antiqua"}
            textAlign={"center"}
            color={"#232335"}
            fontSize={"175%"}
            fontWeight={"700"}
          >
            Sign Up
          </Typography>
        </Box>

        <Box mt={"5%"}>
          <TextField
            fullWidth
            required={true}
            label="Email"
            variant="filled"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              disableUnderline: true,
              style: {
                backgroundColor: "#FFFFFF",
                border: "none",
                outline: "none",
                borderRadius: "5px",
                marginBottom: "15px",
                fontFamily: "Montserrat",
              },
            }}
          />

          <TextField
            fullWidth
            required={true}
            type={showPassword ? "text" : "password"}
            label="Password"
            variant="filled"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              disableUnderline: true,
              style: {
                backgroundColor: "#FFFFFF",
                borderRadius: "5px",
                marginBottom: "15px",
                fontFamily: "Montserrat",
              },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Password must be at least 9 characters, contain at least one number,
            one special character, and one uppercase letter.
          </Typography>

          <TextField
            fullWidth
            required={true}
            type={showConfirmPassword ? "text" : "password"}
            label="Confirm Password"
            variant="filled"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputProps={{
              disableUnderline: true,
              style: {
                backgroundColor: "#FFFFFF",
                borderRadius: "5px",
                marginBottom: "15px",
                fontFamily: "Montserrat",
              },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {error && (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          )}

          <Box mt="3%" display={"flex"} justifyContent={"center"}>
            <Button
              fullWidth
              size="medium"
              variant="contained"
              sx={{
                textTransform: "none",
                backgroundColor: "#91488A",
                borderRadius: "5px",
                height: "50px",
                fontFamily: "Montserrat",
                fontSize: "20px",
                fontWeight: "500",
                "&:hover": {
                  backgroundColor: "#3B3B58",
                  fontWeight: "600",
                },
              }}
              onClick={signUp}
            >
              Sign Up
            </Button>
          </Box>

          <Typography
            fontFamily={"Montserrat"}
            textAlign={"center"}
            color={"#232335"}
            fontSize={"18px"}
            fontWeight={"400"}
            sx={{
              marginTop: "10px",
            }}
          >
            Already have an account?{" "}
            <Link
              component={RouterLink}
              to="/LogIn"
              sx={{
                textDecoration: "underline",
                fontWeight: "700",
                color: "#232335",
              }}
            >
              Login
            </Link>
          </Typography>
        </Box>
      </Box>
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        maxWidth="sm"
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: "#E2C1BE",
            color: "#0000",
            fontFamily: "Montserrat",
            borderRadius: "10px",
          },
        }}
      >
        <DialogTitle
          sx={{ fontFamily: "Montserrat", color: "#232335", paddingBottom: 3 }}
        >
          Setup Your Profile
        </DialogTitle>

        <DialogContent>
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ mb: 0, paddingLeft: 0 }}
          >
            Full Name
          </Typography>
          <TextField
            fullWidth
            // label="Full Name"
            variant="filled"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            sx={textFieldStyle.root}
          />
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ mb: 0, paddingLeft: 0 }}
          >
            Username
          </Typography>
          <TextField
            fullWidth
            // label="Username"
            variant="filled"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={textFieldStyle.root}
          />
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{
              mb: 0,
              paddingLeft: 0,
            }}
          >
            Description
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ mb: 0, paddingLeft: 0 }}
          >
            Description
          </Typography>
          <TextField
            fullWidth
            // label="Description"
            variant="filled"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={2}
            sx={textFieldStyle.root}
          />
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ mb: 0, paddingLeft: 0 }}
          >
            Profile Photo
          </Typography>
          <TextField
            fullWidth
            type="file"
            // label="Profile Photo"
            onChange={(e) => {
              const target = e.target as HTMLInputElement;
              if (target.files && target.files.length > 0) {
                setProfilePhoto(target.files[0]);
              }
            }}
            sx={textFieldStyle.root}
          />
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ mb: 0, paddingLeft: 0 }}
          >
            Cover Photo
          </Typography>
          <TextField
            fullWidth
            type="file"
            // label="Cover Photo"
            onChange={(e) => {
              const target = e.target as HTMLInputElement;
              if (target.files && target.files.length > 0) {
                setCoverPhoto(target.files[0]);
              }
            }}
            // InputLabelProps={{ shrink: true }}
            sx={textFieldStyle.root}
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleDialogClose}
            sx={{
              backgroundColor: "#91488A",
              color: "#ffffff",
              fontFamily: "Montserrat",
              "&:hover": {
                backgroundColor: "#3B3B58",
                fontWeight: "600",
              },
            }}
          >
            Launch Profile
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

const textFieldStyle = {
  root: {
    mb: 2,
    backgroundColor: "#ffffff",
    border: "none",
    borderRadius: "0px",
    "& .MuiFilledInput-root": {
      borderColor: "#91488A",
      "&:before, &:after": {
        borderBottomColor: "#91488A",
      },
      "&:hover": {
        borderBottomColor: "#91488A",
      },
    },
  },
};

export default SignUpPage;
