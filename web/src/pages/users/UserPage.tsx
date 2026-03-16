import {useEffect, useMemo, useState} from "react";
import {useNavigate} from "react-router";
import {DataGrid, type GridColDef} from "@mui/x-data-grid";
import ActionMenu from "../../compnents/common/ActionMenu";
import {Add, Delete, Edit} from "@mui/icons-material";
import {Box, Button, Paper, Typography} from "@mui/material";
import SearchTextField from "../../compnents/common/SearchTextField";
import {UserService} from "@stf/features/users/services/user.service";
import type {UserProfile} from "@sts/models/user-profile";
import {getRoles} from "@stf/lib/utils";

export default function UserPage() {
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<UserProfile[]>([]);
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
            const response = await UserService.getAllUsers();
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

    const columns: GridColDef[] = [
        {field: 'fullName', headerName: 'Ad soyad', flex: 1, resizable: false, minWidth: 200},
        {
            field: 'roles', headerName: 'Roller', flex: 1, resizable: false, minWidth: 200,
            valueGetter: (_, row: UserProfile) => getRoles(row.roles),
        },
        {field: 'phone', headerName: 'Telefon', flex: 1, resizable: false, minWidth: 200},
        {field: 'email', headerName: 'Email', flex: 1, resizable: false, minWidth: 200},
        {field: 'address', headerName: 'Adres', flex: 1, resizable: false, minWidth: 200},
        {field: 'title', headerName: 'Unvan', flex: 1, resizable: false, minWidth: 200},
        {field: 'description', headerName: 'Açıklama', flex: 1, resizable: false, minWidth: 200},
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
                            onClick: (row) => navigate(`/users/${row.id}/edit`),
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

        return data.filter((row: UserProfile) =>
                row?.fullName?.toLowerCase().trim().includes(search.toLowerCase()) ||
                row?.phone?.toLowerCase().trim().includes(search.toLowerCase()) ||
                row?.email?.toLowerCase().trim().includes(search.toLowerCase()) ||
                row?.address?.toLowerCase().trim().includes(search.toLowerCase()) ||
                row?.title?.toLowerCase().trim().includes(search.toLowerCase()) ||
                row?.description?.toLowerCase().trim().includes(search.toLowerCase()) ||
                row?.roles && getRoles(row.roles).toLowerCase().trim().includes(search.toLowerCase())
        )
    }, [search, data])

    const paginationModel = {page: 0, pageSize: 10};

    return (
        <div>
            <Typography variant="h5" fontWeight="bold" color="textPrimary" sx={{py: {sm: 3, xs: 2, xl: 3}}}>
                Kullanıcılar
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
                    <Button startIcon={<Add/>} variant="contained">Kullanıcı oluştur</Button>
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