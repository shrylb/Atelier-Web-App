import Header from "../../Header";
import Footer from "../../Footer";
import { Box } from "@mui/material";

const Premium: React.FC = () => {
  return (
    <>
      <Box
        sx={{
          margin: "auto 0",
          display: "flex",
          flexDirection: "center",
          justifyContent: "center",
          alignContent: "center",
          fontFamily: "Montserrat",
          fontSize: "150%",
          fontWeight: "700",
        }}
      >
        Premium Feature
      </Box>
    </>
  );
};

export default Premium;
