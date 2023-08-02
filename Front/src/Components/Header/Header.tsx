import React from 'react';
import {Menu, MenuItem, Typography, Button, IconButton} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import {Api as TopiApi} from "../../Apis/TopiApi";

function OptionsMenu() {
    const topiApi = React.useMemo(() => new TopiApi({ baseUrl: 'http://localhost:3001' }), []);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = React.useCallback(() => {
        topiApi.cache.cacheDelete().then(() => {
            window.location.reload();
        });
    }, []);

    return (
        <div>
            <IconButton sx={{ position: "absolute", right: "10px", }} onClick={handleClick}>
                <MenuIcon />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose}>Restart configuration</MenuItem>
            </Menu>
        </div>
    );
}

export const Header = () => {
    return (
        <>
            <OptionsMenu/>
            <header style={{ display: 'flex', margin: "10px", flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant="h1" color="primary">
                    Topi
                </Typography>
                <Typography variant="h4">Torguard UI for Raspberry Pi</Typography>
            </header>

        </>
    );
};
