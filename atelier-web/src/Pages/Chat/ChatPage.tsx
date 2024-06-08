import { Box } from "@mui/material";
import React, { useContext } from "react";
import Sidebar from "./components/ChatSidebar";
import MessageBar from "./components/MessageBar";
import Header from "../../Header";
import { AuthContext } from "../../AuthContext";

function ChatPage() {
  const user = useContext(AuthContext);
  console.log(user);

  return (
    <Box height={"100vh"}>
      <Header />
      <Box
        height={"calc(100vh - 100px)"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Box
          display={"flex"}
          height={"95%"}
          width={"96%"}
          justifyContent={"center"}
        >
          <Sidebar />
          <MessageBar />
        </Box>
      </Box>
    </Box>
  );
}

export default ChatPage;
