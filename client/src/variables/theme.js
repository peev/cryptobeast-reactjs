import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

export const THEME = createMuiTheme({
  typography: {
    fontFamily: 'Lato, Helvetica, Arial, sans-serif',
  },
  // not all colors bellow are set for the hole palette
  palette: {
    primary: {
      main: '#22252f',
      light: '#212121',
      contrastText: '#757575',
    },
    whiteBackground: '#FFF',
    primaryColor: '#EEEEEE',
    lightPrimaryColor: '#B2EBF2',
    accentColor: '#607D8B',
    tableDivider: '#5d6778',
    redLetters: '#eb4562',
    greenLetters: '#3ab693',
  },
});

export default THEME;
