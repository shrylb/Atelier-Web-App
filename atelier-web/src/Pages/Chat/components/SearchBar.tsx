import { Box, Typography, TextField, Avatar } from "@mui/material";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  setDoc,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import React, { useContext, useState } from "react";
import { db } from "../../../../FirebaseConfig";
import { AuthContext } from "../../../AuthContext";
import { User } from "firebase/auth";

function SearchBar() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [err, setErr] = useState(false);

  const currentUser = useContext(AuthContext);

  const handleSearch = async () => {
    if (username === "") {
      setUsers([]);
      return;
    }
    try {
      const q = query(
        collection(db, "accounts"),
        orderBy("fullName"),
        limit(10)
      );

      const querySnapshot = await getDocs(q);

      const filteredUsers = querySnapshot.docs
        // .map((doc) => doc.data())
        .filter((doc) => {
          const user = doc.data();
          return user.fullName.toLowerCase().includes(username.toLowerCase());
        });

      setUsers(filteredUsers);
    } catch (e) {
      console.log(e);
    }
  };

  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };

  const handleSelect = async (selectedUser) => {
    console.log("clicking");
    console.log("selected", selectedUser);
    console.log(currentUser);

    const combinedId =
      currentUser?.uid > selectedUser?.data().uid
        ? currentUser?.uid + selectedUser?.data().uid
        : selectedUser?.data().uid + currentUser?.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        await setDoc(doc(db, "chats", combinedId), { messages: [] });
        console.log(currentUser.uid);
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: selectedUser?.data().uid,
            fullName: selectedUser?.data().fullName,
            profilePhoto: selectedUser?.data().profilePhoto,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        const querySnapshot = await getDocs(
          query(
            collection(db, "accounts"),
            where("email", "==", currentUser?.email)
          )
        );

        const currentUserAccount = querySnapshot.docs[0].data();
        await updateDoc(doc(db, "userChats", selectedUser?.data().uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUserAccount?.uid,
            fullName: currentUserAccount?.fullName,
            profilePhoto: currentUserAccount?.profilePhoto,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {
      console.log(err);
    }
    setUsers([]);
    setUsername("");
  };

  return (
    <Box>
      <Box>
        <TextField
          fullWidth
          label="Find a user"
          variant="filled"
          type="text"
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKey}
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
        {users.map((user, index) => (
          <Box
            key={index}
            marginTop={"5px"}
            marginBottom={"10px"}
            display={"flex"}
            alignItems={"center"}
            sx={{ ":hover": { backgroundColor: "gray" } }}
            onClick={() => handleSelect(user)} // Call handleUserClick function on click
            value={username}
          >
            <Avatar src={user.data().profilePhoto || "assets/avatar1.png"} />
            <Box display={"flex"} flexDirection={"column"} pl={"10px"}>
              <Typography
                fontFamily={"Inknut Antiqua"}
                fontWeight={"bold"}
                fontSize={"14px"}
              >
                {user.data().fullName || "No user"}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default SearchBar;
