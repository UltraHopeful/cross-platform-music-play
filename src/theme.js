import { createTheme } from '@mui/material/styles';

const theme = createTheme({
      palette: {
        type: 'dark',
        primary: {
          main: '#6cbdea',
        },
        secondary: {
          main: '#a4a4a4',
        },
        error: {
          main: '#ef5350',
        },
        warning: {
          main: '#ffa726',
        },
        info: {
          main: '#42a5f5',
        },
        success: {
          main: '#66bb6a',
        },
      },
      typography: {
        fontFamily: 'Balsamiq Sans',
      },
    });

export default theme;