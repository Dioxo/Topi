import Typography from '@mui/material/Typography';
import React from 'react';

export const Header = () => {
    return (
        <header style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="h1" color="primary">
                Topi
            </Typography>
            <Typography variant="h4">Torguard UI for raspberry Pi</Typography>
        </header>
    );
};
