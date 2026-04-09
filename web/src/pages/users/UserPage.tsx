import {useEffect, useMemo, useRef, useState} from "react";
import {useNavigate} from "react-router";
import {DataGrid, type GridColDef} from "@mui/x-data-grid";
import ActionMenu from "../../compnents/common/ActionMenu";
import {Add, Close, Delete, Edit, Repeat} from "@mui/icons-material";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Typography
} from "@mui/material";
import SearchTextField from "../../compnents/common/SearchTextField";
import {UserService} from "@stf/features/users/services/user.service";
import type {UserProfile} from "@sts/models/user-profile";
import {formatDateTimeToDMYHM, getRoles} from "@stf/lib/utils";
import {useSnackbar} from "../../context/SnackbarContext";
import StatusBadge from "../../compnents/common/StatusBadge";

export default function UserPage() {
    const {showSnackbar} = useSnackbar();
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<UserProfile[]>([]);
    const [search, setSearch] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [user, setUser] = useState<UserProfile | null>(null);
    const navigate = useNavigate();
    const controllerRef = useRef<AbortController | null>(null)

    const handleDelete = async (user: UserProfile) => {
        setOpenDialog(true);
        setUser(user);
    }
    
    const onDeleteUser = async () => {
        if (!user?.id) return;
        
        setLoading(true);
        setOpenDialog(false);
        
        const controller = new AbortController();
        controllerRef.current = controller;
        
        try {
            await UserService.deleteUserById(user.id, controller.signal);
            showSnackbar(`${user?.fullName} kişisini silme işlemi başarılı.`);
            await fetchData();
        } catch (err: any) {
            if (err.name === "CanceledError" || err.name === "AbortError") return ;
            showSnackbar(err.response.data.error ?? "Müşteriler silinirken bir hata oluştu.", "error")
        } finally {
            setLoading(false);
        }
    }

    const fetchData = async () => {
        const controller = new AbortController();
        controllerRef.current = controller;
        setLoading(true);
        try {
            const response = await UserService.getAllUsers(controller.signal);
            setData(response.data);
        } catch (err: any) {
            if (err.name === "CanceledError" || err.name === "AbortError") return ;
            showSnackbar(err.response.data.error ?? "Müşteriler silinirken bir hata oluştu.", "error")
        } finally {
            setLoading(false);
        }
    }
    
    const resendEmail = async (user: UserProfile) => {
        if (!user) return;
        const controller = new AbortController();
        controllerRef.current = controller;
        setLoading(true);
        try {
            await UserService.resendPasswordEmail(user.id, controller.signal);
            showSnackbar(`${user.fullName} kişisine şifre oluşturması için tekrardan mail gönderildi.`)
        } catch (err: any) {
            console.log(err.response)
            if (err.name === "CanceledError" || err.name === "AbortError") return ;
            showSnackbar(err.response.data.error ?? "Email gönderilirken bir hata oluştu.", "error")
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {

        (async () => {
            await fetchData();
        })();
        
        return () => {
            controllerRef.current?.abort();
        }
        
    }, []);

    const columns: GridColDef[] = [
        {field: 'fullName', headerName: 'Ad soyad', flex: 1, resizable: false, minWidth: 200},
        {field: 'title', headerName: 'Unvan', flex: 1, resizable: false, minWidth: 200},
        {
            field: 'roles', headerName: 'Roller', flex: 1, resizable: false, minWidth: 200,
            valueGetter: (_, row: UserProfile) => getRoles(row.roles),
        },
        {field: 'phone', headerName: 'Telefon', flex: 1, resizable: false, minWidth: 200},
        {field: 'email', headerName: 'Email', flex: 1, resizable: false, minWidth: 200},
        {
            field: 'address',
            headerName: 'Durumu',
            flex: 1,
            resizable: false,
            minWidth: 200,
            headerAlign: "center",
            align: "center",
            valueGetter: (_, row: UserProfile) => `${row.status?.nameLocalized || ''}`,
            renderCell: (params) => (
                <div>
                    <StatusBadge name={params.row.status?.name}
                                 nameLocalized={params.row.status?.nameLocalized}/>
                </div>
            )
        },
        {field: 'lastLoginTime', headerName: 'Son giriş', flex: 1, resizable: false, minWidth: 200,
            valueGetter: (_, row: UserProfile) => formatDateTimeToDMYHM(row.lastLoginTime)},
        
        {
            field: 'actions',
            headerName: '',
            flex: 1,
            resizable: false,
            sortable: false,
            disableColumnMenu: true,
            align: "right",
            renderCell: (params) => (
                <ActionMenu
                    row={params.row}
                    items={[
                        {
                            hidden: params.row.lastLoginTime,
                            label: 'Mail gönder',
                            icon: <Repeat fontSize="small"/>,
                            onClick: (row: UserProfile) => resendEmail(row),
                        },
                        {
                            label: 'Düzenle',
                            icon: <Edit fontSize="small"/>,
                            onClick: (row) => navigate(`/users/${row.id}/edit`),
                        },
                        {
                            label: 'Sil',
                            icon: <Delete fontSize="small"/>,
                            onClick: (row: UserProfile) => handleDelete(row),
                            color: 'error.main',
                        },
                    ]}
                />
            )
        },
    ];

    const filteredData = useMemo(() => {
        if (!search.trim()) return data || [];

        return data.filter((row: UserProfile) =>
                row?.fullName?.toLowerCase().trim().includes(search.toLowerCase()) ||
                row?.phone?.toLowerCase().trim().includes(search.toLowerCase()) ||
                row?.email?.toLowerCase().trim().includes(search.toLowerCase()) ||
                row?.address?.toLowerCase().trim().includes(search.toLowerCase()) ||
                row?.title?.toLowerCase().trim().includes(search.toLowerCase()) ||
                row?.lastLoginTime && formatDateTimeToDMYHM(row.lastLoginTime)?.toLowerCase().trim().includes(search.toLowerCase()) ||
                row?.roles && getRoles(row.roles).toLowerCase().trim().includes(search.toLowerCase())
        )
    }, [search, data])

    const paginationModel = {page: 0, pageSize: 10};

    return (
        <div>
            <Typography 
                variant="h5" 
                fontWeight="bold" 
                color="textPrimary" 
                sx={{py: {sm: 3, xs: 2, xl: 3}}}>
                Kullanıcılar
            </Typography>
            <Paper sx={{height: 'auto', width: "auto"}}>
                <Box sx={{
                    flexWrap: 'wrap',
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: {sm: 3, xs: 2, xl: 3}
                }}>
                    <SearchTextField 
                        value={search} 
                        onChange={setSearch}
                    />
                    <Button onClick={() => navigate('/users/create')} startIcon={<Add/>} variant="contained">Kullanıcı oluştur</Button>
                </Box>
                <DataGrid
                    rows={filteredData}
                    columns={columns}
                    initialState={{pagination: {paginationModel}}}
                    disableRowSelectionOnClick={true}
                    pageSizeOptions={[5, 10]}
                    sx={{border: 0, px: 1}}
                    loading={loading}
                />
            </Paper>

            <Dialog open={openDialog}>
                <DialogTitle>Kullanıcı sil</DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={() => setOpenDialog(false)}
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
                    <span className="font-bold">{user?.fullName}</span> isimli kullanıcıyı sileceksiniz.<br/>
                    Silmek istediğinize emin misiniz?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>İptal</Button>
                    <Button variant="contained" color="error" onClick={() => onDeleteUser()}>Sil</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}