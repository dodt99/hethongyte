import { createMuiTheme, colors } from '@material-ui/core';
import shadows from './shadows';
import typography from './typography';

const theme = createMuiTheme({
  palette: {
    background: {
      dark: '#f4f6f8',
      default: '#3949ab',
      paper: colors.common.white,
    },
    primary: {
      main: colors.indigo[500],
    },
    secondary: {
      main: '#5850EC',
    },
  },
  overrides: {
    MuiTableCell: {
      head: {
        fontWeight: 900,
      },
    },
    MuiDialogTitle: {
      root: {
        '& .MuiTypography-h6': {
          fontWeight: 'bold',
          fontSize: '16px',
          textTransform: 'uppercase',
        },
      },
    },
  },
  shadows,
  typography,
});

export default theme;
