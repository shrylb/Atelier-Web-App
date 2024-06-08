import { Box, Typography, Avatar } from "@mui/material";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { Navigate, Link as RouterLink } from "react-router-dom";
import { db } from "../../../../FirebaseConfig";
import { AuthContext } from "../../../AuthContext";
import { ChatContext } from "../../../ChatContext";

interface MessageProps {
  readonly isOwner?: boolean;
  message: any[];
}

function Messages({ isOwner = false, message }: MessageProps) {
  const currentUser = useContext(AuthContext);
  console.log("messages currentuser", currentUser);
  const { data } = useContext(ChatContext);

  return (
    <Box mb={"20px"} paddingBottom={"4px"}>
      <Box
        display={"flex"}
        alignItems={"center"}
        gap={"20px"}
        flexDirection={isOwner ? "row-reverse" : "row"}
      >
        <Box display={"flex"} flexDirection={"column"} alignItems={"flex-end"}>
          <Avatar
            src={
              message.senderId === currentUser?.uid
                ? currentUser?.profilePhoto
                : " assets/avatar1.png"
            }
          />
          <Typography fontSize={"12px"}>Just now</Typography>
        </Box>
        <Box display={"flex"} flexDirection={"column"} color={"black"}>
          <Typography
            sx={{
              bgcolor: isOwner ? "#D9ADA9" : "#C0D0FF",
              padding: "10px 20px",
              borderRadius: isOwner
                ? "10px 0px 10px 10px"
                : "0px 10px 10px 10px",
              maxWidth: "max-content",
            }}
          >
            {message.text}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Messages;
