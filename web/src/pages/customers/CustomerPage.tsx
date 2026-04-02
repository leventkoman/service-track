import {useEffect, useMemo, useRef, useState} from "react";
import {CustomerService} from "@stf/features/customers/services/customer.service";
import {type Customer} from "@sts/models/customer-response";
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
import {useNavigate} from "react-router";
import {convertCustomerType, getCompanyName} from "@stf/lib/utils";
import {useSnackbar} from "../../context/SnackbarContext";
import {CustomerTypeBadge} from "../../compnents/common/CustomerTypeBadge";

export default function CustomerPage() {
    const {showSnackbar} = useSnackbar();
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [deleteCustomer, setDeleteCustomer] = useState<Customer | null>(null);
    const controllerRef = useRef<AbortController | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<Customer[]>([]);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    
    const handleDeleteDialog = (customer: Customer): void => {
        setOpenDialog(true);
        setDeleteCustomer(customer);
    }

    const onDelete = async () => {
        if (!deleteCustomer?.id) return;
        
        const controller = new AbortController();
        controllerRef.current = controller;
        
        setLoading(true);
        setOpenDialog(false);
        
        try {
            await CustomerService.deleteCustomer(deleteCustomer.id, controller.signal);
            showSnackbar(`${deleteCustomer.fullName} silme işlemi başarılı.`);
            await fetchData();
        } catch (err: any) {
            if (err.name === "CanceledError" || err.name === "AbortError") return ;
            showSnackbar(err.response.data.error ?? "Müşteriler silinirken bir hata oluştu.", "error")
        } finally {
            setLoading(false);
        }
    }

    const fetchData = async (): Promise<void> => {
        const controller = new AbortController();
        controllerRef.current = controller;
        setLoading(true);
        
        try {
            const response = await CustomerService.getCustomers(controller.signal);
            setData(response.data);
        } catch (err: any) {
            if (err.name === "CanceledError" || err.name === "AbortError") return ;
            showSnackbar(err.response.data.error ?? "Müşteriler listesini çekerken bilinmedik bir hata oluştu", "error")
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
        {
            field: 'customerType', headerName: 'Müşteri Tipi', flex: 1, resizable: false, minWidth: 200,
            valueGetter: (_, row: Customer) => convertCustomerType(row.customerType),
            renderCell: (params) => (
                <div>
                    <CustomerTypeBadge name={params.row.customerType} nameLocalized={convertCustomerType(params.row.customerType)}/>
                </div>
            )
        },
        {
            field: 'serviceProviders', headerName: 'Kayıtlı firma ', flex: 1, resizable: false, minWidth: 200,
            valueGetter: (_, row: Customer) => getCompanyName(row.serviceProviders),
            renderCell: (params) => (
                <div>
                    {params.value.split(', ').map((name: string, index: number) => (
                        <div key={index}>{name}</div>
                    ))}
                </div>
            ),
        },
        {field: 'phone', headerName: 'Telefon', flex: 1, resizable: false, minWidth: 200},
        {field: 'email', headerName: 'Email', flex: 1, resizable: false, minWidth: 200},
        {field: 'address', headerName: 'Adres', flex: 1, resizable: false, minWidth: 200},
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
                            onClick: (row) => navigate(`/customers/${row.id}/edit`),
                        },
                        {
                            label: 'Sil',
                            icon: <Delete fontSize="small"/>,
                            onClick: (row: Customer) => handleDeleteDialog(row),
                            color: 'error.main',
                        },
                    ]}
                />
            )
        },
    ];

    const filteredData = useMemo(() => {
        if (!search.trim()) return data || [];

        return data.filter((row: Customer) =>
            row?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
            row?.phone?.toLowerCase().includes(search.toLowerCase()) ||
            row?.email?.toLowerCase().includes(search.toLowerCase()) ||
            convertCustomerType(row.customerType)?.toLowerCase().includes(search.toLowerCase()) ||
            row?.address?.toLowerCase().includes(search.toLowerCase()) ||
            row?.serviceProviders && getCompanyName(row.serviceProviders).toLowerCase().includes(search.toLowerCase())
        )
    }, [search, data])

    const paginationModel = {page: 0, pageSize: 10};

    return (
        <div>
            <Typography variant="h5" fontWeight="bold" color="textPrimary" sx={{py: {sm: 3, xs: 2, xl: 3}}}>
                Müşteriler
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
                    <Button startIcon={<Add/>} variant="contained" onClick={() => navigate(`/customers/create`)}>Müşteri oluştur</Button>
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
                <DialogTitle>Müşteri sil</DialogTitle>
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
                    <span className="font-bold">{deleteCustomer?.fullName}</span> isimli müşteriyi silinecek.<br/>
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