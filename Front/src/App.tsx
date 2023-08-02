import React from 'react';
import { Header } from "./Components/Header/Header";
import './App.css';
import { Flags } from './Components/Flags/Flags';
import { CurrentCountry } from './Components/CurrentCountry/CurrentCountry';
import { Box } from '@mui/system';
import CssBaseline from "@mui/material/CssBaseline";

function App() {
  const [refreshCurrentCountry, setRefreshCurrentCountry] = React.useState(true);
  return (

    <Box className="App">
      <CssBaseline/>
      <Header/>
      <Flags onCountrySelected={() => setRefreshCurrentCountry(r => !r)}/>
      <CurrentCountry refreshCurrentCountry={refreshCurrentCountry}/>
    </Box>
  );
}

export default App;
