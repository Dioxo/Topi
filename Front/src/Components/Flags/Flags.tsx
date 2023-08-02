import { Button, Paper , Box} from '@mui/material';
import Typography from '@mui/material/Typography';
import React from 'react';
import { Api as TopiApi, Flag } from '../../Apis/TopiApi';

export const Flags = ({onCountrySelected}: {onCountrySelected: () => void}) => {
    const [flags, setFlags] = React.useState<Flag[]>([]);
    const topiApi = React.useMemo(() => new TopiApi({ baseUrl: 'http://localhost:3001' }), []);

    React.useEffect(() => {
        let isActiveRequest = true;
        (async () => {
            const flagsResult = await topiApi.countries.countriesList();
            if(flagsResult.ok && isActiveRequest){
                setFlags(flagsResult.data);
            }

        })();
        return () => {
            isActiveRequest = false;
        }
    }, [topiApi]);

    const handleCountrySelected = React.useCallback((countryOrIpName: string) => {
        topiApi.country.countryCreate({current: countryOrIpName})
            .then((result) => {
                if(result.ok){
                    onCountrySelected();
                }
            });
    }, [topiApi, onCountrySelected]);
    return (
        <section style={{ width: '80%', margin: '30px auto 0 auto' , display: "flex", flexWrap: "wrap", gap:"20px", justifyContent: "space-evenly", marginBottom: "20px" }}>
            {flags.map((f, i) => 
                (
                    <Paper key={i} elevation={5} sx={{width: "280px", padding: "20px"}}>
                        <Box  sx={{display: "flex", justifyContent: "flex-start", alignItems: "center", gap: "20px", marginBottom: "10px"}}>
                            <Typography component="span" sx={{textAlign:"left", wordBreak:"break-word", textTransform: "capitalize"}}>{f.name.toLowerCase().replace(".", " - ")}</Typography>
                            { f.icon && <img style={{width: "100px", marginLeft: "auto", objectFit: "contain",border: "1px black solid" }} src={f.icon}></img> }
                        </Box>

                        <Button variant="contained" onClick={() => handleCountrySelected(f.name)}>Connect</Button>
                    </Paper>
                ))}
        </section>
    );
};
