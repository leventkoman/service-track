import {useEffect, useMemo, useRef, useState} from "react";
import {DataGrid, type GridColDef} from "@mui/x-data-grid";
import ActionMenu from "../../compnents/common/ActionMenu";
import {Close, PublishedWithChanges} from "@mui/icons-material";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, FormControl, FormControlLabel,
    IconButton,
    Paper, Radio, RadioGroup,
    Typography
} from "@mui/material";
import SearchTextField from "../../compnents/common/SearchTextField";
import {formatDateTimeToDMYHM} from "@stf/lib/utils";
import {useSnackbar} from "../../context/SnackbarContext";
import StatusBadge from "../../compnents/common/StatusBadge";
import type {Subscription} from "@sts/models/subscription.model";
import {SubscriptionService} from "@stf/features/subscriptions/services/subscription.service";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    changeSubscriptionSchema,
    type ChangeSubscriptionValue
} from "@stf/features/subscriptions/schemas/change-subscription.schema";

export default function SubscriptionsPage() {
    const {showSnackbar} = useSnackbar();
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<Subscription[]>([]);
    const [search, setSearch] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    // const [formValue, setFormValue] = useState<ChangeSubscriptionValue>({id: '', planType: ''});
    const controllerRef = useRef<AbortController | null>(null);
    const {control, handleSubmit, reset} = useForm<ChangeSubscriptionValue>({
        resolver: zodResolver(changeSubscriptionSchema),
        defaultValues: {
            id: '',
            planType: ''
        },
        mode: "onChange",
        
    })

    const fetchData = async () => {
        const controller = new AbortController();
        controllerRef.current = controller;
        setLoading(true);
        try {
            const response = await SubscriptionService.getAllSubscriptions(controller.signal);
            setData(response.data);
        } catch (err: any) {
            if (err.name === "CanceledError" || err.name === "AbortError") return;
            showSnackbar(err.response.data.error ?? "Üyeleri listelerken bir hata oluştu.", "error")
        } finally {
            setLoading(false);
        }
    }
    
    const changeSubscriptionDialog = (data: Subscription) => {
        const value = {
            id: data.id,
            planType: data.subscriptionPlan.planType
        }
        reset(value);
        // setFormValue(value);
        setOpenDialog(true);
    }

    const onSubmit = async (values: ChangeSubscriptionValue) => {
        const controller = new AbortController();
        controllerRef.current = controller;
        setLoading(true);
        try {
            await SubscriptionService.changePlanType(values, controller.signal)
            showSnackbar('Üyelik başarılı bir şekilde değiştirildi.');
            await fetchData();
        } catch (err: any) {
            if (err.name === "CanceledError" || err.name === "AbortError") return ;
            showSnackbar(err.response.data.error ?? "Üyelik tipi değiştirilirken bir şeyler ters gitti.", "error")
        } finally {
            setLoading(false);
            setOpenDialog(false);
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
        {
            field: 'companyName', headerName: 'Firma', flex: 1, resizable: false, minWidth: 200,
            valueGetter: (_, row: Subscription) => `${row.serviceProvider.companyName}`,
        },
        {
            field: 'phone', headerName: 'Telefon', flex: 1, resizable: false, minWidth: 200,
            valueGetter: (_, row: Subscription) => `${row.serviceProvider.phone}`,
        },
        {
            field: 'email', headerName: 'Email', flex: 1, resizable: false, minWidth: 200,
            valueGetter: (_, row: Subscription) => `${row.serviceProvider.email}`,
        },
        {
            field: 'name', headerName: 'Üyelik', flex: 1, resizable: false, minWidth: 200,
            valueGetter: (_, row: Subscription) => `${row.subscriptionPlan.name}`,
        },
        {
            field: 'startDate', headerName: 'Başlama tarihi', flex: 1, resizable: false, minWidth: 200,
            valueGetter: (_, row: Subscription) => formatDateTimeToDMYHM(row.startDate)
        },
        {
            field: 'endDate', headerName: 'Bitiş tarihi', flex: 1, resizable: false, minWidth: 200,
            valueGetter: (_, row: Subscription) => formatDateTimeToDMYHM(row?.endDate)
        },
        {
            field: 'isActive',
            headerName: 'Durumu',
            flex: 1,
            resizable: false,
            minWidth: 200,
            headerAlign: "center",
            align: "center",
            valueGetter: (_, row: Subscription) => `${row.isActive}`,
            renderCell: (params) => (
                <div>
                    <StatusBadge name={params.row.isActive ? 'active' : 'pending'}
                                 nameLocalized={params.row.isActive ? 'Aktif' : 'Pasif'}/>
                </div>
            )
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
                            label: 'Üyelik değiştir',
                            icon: <PublishedWithChanges fontSize="small"/>,
                            onClick: (row: Subscription) => changeSubscriptionDialog(row),
                        },
                    ]}
                />
            )
        },
    ];

    const filteredData = useMemo(() => {
        if (!search.trim()) return data || [];

        return data.filter((row: Subscription) =>
            row?.serviceProvider?.companyName?.toLowerCase().trim().includes(search.toLowerCase()) ||
            row?.serviceProvider?.phone?.toLowerCase().trim().includes(search.toLowerCase()) ||
            row?.serviceProvider?.email?.toLowerCase().trim().includes(search.toLowerCase()) ||
            row?.subscriptionPlan?.name?.toLowerCase().trim().includes(search.toLowerCase()) ||
            row?.startDate && formatDateTimeToDMYHM(row.startDate)?.toLowerCase().trim().includes(search.toLowerCase()) ||
            row?.endDate && formatDateTimeToDMYHM(row?.endDate)?.toLowerCase().trim().includes(search.toLowerCase())
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
                Üyelikler
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

            <Dialog component="form" onSubmit={handleSubmit(onSubmit)} open={openDialog} fullWidth={true} maxWidth={'xs'}>
                <DialogTitle>Üyelik değiştir</DialogTitle>
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
                    <Controller
                        name="planType"
                        control={control}
                        render={({field}) => (
                            <FormControl>
                                {/*<FormLabel*/}
                                {/*    sx={{fontWeight: "bold", pb: 1, color: "black"}}*/}
                                {/*    required*/}
                                {/*    id="type-label"*/}
                                {/*    focused={false}*/}
                                {/*>*/}
                                {/*    Üyelik tipleri*/}
                                {/*</FormLabel>*/}
                                <RadioGroup
                                    row
                                    aria-labelledby="type-label"
                                    {...field}
                                >
                                    <Box sx={{
                                        display: "flex",
                                        flexDirection: 'column',
                                        alignItems: "start",
                                        justifyContent: "space-between",
                                    }}>
                                        <FormControlLabel value="unlimited" control={<Radio/>} label="Süresiz kullanım"/>
                                        <FormControlLabel value="freeTrial" control={<Radio/>} label="Ücretsiz deneme"/>
                                        <FormControlLabel value="monthly" control={<Radio/>} label="Aylık"/>
                                        <FormControlLabel value="yearly" control={<Radio/>} label="Yıllık"/>
                                    </Box>
                                </RadioGroup>
                            </FormControl>
                        )}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>İptal</Button>
                    <Button type="submit" variant="contained" >Kaydet</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}