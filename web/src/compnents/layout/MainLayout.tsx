import * as React from 'react'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import {Outlet} from "react-router";
import {Container} from "@mui/material";
import HeaderLayout from "./HeaderLayout";
import SidebarLayout from "./SidebarLayout";

const drawerWidth = 240

export default function MainLayout() {
    const [mobileOpen, setMobileOpen] = React.useState(false)
    const [isClosing, setIsClosing] = React.useState(false)
    // const [selectedMenuItem, setSelectedMenuItem] = React.useState('Inbox') // State for selected menu item

    const handleDrawerClose = () => {
        setIsClosing(true)
        setMobileOpen(false)
    }

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false)
    }

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen)
        }
    }

    // const handleMenuItemClick = (text: string) => {
    //     setSelectedMenuItem(text)
    //     if (mobileOpen) { // Close drawer on mobile after selection
    //         handleDrawerClose()
    //     }
    // }

    return (
        <Box sx={{display: 'flex'}}>
            <HeaderLayout
                drawerWidth={drawerWidth}
                onDrawerToggle={handleDrawerToggle}
            />
            <SidebarLayout
                drawerWidth={drawerWidth}
                isMobileOpen={mobileOpen}
                onHandleDrawerTransitionEnd={handleDrawerTransitionEnd}
                onHandleDrawerClose={handleDrawerClose}
            />
            <Box
                component="main"
                className={'bg-[#f9fafb] h-screen'}
                sx={{
                    flexGrow: 1, p: 3, 
                    width: {sm: `calc(100% - ${drawerWidth}px)`}, 
                    overflowX: 'hidden'}}
            >
                <Toolbar/>
                <Container maxWidth="xl">
                    <Outlet/>
                </Container>
            </Box>
        </Box>
    )
}