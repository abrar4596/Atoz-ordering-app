import React from 'react'
import { Grid, Typography } from '@mui/material';


function Footer() {
  return (
    <div>
        <Grid classname="bg-gray-800 text-white mt-10 py-4"
          container
          sx={{bgcolor: "black", color: "white",py: 3}}
          >
           <Grid item xs={12} sm={6} md={3} >
               
               <Typography classname="pb-5" variant="h5" align="center" marginLeft={19}>Store</Typography>
                <Typography classname="pb-5" variant="h5" align="center" marginLeft={19} gutterBottom>About</Typography>

           </Grid>
        </Grid>
    </div>
  )
}

export default Footer