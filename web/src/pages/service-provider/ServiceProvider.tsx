import {Box, Button, Paper, Typography} from "@mui/material";
import {DataGrid, type GridColDef} from "@mui/x-data-grid";
import {useEffect, useMemo, useState} from "react";
import {serviceProviderService} from "@stf/features/service-provider/services/service-provider.service";
import {Add, Delete, Edit} from "@mui/icons-material";
import ActionMenu from "../../compnents/common/ActionMenu";
import {useNavigate} from "react-router";
import SearchTextField from "../../compnents/common/SearchTextField";
import {type ServiceProviderList} from "@sts/types/service-provider.types";
// import {AxiosResponse} from "axios";

export default function ServiceProviderPage() {
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<ServiceProviderList[]>([]);
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
            const response = await serviceProviderService.getAllServices();
            console.log("response", response.data);
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
    }, [])
    const columns: GridColDef[] = [
        {field: 'companyName', headerName: 'Firma Adı', flex: 1, resizable: false, minWidth: 200},
        {field: 'phone', headerName: 'Telefon', flex: 1, resizable: false, minWidth: 200},
        {field: 'email', headerName: 'Email', flex: 1, resizable: false, minWidth: 200},
        {field: 'taxNumber', headerName: 'Vergi Numarası', flex: 1, resizable: false, minWidth: 200},
        {
            field: 'createdBy', headerName: 'Oluşturan', flex: 1, resizable: false, minWidth: 200,
            valueGetter: (_, row: ServiceProviderList) => `${row.createdBy.fullName || ''}`,
        },
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
                            onClick: (row) => navigate(`/service-providers/${row.id}/edit`),
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

        return data.filter((row: any) =>
            row?.companyName?.toLowerCase().includes(search.toLowerCase()) ||
            row?.phone?.toLowerCase().includes(search.toLowerCase()) ||
            row?.email?.toLowerCase().includes(search.toLowerCase()) ||
            row?.taxNumber?.toLowerCase().includes(search.toLowerCase()) ||
            row?.createdBy?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
            row?.address?.toLowerCase().includes(search.toLowerCase())
        )
    }, [search, data])

    const paginationModel = {page: 0, pageSize: 5};

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
                    <Button startIcon={<Add/>} variant="contained">Yeni Firma oluştur</Button>
                </Box>
                <DataGrid
                    rows={filteredData}
                    columns={columns}
                    loading={loading}
                    initialState={{pagination: {paginationModel}}}
                    disableRowSelectionOnClick={true}
                    pageSizeOptions={[5, 10]}
                    sx={{border: 0, px: 1}}
                />
            </Paper>
        </div>
    )
}