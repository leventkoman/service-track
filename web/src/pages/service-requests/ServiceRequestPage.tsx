import {useEffect, useMemo, useRef, useState} from "react";
import {useNavigate} from "react-router";
import {DataGrid, type GridColDef} from "@mui/x-data-grid";
import ActionMenu from "../../compnents/common/ActionMenu";
import {Add, Close, Delete, Edit} from "@mui/icons-material";
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
import {serviceRequestService} from "@stf/features/service-request/services/service-request.service";
import {formatDateTimeToDMYHM} from "@stf/lib/utils";
import StatusBadge from "../../compnents/common/StatusBadge";
import type {ServiceRequest} from "@sts/models/service-request";
// import {AxiosError} from "axios";
import {useSnackbar} from "../../context/SnackbarContext";

export default function ServiceRequestPage() {
    const {showSnackbar} = useSnackbar();
    const [loading, setLoading] = useState<boolean>(true);
    // const [error, setError] = useState<string>('');
    const [data, setData] = useState<ServiceRequest[]>([]);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [deleteServiceRequest, setDeleteServiceRequest] = useState<ServiceRequest | null>(null);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const controllerRef = useRef<AbortController | null>(null);

    const handleDelete = async (serviceRequest: ServiceRequest) => {
        setDeleteServiceRequest(serviceRequest);
        setOpenDialog(true);
    }
    const onDelete = async () => {
        if (!deleteServiceRequest?.id) return;

        const controller = new AbortController();
        controllerRef.current = controller;

        setLoading(true);
        setOpenDialog(false);
        try {
            // await serviceRequestService.deleteServiceRequestById(deleteServiceRequest.id, controller.signal);
            showSnackbar(`${deleteServiceRequest.serviceNumber} numaralı servis kaydı silme işlemi başarılı.`);
            await fetchData();
        } catch (err: any) {
            if (err.name === "CanceledError" || err.name === "AbortError") return;
            showSnackbar(err.response.data.error ?? "Müşteriler silinirken bir hata oluştu.", "error")
        }
    }

    const fetchData = async () => {
        setLoading(true);
        const controller = new AbortController();
        controllerRef.current = controller;
        try {
            const response = await serviceRequestService.getAllServiceRequests(controller.signal);
            setData(response.data);
        } catch (err: any) {
            // const err = e as AxiosError<{ error: string }>;
            // console.error('catch çalıştı:', err.response?.data.error);
            // setError(err.response?.data.error ?? 'Bir hata oluştu.');
            // console.log(error)
            if (err.name === "CanceledError" || err.name === "AbortError") return;
            showSnackbar(err.response.data.error ?? "Servis kayıtları listesini çekerken bilinmedik bir hata oluştu", "error")
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

    }, [])

    const columns: GridColDef[] = [
        {field: 'serviceNumber', headerName: 'Servis Numarası', flex: 1, resizable: false, minWidth: 180},
        {
            field: 'customer', headerName: 'Müşteri', flex: 1, resizable: false, minWidth: 200,
            valueGetter: (_, row: ServiceRequest) => `${row.customer.fullName || ''}`,
        },
        {
            field: 'serviceProvider', headerName: 'Firma', flex: 1, resizable: false, minWidth: 200,
            valueGetter: (_, row: ServiceRequest) => row.serviceProvider.companyName
        },
        {
            field: 'serviceRequestsStatus',
            headerName: 'Durumu',
            flex: 1,
            resizable: false,
            minWidth: 200,
            headerAlign: "center",
            align: "center",
            valueGetter: (_, row: ServiceRequest) => `${row.serviceRequestsStatus.nameLocalized || ''}`,
            renderCell: (params) => (
                <div>
                    <StatusBadge name={params.row.serviceRequestsStatus.name}
                                 nameLocalized={params.row.serviceRequestsStatus.nameLocalized}/>
                </div>
            )
        },
        {
            field: 'createdBy', headerName: 'Oluşturan', flex: 1, resizable: false, minWidth: 200,
            valueGetter: (_, row: ServiceRequest) => `${row.createdBy.fullName || ''}`,
        },
        {
            field: 'totalAmount', headerName: 'Toplam Fiyat', flex: 1, resizable: false, minWidth: 200
        },
        {
            field: 'startedAt', headerName: 'Başlama Tarihi', flex: 1, resizable: false, minWidth: 200,
            valueGetter: (_, row: ServiceRequest) => formatDateTimeToDMYHM(row.startedAt)
        },
        {
            field: 'completedAt', headerName: 'Tamamlanma Tarihi', flex: 1, resizable: false, minWidth: 200,
            valueGetter: (_, row: ServiceRequest) => formatDateTimeToDMYHM(row.completedAt)
        },
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
                            label: 'Düzenle',
                            icon: <Edit fontSize="small"/>,
                            onClick: (row: ServiceRequest) => navigate(`/service-requests/${row.id}/edit`),
                        },
                        {
                            label: 'Sil',
                            icon: <Delete fontSize="small"/>,
                            onClick: (row: ServiceRequest) => handleDelete(row),
                            color: 'error.main',
                        },
                    ]}
                />
            )
        },
    ];

    const filteredData = useMemo(() => {
        if (!search.trim()) return data || [];

        return data.filter((row: ServiceRequest) =>
            row?.serviceNumber?.toLowerCase().includes(search.toLowerCase()) ||
            row?.customer.fullName?.toLowerCase().includes(search.toLowerCase()) ||
            row?.serviceProvider.companyName?.toLowerCase().includes(search.toLowerCase()) ||
            row?.serviceRequestsStatus.nameLocalized?.toLowerCase().includes(search.toLowerCase()) ||
            row?.createdBy?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
            row?.totalAmount?.toString()?.trim()?.toLowerCase().includes(search.toLowerCase()) ||
            row?.startedAt && formatDateTimeToDMYHM(row.startedAt)?.trim()?.toLowerCase()?.includes(search.toLowerCase()) ||
            row?.completedAt && formatDateTimeToDMYHM(row.completedAt)?.trim()?.toLowerCase().includes(search.toLowerCase())
        )
    }, [search, data])

    const paginationModel = {page: 0, pageSize: 10};

    return (
        <div>
            <Typography variant="h5" fontWeight="bold" color="textPrimary" sx={{py: {sm: 3, xs: 2, xl: 3}}}>
                Servis Kayıtları
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
                    <Button
                        onClick={() => navigate('/service-requests/create')}
                        startIcon={<Add/>}
                        variant="contained"
                    >
                        Yeni kayıt oluştur
                    </Button>
                </Box>
                <DataGrid
                    rows={filteredData}
                    columns={columns}
                    columnVisibilityModel={{
                        serviceProvider: false // only superAdmin can see this column
                    }}
                    loading={loading}
                    initialState={{pagination: {paginationModel}}}
                    disableRowSelectionOnClick={true}
                    pageSizeOptions={[5, 10]}
                    sx={{border: 0, px: 1}}
                />
            </Paper>


            <Dialog open={openDialog}>
                <DialogTitle>Service kaydı sil</DialogTitle>
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
                    <span className="font-bold">{deleteServiceRequest?.serviceNumber}</span> numaralı servis kaydını
                    sileceksiniz.<br/>
                    Silmek istediğinize emin misiniz?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>İptal</Button>
                    <Button variant="contained" color="error" onClick={() => onDelete()}>Sil</Button>
                </DialogActions>
            </Dialog>

        </div>
    )
}