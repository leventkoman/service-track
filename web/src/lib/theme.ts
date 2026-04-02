import {createTheme} from "@mui/material";
import type {} from '@mui/x-data-grid/themeAugmentation';
import {trTR} from "@mui/x-data-grid/locales";

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
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    '& fieldset': {
                        borderColor: '#ccc',
                    },

                    '&:hover fieldset': {
                        borderColor: '#135bec',
                    },

                    '&.Mui-focused fieldset': {
                        borderColor: '#135bec',
                        borderWidth: 2,
                    },
                }
            }
        },
        MuiDataGrid: {
            defaultProps: {
                localeText: {
                    ...trTR.components.MuiDataGrid.defaultProps.localeText,
                    noRowsLabel: 'Kayıt bulunamadı',
                }
            },
        },
    }
});