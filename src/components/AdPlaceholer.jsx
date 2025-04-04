import React from 'react';
import {Box, Typography,} from '@mui/material';


const AdPlaceholder = ({ width, height, }) => {
    return (
        <Box
            sx={{
                width: width || '100%',
                height: height || '90px',
                backgroundColor: 'rgba(200, 200, 200, 0.1)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                my: 2,
                border: '1px dashed rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <Typography variant="caption" color="rgba(255, 255, 255, 0.5)">
                Advertisement
            </Typography>
        </Box>
    );
};

export default AdPlaceholder