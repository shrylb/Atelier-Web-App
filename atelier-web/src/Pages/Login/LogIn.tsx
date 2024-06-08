import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Checkbox,
  FormGroup,
  FormControlLabel,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../FirebaseConfig";
import {
  getFirestore,
  query,
  where,
  collection,
  getDocs,
} from "firebase/firestore";

function LogInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const firestore = getFirestore();

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const logIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userEmail = userCredential.user.email;

      console.log("userCredential", userCredential);

      // Query Firestore to find the user document with the corresponding email
      const querySnapshot = await getDocs(
        query(
          collection(firestore, "accounts"),
          where("email", "==", userEmail)
        )
      );

      console.log(querySnapshot.docs[0].id);
      if (!querySnapshot.empty) {
        // Assuming there's only one document matching the email
        const docId = querySnapshot.docs[0].id;

        // Store the document ID in local storage
        localStorage.setItem("currentUserDocId", docId);

        // Navigate to the user's profile page
        navigate(`/user/${docId}`);
      } else {
        setError("User data not found.");
      }
    } catch (error) {
      setError("Failed to log in. Please check your credentials.");
    }
  };

  return (
    <Box minHeight="100vh" sx={{ backgroundColor: "#E2C1BE" }}>
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
            fontFamily="Inknut Antiqua"
            textAlign="center"
            color="#232335"
            fontSize="175%"
            fontWeight="700"
          >
            Log In
          </Typography>
        </Box>
        <Box mt="5%">
          <TextField
            fullWidth
            required
            label="Email"
            variant="filled"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              disableUnderline: true,
              style: {
                backgroundColor: "#FFFFFF",
                borderRadius: "5px",
                marginBottom: "15px",
                fontFamily: "Montserrat",
              },
            }}
          />
          <TextField
            fullWidth
            required
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
                  <IconButton onClick={handleClickShowPassword} edge="end">
                    {showPassword ? <Visibility /> : <VisibilityOff />}
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
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <FormGroup>
              <FormControlLabel
                control={<Checkbox />}
                label="Remember me"
                sx={{ fontFamily: "Montserrat" }}
              />
            </FormGroup>
            <Typography fontFamily="Montserrat" fontWeight="500">
              <Link
                component={RouterLink}
                to="/forgot-password"
                sx={{ textDecoration: "none", color: "#232335" }}
              >
                Forgot Password?
              </Link>
            </Typography>
          </Box>
          <Box mt="10%" display="flex" justifyContent="center">
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
                "&:hover": { backgroundColor: "#3B3B58", fontWeight: "600" },
              }}
              onClick={logIn}
            >
              Log In
            </Button>
          </Box>
          <Typography
            fontFamily="Montserrat"
            textAlign="center"
            color="#232335"
            fontSize="18px"
            fontWeight="400"
            sx={{ marginTop: "10px" }}
          >
            Don't have an account?{" "}
            <Link
              component={RouterLink}
              to="/SignUp"
              sx={{
                textDecoration: "underline",
                fontWeight: "700",
                color: "#232335",
              }}
            >
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default LogInPage;
