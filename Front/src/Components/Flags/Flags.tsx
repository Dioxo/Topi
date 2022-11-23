import { Button, Divider, Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import React from 'react';
import { Api as TopiApi, Flag } from '../../Apis/TopiApi';

const topiApi = new TopiApi({ baseUrl: 'http://localhost:3001' });
export const Flags = () => {
    return (
        <section style={{ width: '80%', margin: '0 auto' }}>
            <Grid container spacing={1}></Grid>
        </section>
    );
};
