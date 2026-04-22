import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    styled,
    TextField,
    Typography
} from "@mui/material";
import {DataGrid, type GridColDef} from "@mui/x-data-grid";
import {useEffect, useMemo, useRef, useState} from "react";
import {serviceProviderService} from "@stf/features/service-provider/services/service-provider.service";
import {Add, Close, Edit} from "@mui/icons-material";
import ActionMenu from "../../compnents/common/ActionMenu";
import SearchTextField from "../../compnents/common/SearchTextField";
import type {ServiceProviderList} from "@sts/types/service-provider.types";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    createServiceProviderSchema,
    type CreateServiceProviderValue
} from "@sts/schemas/create-service-provider.schema";
import {PageMode} from "../../enums/page-mode.enum";
import {useSnackbar} from "../../context/SnackbarContext";
import {useStore} from "@stf/store/use-store.store";
import {roleMatch} from "@stf/lib/utils";

export const BootstrapDialog = styled(Dialog)(({theme}) => ({
    '& .MuiDialogTitle-root': {
        padding: theme.spacing(2, 3),
    },
    '& .MuiDialogContent-root': {
        padding: theme.spacing(4, 3),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1, 3),
    },
}));

export default function ServiceProviderPage() {
    const user = useStore(s => s.user);
    const isAdmin = roleMatch(user?.roles, ['admin']);
    const {showSnackbar} = useSnackbar();
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<ServiceProviderList[]>([]);
    const [search, setSearch] = useState("");
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const [deleteServiceProvider] = useState<ServiceProviderList | null>(null);
    const [dialogMode, setDialogMode] = useState<PageMode>(PageMode.CREATE);
    const paginationModel = {page: 0, pageSize: 10};
    const controllerRef = useRef<AbortController | null>(null);
    const defaultValues: CreateServiceProviderValue = {
        id: null,
        phone: '',
        email: '',
        companyName: '',
        taxNumber: '',
        address: ''
    };

    const {control, handleSubmit, formState, reset} = useForm<CreateServiceProviderValue>({
        resolver: zodResolver(createServiceProviderSchema),
        defaultValues,
        mode: "onChange"
    });

    const fetchData = async () => {
        setLoading(true);
        const controller = new AbortController();
        controllerRef.current = controller;
        try {
            const response = await serviceProviderService.getAllServiceProviders(controller.signal);
            setData(response.data);
        } catch (err: any) {
            if (err.name === "CanceledError" || err.name === "AbortError") return;
            showSnackbar(err.response.data.error ?? 'Oppss! Birşeyler test gitti.', 'error')
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        (async () => {
            await fetchData();
        })();

        return () => {
            controllerRef.current?.abort()
        }
    }, []);

    const onSubmit = async (values: CreateServiceProviderValue): Promise<void> => {
        setLoading(true);
        handleClose();
        const controller = new AbortController();
        controllerRef.current = controller;
        try {
            dialogMode === PageMode.CREATE
            ? await serviceProviderService.createServiceProvider(values, controller.signal)
            : await serviceProviderService.updateServiceProvider(values, controller.signal);
            
            showSnackbar('Başarılı bir şekilde güncellendi.')
            await fetchData();
        } catch (err: any) {
            if (err.name === "CanceledError" || err.name === "AbortError") return;
            showSnackbar(err.response.data.error ?? 'Oppss! Birşeyler test gitti.', 'error')
        } finally {
            setLoading(false);
        }
    }

    const handleClickOpen = (pageMode: PageMode = PageMode.CREATE, values?: CreateServiceProviderValue) => {
        setOpenDialog(true);
        setDialogMode(pageMode);
        if (pageMode === PageMode.EDIT && values) {
            reset(values)
        } else {
            reset(defaultValues);
        }
    }

    const handleClose = () => {
        setOpenDialog(false);
        reset()
    }

    // const handleDelete = async (sp: ServiceProviderList) => {
    //     setOpenDeleteDialog(true);
    //     setDeleteServiceProvider(sp)
    // }
    
    const onDelete = async () => {
        if (!deleteServiceProvider) return;
        
        setLoading(true);
        setOpenDeleteDialog(false);
        
        const controller = new AbortController();
        controllerRef.current = controller;
        try {
            await serviceProviderService.deleteService(deleteServiceProvider.id, controller.signal);
            showSnackbar(`${deleteServiceProvider.companyName} silme işlemi başarılı.`);
            await fetchData();
        } catch (err: any) {
            if (err.name === "CanceledError" || err.name === "AbortError") return ;
            showSnackbar(err.response.data.error ?? "Firma silinirken bir hata oluştu.", "error")
        } finally {
            setLoading(false);
        }
    }

    const columns: GridColDef[] = [
        {field: 'companyName', headerName: 'Firma Adı', flex: 1, resizable: false, minWidth: 200},
        {field: 'taxNumber', headerName: 'Vergi Numarası', flex: 1, resizable: false, minWidth: 200},
        {field: 'phone', headerName: 'Telefon', flex: 1, resizable: false, minWidth: 200},
        {field: 'email', headerName: 'Email', flex: 1, resizable: false, minWidth: 200},
        {
            field: 'createdBy', headerName: 'Oluşturan', flex: 1, resizable: false, minWidth: 200,
            valueGetter: (_, row: ServiceProviderList) => `${row.createdBy.fullName || ''}`,
        },
        {
            field: 'actions',
            headerName: '',
            flex: 1,
            resizable: false,
            sortable: false,
            disableColumnMenu: true,
            maxWidth: 50,
            align: "right",
            hideable: !isAdmin,
            renderCell: (params) => (
                <ActionMenu
                    row={params.row}
                    items={[
                        {
                            label: 'Düzenle',
                            icon: <Edit fontSize="small"/>,
                            onClick: (row: ServiceProviderList) => handleClickOpen(PageMode.EDIT, row),
                        },
                        // {
                        //     label: 'Sil',
                        //     icon: <Delete fontSize="small"/>,
                        //     onClick: (row: ServiceProviderList) => handleDelete(row),
                        //     color: 'error.main',
                        // },
                    ]}
                />
            )
        },
    ];

    const filteredData = useMemo(() => {
        if (!search.trim()) return data || [];

        return data.filter((row: ServiceProviderList) =>
            row?.companyName?.toLowerCase().includes(search.toLowerCase()) ||
            row?.phone?.toLowerCase().includes(search.toLowerCase()) ||
            row?.email?.toLowerCase().includes(search.toLowerCase()) ||
            row?.taxNumber?.toLowerCase().includes(search.toLowerCase()) ||
            row?.createdBy?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
            row?.address?.toLowerCase().includes(search.toLowerCase())
        )
    }, [search, data])

    return (
        <div>
            <Typography variant="h5" fontWeight="bold" color="textPrimary" sx={{py: {sm: 3, xs: 2, xl: 3}}}>
                FİRMALAR
            </Typography>
            <Paper sx={{height: 'auto', width: "auto"}}>
                <Box sx={{
                    flexWrap: 'wrap',
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    py: {sm: 3, xs: 2, xl: 3},
                    px: 1
                }}>
                    <SearchTextField value={search} onChange={setSearch}/>
                    {/*{data && data.length > 0*/}
                    {/*    ? ''*/}
                    {/*    : <Button startIcon={<Add/>} variant="contained" onClick={() => handleClickOpen(PageMode.CREATE)}>Firma*/}
                    {/*        oluştur</Button>}*/}

                    { isAdmin && (
                        <>
                            <Button startIcon={<Add/>} variant="contained" onClick={() => handleClickOpen(PageMode.CREATE)}>Firma oluştur</Button>
                        </>
                    ) }
                </Box>
                <DataGrid
                    columnVisibilityModel={{
                        actions: isAdmin!
                    }}
                    rows={filteredData}
                    columns={columns}
                    loading={loading}
                    initialState={{pagination: {paginationModel}}}
                    disableRowSelectionOnClick={true}
                    pageSizeOptions={[5, 10]}
                    sx={{border: 0, px: 1}}
                />
            </Paper>


            {/*Create/Update Dialog*/}
            <BootstrapDialog
                sx={{
                    '& .MuiDialog-paper': {
                        width: {
                            xs: '90%',
                            sm: '400px',
                            md: '500px',
                            lg: '500px',
                        },
                    },
                }}
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={openDialog}
            >
                <DialogTitle id="customized-dialog-title">
                    Firma Oluştur
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
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
                        display="flex"
                        flexDirection="column"
                        gap={3}
                    >
                        <Typography
                            variant="body1"
                            fontWeight="bold"
                        >
                            Firma bilgileri
                        </Typography>
                        <Controller
                            name="companyName"
                            control={control}
                            render={({field, fieldState}) => (
                                <TextField
                                    {...field}
                                    value={field.value ?? ''}
                                    fullWidth
                                    slotProps={{inputLabel: {required: true}}}
                                    error={fieldState.invalid}
                                    helperText={fieldState.error?.message ? 'Geçersiz firma adı' : ''}
                                    label="Firma adı"
                                    placeholder="Firma adı"
                                />
                            )}
                        />
                        <Controller
                            name="taxNumber"
                            control={control}
                            render={({field, fieldState}) => (
                                <TextField
                                    {...field}
                                    value={field.value ?? ''}
                                    fullWidth
                                    error={fieldState.invalid}
                                    helperText={fieldState.error?.message ? 'Geçersiz vergi numarası' : ''}
                                    label="Vergi numarası"
                                    placeholder="Vergi numarası"
                                />
                            )}
                        />
                        <Typography
                            variant="body1"
                            fontWeight="bold"
                        >
                            İletişim bilgileri
                        </Typography>
                        <Controller
                            name="phone"
                            control={control}
                            render={({field, fieldState}) => (
                                <TextField
                                    {...field}
                                    value={field.value ?? ''}
                                    fullWidth
                                    type="phone"
                                    slotProps={{inputLabel: {required: true}}}
                                    error={fieldState.invalid}
                                    helperText={fieldState.error?.message ? 'Geçersiz telefon numarası' : ''}
                                    label="Telefon"
                                    placeholder="Telefon"
                                />
                            )}
                        />
                        <Controller
                            name="email"
                            control={control}
                            render={({field, fieldState}) => (
                                <TextField
                                    {...field}
                                    value={field.value ?? ''}
                                    fullWidth
                                    slotProps={{inputLabel: {required: true}}}
                                    error={fieldState.invalid}
                                    helperText={fieldState.error?.message ? 'Geçersiz email' : ''}
                                    label="Email"
                                    placeholder="Email"
                                />
                            )}
                        />
                        <Controller
                            name="address"
                            control={control}
                            render={({field, fieldState}) => (
                                <TextField
                                    {...field}
                                    value={field.value ?? ''}
                                    multiline
                                    rows={3}
                                    fullWidth
                                    slotProps={{inputLabel: {required: true}}}
                                    error={fieldState.invalid}
                                    helperText={fieldState.error?.message ? 'Geçersiz adres' : ''}
                                    label="Adres"
                                    placeholder="Adres"
                                />
                            )}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        İptal
                    </Button>
                    <Button
                        autoFocus
                        onClick={handleSubmit(onSubmit)}
                        disabled={loading || !formState.isValid || formState.isSubmitting}
                    >
                        Kaydet
                    </Button>
                </DialogActions>
            </BootstrapDialog>

            {/*Delete Dialog*/}
            <Dialog open={openDeleteDialog}>
                <DialogTitle>Firma sil</DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={() => setOpenDeleteDialog(false)}
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
                    <span className="font-bold">{ deleteServiceProvider?.companyName }</span> firmasını sileceksiniz.<br/>
                    Silmek istediğinize emin misiniz?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>İptal</Button>
                    <Button variant="contained" color="error" onClick={() => onDelete()}>Sil</Button>
                </DialogActions>
            </Dialog>

        </div>
    )
}