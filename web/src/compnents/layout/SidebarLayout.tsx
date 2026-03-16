import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {Business, Dashboard, Diversity3, Group, Handyman} from "@mui/icons-material";
import {Link, useLocation} from "react-router";

interface SidebarLayoutProps {
    drawerWidth: number;
    isMobileOpen: boolean;
    onHandleDrawerTransitionEnd: () => void;
    onHandleDrawerClose: () => void;
}
export default function SidebarLayout({drawerWidth, isMobileOpen, onHandleDrawerClose, onHandleDrawerTransitionEnd}: SidebarLayoutProps) {
    const menuItems = [
        {text: 'Anasayfa', icon: <Dashboard />, path: '/dashboard'},
        {text: 'Firmalar', icon: <Business />, path: '/service-providers'},
        {text: 'Müşteriler', icon: <Diversity3 />, path: '/customers'},
        {text: 'Kullanıcılar', icon: <Group />, path: '/users'},
        {text: 'Service Kayıtları', icon: <Handyman />, path: '/service-requests'},
    ];
    const location = useLocation();
    const drawer = (
        <div>
            <Toolbar sx={{py: 1}}>
                <Typography
                    variant="h5"
                    textAlign="center"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontWeight="bold"
                >
                    <div
                        className="rounded-full w-10 h-10 p-3 bg-primary/10 flex items-center justify-center">
                        <span className="material-symbols-outlined !text-2xl text-primary">handyman</span>
                    </div>
                </Typography>
            </Toolbar>
            <Divider/>
            {/*<Divider/>*/}
            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.path} disablePadding>
                        <ListItemButton
                            component={Link}
                            to={item.path}
                            selected={location.pathname === item.path}
                            sx={{
                                "&.Mui-selected": {
                                    backgroundColor: "#e3f2fd",
                                },
                            }}
                        >
                            <ListItemIcon sx={{ mr: -2 }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </div>
    )
    
    return (
        <>
            <Box
                component="nav"
                sx={{width: {sm: drawerWidth}, flexShrink: {sm: 0}}}
                aria-label="mailbox folders"
            >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Drawer
                    variant="temporary"
                    open={isMobileOpen}
                    onTransitionEnd={onHandleDrawerTransitionEnd}
                    onClose={onHandleDrawerClose}
                    sx={{
                        display: {xs: 'block', sm: 'none'},
                        '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
                    }}
                    slotProps={{
                        root: {
                            keepMounted: true, // Better open performance on mobile.
                        },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: {xs: 'none', sm: 'block'},
                        '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
        </>
    )
}