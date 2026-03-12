import {createTheme} from "@mui/material";

export const customTheme = createTheme({
    palette: {
        primary: {
            main: '#135bec'
        }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                containedPrimary: {
                    '&:hover': {
                        backgroundColor: '#135bec',
                    },
                },
            },
        },
    }
});