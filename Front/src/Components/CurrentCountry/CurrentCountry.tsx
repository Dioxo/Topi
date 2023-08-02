import { Box, useTheme, Typography } from '@mui/material';
import React from 'react';
import { Api as TopiApi, Flag } from '../../Apis/TopiApi';

export const CurrentCountry = ({refreshCurrentCountry} : {refreshCurrentCountry: boolean}) => {
    const theme = useTheme();

    const topiApi = React.useMemo(() => new TopiApi({ baseUrl: 'http://localhost:3001' }), []);

    const [current, setCurrent] = React.useState<Flag>();

    React.useEffect(() => {
        let isActiveRequest = true;
        (async () => {
            const result = await topiApi.current.currentList();
            if(isActiveRequest){
                console.log(result);
                setCurrent(result.data);
            }
        })();
        return () => {
            isActiveRequest = false;
        }
    }, [refreshCurrentCountry, topiApi]);

    return current ? 
        (<Box style={{
            height: "130px",
            width: "100%",
            position: "sticky",
            bottom : 0,
            backgroundColor: theme.palette.primary.light,
            display: "flex",
            justifyContent: "center",
            alignItems: "center", 
            flexDirection: "column"
        }}>
            <Typography variant='h5' sx={{textAlign:"left", wordBreak:"break-word", textTransform: "capitalize", fontWeight: "bold"}}>Current country</Typography>
            <Box  sx={{display: "flex", justifyContent: "flex-start", alignItems: "center", gap: "20px", marginBottom: "10px"}}>
                <Typography component="span" sx={{textAlign:"left", wordBreak:"break-word", textTransform: "capitalize"}}>{current.name.toLowerCase().replace(".", " - ")}</Typography>
                { current.icon && <img style={{width: "100px", objectFit: "contain",border: "1px black solid" }} src={current.icon}></img> }
            </Box>
        </Box>) 
        : null;
};
