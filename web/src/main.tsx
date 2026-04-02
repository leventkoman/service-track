import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import './styles/styles.scss'
import {CssBaseline, ThemeProvider} from "@mui/material";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {RouterProvider} from "react-router";
import {router} from "./lib/router.tsx";
import {customTheme} from "./lib/theme.ts";
import {SnackbarProvider} from "./context/SnackbarContext";

createRoot(document.getElementById('root')!).render(
 
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ThemeProvider theme={customTheme}>
                <CssBaseline/>
                <SnackbarProvider>
                    <RouterProvider router={router}/>
                </SnackbarProvider>
            </ThemeProvider>
        </LocalizationProvider>

)
