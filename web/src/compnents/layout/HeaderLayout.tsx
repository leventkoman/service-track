import AppBar from "@mui/material/AppBar";
import {
    Alert,
    Avatar,
    Box, Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Menu,
    MenuItem,
    Typography
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import React, {useState} from "react";
import {Close, LockReset, Logout, Person} from "@mui/icons-material";
import ListItemIcon from "@mui/material/ListItemIcon";
import {useSnackbar} from "../../context/SnackbarContext";
import {authService} from "@stf/features/auth/services/auth.service";
import {useNavigate} from "react-router";
import {useStore} from "@stf/store/use-store.store";
import {getFirstLetterFromFullName} from "@stf/lib/utils";
import Divider from "@mui/material/Divider";
import PasswordField from "../common/PasswordField";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {changePasswordSchema, type ChangePasswordValues} from "@sts/schemas/auth.schema";

interface HeaderLayoutProps {
    drawerWidth: number;
    onDrawerToggle: () => void;
}
export default function HeaderLayout({drawerWidth, onDrawerToggle}: HeaderLayoutProps) {
    const state = useStore();
    const [changePasswordDialog, setChangePasswordDialog] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);
    const { showSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const {control, handleSubmit, formState, reset} = useForm<ChangePasswordValues>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: ''
        },
        mode: "onChange"
    })
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
        setAuthError(null);
        reset()
    };
    
    const gotoProfile = () => {
        navigate(`/users/${state.user?.id}/edit`)
    }

    const onChangePassword = async (values: ChangePasswordValues) => {
        try {
            await authService.changePassword(values)
            showSnackbar('Şifre başarılı bir şekilde değiştirildi.');
            setChangePasswordDialog(false);
            reset();
        } catch (e: any) {
            setAuthError(e.response.data.error ?? 'Şifre güncellenirken bir hata oluştur.')
        }
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
                    <MenuItem onClick={() => setChangePasswordDialog(true)}>
                        <ListItemIcon>
                            <LockReset fontSize="small" />
                        </ListItemIcon>
                        Şifre Değiştir
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={() => logout()}>
                        <ListItemIcon>
                            <Logout fontSize="small" />
                        </ListItemIcon>
                        Çıkış yap
                    </MenuItem>
                </Menu>
            </Toolbar>
            
            {/*Change Password Dialog*/}
            <Dialog open={changePasswordDialog} component="form" onSubmit={handleSubmit(onChangePassword)}>
                <DialogTitle>Şifre Değiştir</DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={() => setChangePasswordDialog(false)}
                    sx={(theme) => ({
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: theme.palette.grey[500],
                    })}
                >
                    <Close/>
                </IconButton>
                <DialogContent dividers>
                    <Box 
                        display={"flex"} 
                        // alignItems={"center"} 
                        flexDirection={"column"} 
                        justifyContent={"center"} 
                        maxWidth={400} 
                        gap={2}
                    >
                        {authError && (
                            <Alert sx={{display: "flex", alignItems: "center"}}
                                   severity="error">{authError}</Alert>
                        )}
                        {formState?.errors?.newPassword !== formState.errors.confirmNewPassword ?
                            <Alert sx={{display: "flex", alignItems: "center"}}
                                   severity="error">Şifreler eşleşmiyor</Alert>
                            : ''
                        }
                        <PasswordField
                            name="currentPassword"
                            control={control}
                            label="Mevcut şifre"
                            placeholder="Mevcut şifre"
                            required={true}
                            inputId="currentPassword"
                        />
                        <PasswordField
                            name="newPassword"
                            control={control}
                            label="Yeni şifre"
                            placeholder="Yeni şifre"
                            required={true}
                            inputId="newPassword"
                        />
                        <PasswordField
                            name="confirmNewPassword"
                            control={control}
                            label="Yeni şifre tekrarı"
                            placeholder="Yeni şifre tekrarı"
                            required={true}
                            inputId="confirmNewPassword"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setChangePasswordDialog(false)}>İptal</Button>
                    <Button disabled={!formState.isValid} variant="contained" type="submit">Kaydet</Button>
                </DialogActions>
            </Dialog>
        </AppBar>
        
    )
}