import React from 'react';
import {ThemeProvider} from 'styled-components'
import GlobalStyles from './Styles/GlobalStyles';
import Routes from './Routes';

import { useTheme } from './utils/Hooks/theme';


const App: React.FC = () => {
  const {theme} = useTheme();

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Routes />
    </ThemeProvider>
  );
}

export default App;
