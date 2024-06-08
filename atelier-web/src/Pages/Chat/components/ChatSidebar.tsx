import { Box } from "@mui/material";
import React from "react";
import SearchBar from "./SearchBar";
import Chats from "./Chats";

function Sidebar() {
  return (
    <Box flex={1} flexDirection={"column"} overflow={"scroll"}>
      <Box fontFamily={"Inknut Antiqua"} fontSize={"35px"}>
        Chats
      </Box>
      <SearchBar />
      <Chats />
    </Box>
  );
}

export default Sidebar;
