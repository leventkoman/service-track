import {useEffect, useMemo, useState} from "react";
import {CustomerService} from "@stf/features/customers/services/customer.service";
import {type Customer} from "@sts/models/customer-response";
import {DataGrid, type GridColDef} from "@mui/x-data-grid";
import type {ServiceProviderForCustomer} from "@sts/types/service-provider.types";
import ActionMenu from "../../compnents/common/ActionMenu";
import {Add, Delete, Edit} from "@mui/icons-material";
import {Box, Button, Paper, Typography} from "@mui/material";
import SearchTextField from "../../compnents/common/SearchTextField";
import {useNavigate} from "react-router";
import {convertCustomerType} from "@stf/lib/utils";

export default function CustomerPage() {
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<Customer[]>([]);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const handleDelete = async (id: string) => {
        if (!id) return;
        // const response: AxiosResponse<string> = await serviceProviderService.deleteService(id);
        // console.log(response);
        // fetchData();
    }

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await CustomerService.getCustomers();
            setData(response.data);
            if (response.status === 200) {
                setLoading(false);
            }
        } catch (e) {
            setLoading(false);
            console.error(e);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const getCompanyNames = (serviceProviders: ServiceProviderForCustomer[]) =>
        serviceProviders.map(item => item.companyName).join(', ');

    const columns: GridColDef[] = [
        {field: 'fullName', headerName: 'Ad soyad', flex: 1, resizable: false, minWidth: 200},
        {
            field: 'customerType', headerName: 'Müşteri Tipi', flex: 1, resizable: false, minWidth: 200,
            valueGetter: (_, row: Customer) => convertCustomerType(row.customerType),
            renderCell: (params) => (
                <div>
                    {convertCustomerType(params.row.customerType)}
                </div>
            )
        },
        {field: 'phone', headerName: 'Telefon', flex: 1, resizable: false, minWidth: 200},
        {field: 'email', headerName: 'Email', flex: 1, resizable: false, minWidth: 200},
        {field: 'address', headerName: 'Adres', flex: 1, resizable: false, minWidth: 200},
        {
            field: 'serviceProviders', headerName: 'Kayıtlı firma ', flex: 1, resizable: false, minWidth: 200,
            valueGetter: (_, row: Customer) => getCompanyNames(row.serviceProviders),
            renderCell: (params) => (
                <div>
                    {params.value.split(', ').map((name: string, index: number) => (
                        <div key={index}>{name}</div>
                    ))}
                </div>
            ),
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
                            onClick: (row) => navigate(`/customers/${row.id}/edit`),
                        },
                        {
                            label: 'Sil',
                            icon: <Delete fontSize="small"/>,
                            onClick: (row) => handleDelete(row.id),
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
            row?.serviceProviders && getCompanyNames(row.serviceProviders).toLowerCase().includes(search.toLowerCase())
        )
    }, [search, data])

    const paginationModel = {page: 0, pageSize: 5};

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
                    <Button startIcon={<Add/>} variant="contained">Müşteri oluştur</Button>
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
        </div>
    )
}