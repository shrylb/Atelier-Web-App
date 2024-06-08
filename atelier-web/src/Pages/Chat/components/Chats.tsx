import { Box, Typography, Avatar } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Navigate, Link as RouterLink } from "react-router-dom";
import { AuthContext } from "../../../AuthContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../../FirebaseConfig";
import { ChatContext } from "../../../ChatContext";

function Chats() {
  const [chats, setChats] = useState([]);
  const currentUser = useContext(AuthContext);

  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(
        doc(db, "userChats", currentUser?.uid),
        (doc) => {
          doc.exists() && setChats(doc.data());
        }
      );

      return () => {
        unsub();
      };
    };
    currentUser?.uid && getChats();
  }, [currentUser?.uid]);

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };

  console.log("chats", Object.entries(chats));

  return (
    <Box mb={"20px"}>
      {Object.entries(chats)?.map((chat) => (
        <Box
          key={chat[0]}
          marginTop={"5px"}
          marginBottom={"10px"}
          display={"flex"}
          alignItems={"center"}
          sx={{ ":hover": { backgroundColor: "gray" } }}
          onClick={() => handleSelect(chat[1].userInfo)}
        >
          <Avatar src={chat[1].userInfo.profilePhoto || "assetsavatar1.png"} />
          <Box display={"flex"} flexDirection={"column"} pl={"10px"}>
            <Typography
              fontFamily={"Inknut Antiqua"}
              fontWeight={"bold"}
              fontSize={"14px"}
            >
              {chat[1].userInfo.fullName}
            </Typography>
            <Typography
              fontFamily={"Montserrat"}
              fontWeight={"medium"}
              fontSize={"14px"}
            >
              {chat[1].userInfo.lastMessage?.text}{" "}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export default Chats;
