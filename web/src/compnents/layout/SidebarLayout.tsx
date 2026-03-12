import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import ListItemText from "@mui/material/ListItemText";

interface SidebarLayoutProps {
    drawerWidth: number;
    isMobileOpen: boolean;
    onHandleDrawerTransitionEnd: () => void;
    onHandleDrawerClose: () => void;
}
export default function SidebarLayout({drawerWidth, isMobileOpen, onHandleDrawerClose, onHandleDrawerTransitionEnd}: SidebarLayoutProps) {
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
            <List>
                {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton
                            
                        >
                            <ListItemIcon>
                                {index % 2 === 0 ? <InboxIcon/> : <MailIcon/>}
                            </ListItemIcon>
                            <ListItemText primary={text}/>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider/>
            <List>
                {['All mail', 'Trash', 'Spam'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton
                           
                        >
                            <ListItemIcon>
                                {index % 2 === 0 ? <InboxIcon/> : <MailIcon/>}
                            </ListItemIcon>
                            <ListItemText primary={text}/>
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