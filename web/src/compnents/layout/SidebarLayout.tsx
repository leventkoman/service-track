import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {Business, CurrencyExchange, Dashboard, Diversity3, Group, Handyman} from "@mui/icons-material";
import {Link, useLocation, useNavigate} from "react-router";
import {useStore} from "@stf/store/use-store.store";
import {roleMatch} from "@stf/lib/utils";

interface SidebarLayoutProps {
    drawerWidth: number;
    isMobileOpen: boolean;
    onHandleDrawerTransitionEnd: () => void;
    onHandleDrawerClose: () => void;
}
export default function SidebarLayout({drawerWidth, isMobileOpen, onHandleDrawerClose, onHandleDrawerTransitionEnd}: SidebarLayoutProps) {
    const navigate = useNavigate();
    const user = useStore(s => s.user);
    const isSPUser = roleMatch(user?.roles, ['admin', 'employee']);
    const menuItems = [
        {text: 'Anasayfa', icon: <Dashboard />, path: '/dashboard'},
        {text: isSPUser ? 'Firma': 'Firmalar', icon: <Business />, path: '/service-providers'},
        {text: 'Müşteriler', icon: <Diversity3 />, path: '/customers'},
        {text: isSPUser ? 'Çalışanlar' : 'Kullanıcılar', icon: <Group />, path: '/users'}, 
        {text: 'Service Kayıtları', icon: <Handyman />, path: '/service-requests'},
        {text: 'Üyelikler', hidden: isSPUser, icon: <CurrencyExchange />, path: '/subscriptions'},
    ];
    const location = useLocation();
    const drawer = (
        <div>
            <Toolbar sx={{py: 1, paddingLeft: '16px !important'}}>
                <div className="flex items-center justify-start w-full cursor-pointer">
                    <img
                        width="112"
                        src="/logo-primary.png"
                        alt="logo"
                        loading="lazy"
                        onClick={() => navigate(`/dashboard`)}
                    />
                </div>
            </Toolbar>
            <Divider/>
            {/*<Divider/>*/}
            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.path} disablePadding>
                        <ListItemButton
                            component={Link}
                            to={item.path}
                            selected={location.pathname.includes(item.path)}
                            hidden={item?.hidden}
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
                <Drawer
                    variant="temporary"
                    open={isMobileOpen}
                    onTransitionEnd={onHandleDrawerTransitionEnd}
                    onClose={onHandleDrawerClose}
                    sx={{
                        display: {xs: 'block', md: 'none'},
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