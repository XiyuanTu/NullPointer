import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React from 'react'
import { GiCompass } from "react-icons/gi";


const Logo = () => {
  return (
    <Box sx={{display: 'flex', alignItems: 'center', }}>
      <GiCompass style={{color: '#007fff', marginRight: '0.5rem', fontSize: '2.25rem', lineHeight: '2.5rem'}}/>
      <Typography sx={{color: '#0a1929', fontSize: '1.5rem', lineHeight: '2rem', fontWeight: 'bold'}}>NullPointer</Typography>
    </Box>
  )
}

export default Logo