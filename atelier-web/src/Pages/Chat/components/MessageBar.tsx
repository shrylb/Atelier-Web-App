import { Box, Typography, TextField, IconButton } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { SendRounded } from "@mui/icons-material";
import { AuthContext } from "../../../AuthContext";
import {
  Timestamp,
  arrayUnion,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../../FirebaseConfig";
import { ChatContext } from "../../../ChatContext";
import Messages from "./Messages";
import { v4 as uuid } from "uuid";

function MessageBar() {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const currentUser = useContext(AuthContext);

  useEffect(() => {
    console.log("data", data);
    const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      console.log("docdata", doc.data());
      doc.exists() && setMessages(doc.data().messages);
    });

    console.log("messages", messages);

    return () => {
      unsub();
    };
  }, [data.chatId]);

  const handleSend = async () => {
    console.log("click");
    console.log("data", data);
    await updateDoc(doc(db, "chats", data.chatId), {
      messages: arrayUnion({
        id: uuid(),
        text,
        senderId: currentUser?.uid,
        date: Timestamp.now(),
      }),
    });

    // await updateDoc(doc(db, "userChats", currentUser?.uid), {
    //   [data.chatId + ".lastMessage"]: {
    //     text,
    //   },
    //   [data.chatId + ".date"]: serverTimestamp(),
    // });
    // await updateDoc(doc(db, "userChats", data.user.uid), {
    //   [data.chatId + ".lastMessage"]: {
    //     text,
    //   },
    //   [data.chatId + "date"]: serverTimestamp(),
    // });

    setText("");
  };

  return (
    <Box
      flex={2}
      bgcolor={"#875782"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      borderRadius={"10px"}
    >
      <Box
        height={"97%"}
        width={"99%"}
        bgcolor={"white"}
        borderRadius={"10px"}
        overflow={"hidden"}
        display={"flex"}
        flexDirection={"column"}
      >
        <Box bgcolor={"#D9ADA9"} padding={2} paddingBottom={1}>
          <Typography fontFamily={"Inknut Antiqua"} color={"white"}>
            {data.user.fullName}
          </Typography>
        </Box>

        <Box
          flex={1}
          padding={2}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"space-between"}
          overflow={"hidden"}
        >
          <Box flex={1} overflow={"auto"} mb={2} padding={2}>
            {messages.map((m) => (
              <Messages message={m} isOwner={m.senderId == currentUser?.uid} />
            ))}
            {/* <Messages />
            <Messages isOwner />
            <Messages />
            <Messages />  
            <Messages isOwner />

            <Messages /> */}
          </Box>
        </Box>
        <Box display={"flex"} alignItems={"center"}>
          <TextField
            variant="outlined"
            placeholder="Type your message..."
            fullWidth
            rows={1}
            sx={{ marginRight: 1 }}
            onChange={(e) => setText(e.target.value)}
          />
          <IconButton onClick={handleSend} color="primary">
            <SendRounded />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}

export default MessageBar;
