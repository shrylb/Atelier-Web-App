// src/Pages/PremiumFeature/PremiumFeaturePage.tsx
import React from 'react';
import { Typography, Box } from '@mui/material';
import Header from '../Header'; // Adjust the path based on your project structure
import Footer from '../Footer'; // Adjust the path based on your project structure

const Premium: React.FC = () => {
  return (
    <div>
      <Header />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
          textAlign: 'center',
        }}
      >
        <Typography variant="h3" component="h1" sx={{ marginBottom: 2 }}>
          Congratulations!
        </Typography>
        <Typography variant="h5" component="h2">
          You have reached a premium feature.
        </Typography>
        <Typography variant="body1" sx={{ marginTop: 2 }}>
          Contact our developers on how to avail it.
        </Typography>
      </Box>
      <Footer />
    </div>
  );
};

export default Premium;
