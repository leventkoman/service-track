import AppBar from "@mui/material/AppBar";
import {Avatar, Box, Menu, MenuItem, Typography} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import React, {useState} from "react";
import {Logout, Person} from "@mui/icons-material";
import ListItemIcon from "@mui/material/ListItemIcon";
import {useSnackbar} from "../../context/SnackbarContext";
import {authService} from "@stf/features/auth/services/auth.service";
import {useNavigate} from "react-router";
import {useStore} from "@stf/store/use-store.store";
import {getFirstLetterFromFullName} from "@stf/lib/utils";
import Divider from "@mui/material/Divider";

interface HeaderLayoutProps {
    drawerWidth: number;
    onDrawerToggle: () => void;
}
export default function HeaderLayout({drawerWidth, onDrawerToggle}: HeaderLayoutProps) {
    const state = useStore();
    const { showSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    
    const gotoProfile = () => {
        navigate(`/users/${state.user?.id}/edit`)
    }
    
    
    const logout = async () => {
        try {
            await authService.logout();
            state.logout();
            navigate("/auth/login");
        } catch (err: any) {
            showSnackbar(err.response?.data?.error ?? 'Çıkış yaparken bir hata ile karşılaşıldı.', "error")
        }
    }
    return (
        <AppBar
            position="fixed"
            color="inherit"
            elevation={0}
            sx={{
                width: { sm: `calc(100% - ${drawerWidth}px)` },
                ml: { sm: `${drawerWidth}px` },
                borderBottomWidth: 'thin',
                borderBottomColor: 'rgba(0, 0, 0, 0.12)',
            }}
        >
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={onDrawerToggle}
                    sx={{ mr: 2, display: { sm: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>
                <Box sx={{flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'end'}}>
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <Avatar sx={{ width: 32, height: 32 }}>{getFirstLetterFromFullName(state?.user?.fullName!)}</Avatar>
                    </IconButton>
                </Box>
                <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <Typography display="flex" align="center" justifyContent="center" sx={{px: 2, fontSize: 16 }}>
                        { state.user?.fullName?.toUpperCase() }
                    </Typography>
                    <Typography display="flex" align="center" justifyContent="center" sx={{px: 2, py: 1, fontSize: 16 }}>
                        { state.user?.email }
                    </Typography>
                    <Divider />
                    <MenuItem onClick={() => gotoProfile()}>
                        <ListItemIcon>
                            <Person fontSize="small" />
                        </ListItemIcon>
                        Hesabım
                    </MenuItem>
                    <MenuItem onClick={() => logout()}>
                        <ListItemIcon>
                            <Logout fontSize="small" />
                        </ListItemIcon>
                        Çıkış yap
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    )
}