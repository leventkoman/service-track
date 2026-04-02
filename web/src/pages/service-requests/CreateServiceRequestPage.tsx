import {
    createServiceRequestSchema,
    type CreateServiceRequestValues, serviceRequestResponseSchema
} from "@stf/features/service-request/schemas/create-service-request.schema";
import {useSnackbar} from "../../context/SnackbarContext";
import {useNavigate, useParams} from "react-router";
import {useEffect, useRef, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {serviceRequestService} from "@stf/features/service-request/services/service-request.service";
import FormSkeleton from "../../compnents/common/skletons/FormSkeleton";
import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography
} from "@mui/material";
import {ArrowBack, CheckBox, CheckBoxOutlineBlank} from "@mui/icons-material";
import Divider from "@mui/material/Divider";
import {
    ServiceRequestStatusService
} from "@stf/features/service-request-status/services/service-request-status.service";
import {type UserProfileForServiceRequest} from "@sts/types/user-profile.types";
import ListItemText from "@mui/material/ListItemText";
import {UserService} from "@stf/features/users/services/user.service";
import {CustomerService} from "@stf/features/customers/services/customer.service";
import type {ServiceProviderForMinimal} from "@sts/types/service-provider.types";
import {serviceProviderService} from "@stf/features/service-provider/services/service-provider.service";
import type {LoginUser} from "@sts/models/login-user";

export default function CreateServiceRequestPage() {
    const defaultValues: CreateServiceRequestValues = {
        id: null,
        serviceProviderId: '',
        problem: '',
        serviceRequestStatusId: '',
        customerId: '',
        employeeIds: []
    };
    const { showSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [displayedValues, setDisplayedValues] = useState({
        customerName: '',
        serviceProviderName: '',
    });
    const [serviceRequestStatus, setServiceRequestStatus] = useState<any[] | null>(null);
    const [employees, setEmployees] = useState<UserProfileForServiceRequest[]>([]);
    const [customers, setCustomers] = useState<UserProfileForServiceRequest[]>([]);
    const controllerRef = useRef<AbortController | null>(null);
    const params = useParams<{serviceRequestId: string}>();
    const serviceRequestId = params.serviceRequestId;
    const [loading, setLoading] = useState<boolean>(false);
    const [serviceProvider, setServiceProvider] = useState<ServiceProviderForMinimal | null>(null);
    const { control, handleSubmit, formState, reset, setValue } = useForm<CreateServiceRequestValues>({
        resolver: zodResolver(createServiceRequestSchema),
        defaultValues,
        mode: "onChange"
    });
    
    const getServiceRequestStatus = async () => {
        const controller = new AbortController();
        controllerRef.current = controller;
        setLoading(true);
        try {
            const res = await ServiceRequestStatusService.getAllStatuses(controller.signal);
            setServiceRequestStatus(res.data);
            
            if (!serviceRequestId) {
                const pending = res.data?.find((n: any) => n.name === 'pending');
                console.log(pending);
                if (pending) {
                    setValue('serviceRequestStatusId', pending.id)
                }
            }
        } catch (err: any) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const getEmployees = async () => {
        const controller = new AbortController();
        controllerRef.current = controller;
        setLoading(true);
        try {
            const res = await UserService.getActiveUsers(controller.signal);
            setEmployees(res.data);
        } catch (err: any) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }
    
    const getServiceProviderById = async () => {
        if (serviceRequestId) return;
        const userJson = localStorage.getItem('user');
        if (!userJson) {
            return;
        }
        const user: LoginUser = JSON.parse(userJson);
        const controller = new AbortController();
        controllerRef.current = controller;
        setLoading(true);
        try {
            const res = await serviceProviderService.getAllServiceProviderById(user?.serviceProviderId , controller.signal);
            setValue('serviceProviderId', res.data.id)
            setServiceProvider(res.data);
        } catch (err: any) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const getCustomers = async () => {
        const controller = new AbortController();
        controllerRef.current = controller;
        setLoading(true);
        try {
            const res = await CustomerService.getCustomers(controller.signal);
            setCustomers(res.data);
        } catch (err: any) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const fetchData = async () => {
        if (!serviceRequestId) return;

        setLoading(true);
        const controller = new AbortController();
        controllerRef.current = controller;

        try {
            const response = await serviceRequestService.getServiceRequestsById(serviceRequestId, controller.signal);
            const result = serviceRequestResponseSchema.safeParse(response.data);
            reset(result.data);
            setDisplayedValues({
                customerName: response.data.customer.fullName,
                serviceProviderName: response.data.serviceProvider.companyName,
            })
        } catch (err: any) {
            if (err.name === "CanceledError" || err.name === "AbortError") return;
            showSnackbar(err.response?.data?.error ?? 'Oppss! Birşeyler test gitti.', 'error')
        } finally {
            setLoading(false);
        }
    }

    const onSubmit = async (values: CreateServiceRequestValues) => {
        const controller = new AbortController();
        controllerRef.current = controller;
        console.log(values);
        try {
            serviceRequestId
                ? await serviceRequestService.updateServiceRequests(values, controller.signal)
                : await serviceRequestService.createServiceRequests(values, controller.signal);

            showSnackbar('Servis kaydı başarılı bir şekilde oluşturuldu.');
        } catch (err: any) {
            if (err.name === "CanceledError" || err.name === "AbortError") return ;
            showSnackbar(err.response.data.error ?? "Servis kaydı oluşturulurken bir şeyler ters gitti.", "error")
        } finally {
            navigate("/service-requests");
        }
    }

    useEffect(() => {
        (async () => {
            await Promise.all([getServiceProviderById(), fetchData(), getServiceRequestStatus(), getCustomers(), getEmployees()])
        })();
        
        return () => {
            controllerRef.current?.abort()
        }
    }, [serviceRequestId]);
    
    return (
        <>
            {loading
                ?  <FormSkeleton/>
                :
                <Box sx={{
                    flexWrap: 'wrap',
                    py: {sm: 3, xs: 2, xl: 3},
                    px: 0
                }}>
                    <Typography variant="h5" display="flex"  fontWeight="bold">
                        {serviceRequestId ? 'Servis kaydı düzenle' : 'Servis kaydı oluştur'}
                    </Typography>
                    <Box
                        sx={{
                            flex:"wrap",
                            display:"flex",
                            alignItems:"center",
                            gap:1,
                            py:3
                        }}
                    >
                        <ArrowBack onClick={() => navigate('/service-requests')} cursor="pointer"/>
                        <Typography variant="body1" display="flex" justifyContent="center" alignItems="center" fontWeight="bold">
                            Geri
                        </Typography>
                    </Box>
                    <Paper
                        component="form"
                        onSubmit={handleSubmit(onSubmit)}
                        sx={{
                            height: 'auto',
                            width: "auto",
                            py: 4,
                            px: {xs: 4, lg:8}
                        }}
                    >
                        <Typography
                            variant="body1"
                            fontWeight="bold"
                            sx={{py: 3}}
                        >
                            İletişim Bilgileri
                        </Typography>
                        <Box
                            sx={{
                                py:2,
                                display:"flex",
                                flexDirection: { xs: "column", lg: "row" },
                                alignItems:"stretch",
                                width:"100%",
                                gap:{xs: 4, lg:8}
                            }}
                        >
                            <Controller
                                name="customerId"
                                control={control}
                                render={({field, fieldState}) => (
                                    
                                    <FormControl fullWidth error={fieldState.invalid}>
                                        <InputLabel id="status-label">Müşteriler</InputLabel>
                                        <Select
                                            {...field}
                                            labelId="status-label"
                                            value={field.value ?? ''}
                                            label="Müşteriler"
                                        >
                                            {customers?.map((item) => (
                                                <MenuItem key={item.id} value={item.id}>{item.fullName}</MenuItem>
                                            ))}
                                        </Select>
                                        {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
                                    </FormControl>
                                )}
                            />

                            <Controller
                                name="serviceProviderId"
                                control={control}
                                render={({field, fieldState}) => (
                                    <TextField
                                        {...field}
                                        value={serviceRequestId ? (displayedValues.serviceProviderName ?? '') : (serviceProvider?.companyName ?? '')}
                                        slotProps={{inputLabel: {required: true}}}
                                        error={fieldState.invalid}
                                        helperText={fieldState.error?.message}
                                        fullWidth
                                        id="demo-helper-text-aligned-no-helper"
                                        label="Firma ismi"
                                        placeholder="Firma ismi"
                                        disabled
                                    />
                                )}
                            />
                        </Box>

                        <Box
                            sx={{
                                py:2,
                                width:"100%",
                            }}
                        >
                            <Controller
                                name="problem"
                                control={control}
                                render={({field, fieldState}) => (
                                    <TextField
                                        {...field}
                                        value={field.value ?? ''}
                                        slotProps={{inputLabel: {required: true}}}
                                        error={fieldState.invalid}
                                        helperText={fieldState.error?.message}
                                        fullWidth
                                        multiline
                                        rows={4}
                                        id="demo-helper-text-aligned-no-helper"
                                        label="Açıklama"
                                        placeholder="Kullanıcı için açıklama ekleyebilirsiniz."
                                    />
                                )}
                            />
                        </Box>
                        
                        <Box
                            sx={{
                                py:2,
                                display:"flex",
                                flexDirection: { xs: "column", lg: "row" },
                                alignItems:"stretch",
                                width:"100%",
                                gap:{xs: 4, lg:8}
                            }}
                        >
                            
                            <Controller
                                name="serviceRequestStatusId"
                                control={control}
                                render={({field, fieldState}) => (
                                    <FormControl fullWidth error={fieldState.invalid}>
                                        <InputLabel id="status-label">Servis kaydı durumu</InputLabel>
                                        <Select
                                            {...field}
                                            labelId="status-label"
                                            value={field.value ?? ''}
                                            label="Servis kaydı durumu"
                                            disabled={!serviceRequestId}
                                        >
                                            {serviceRequestStatus?.map((item) => (
                                                <MenuItem key={item.id} value={item.id}>{item.nameLocalized}</MenuItem>
                                            ))}
                                        </Select>
                                        {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
                                    </FormControl>
                                )}
                            />
                            <Controller
                                name="employeeIds"
                                control={control}
                                render={({field, fieldState}) => (
                                    <FormControl fullWidth error={fieldState.invalid}>
                                        <InputLabel id="employee-label">Çalışanlar</InputLabel>
                                        <Select
                                            {...field}
                                            value={field.value ?? []}
                                            multiple
                                            renderValue={(selected) =>
                                                employees
                                                    ?.filter(e => selected.includes(e.id))
                                                    .map(e => e.fullName)
                                                    .join(', ')
                                            }
                                            labelId="employee-label"
                                            label="Çalışanlar"
                                            // disabled={!serviceRequestId}
                                            // onChange={handleChange}
                                        >
                                            {employees?.map((item) => {
                                                const selected = field.value.includes(item.id);
                                                const SelectionIcon = selected ? CheckBox : CheckBoxOutlineBlank;

                                                return (
                                                    <MenuItem key={item.id} value={item.id}>
                                                        <SelectionIcon
                                                            fontSize="small"
                                                            style={{ marginRight: 8, padding: 9, boxSizing: 'content-box' }}
                                                        />
                                                        <ListItemText primary={item.fullName} />
                                                    </MenuItem>
                                                );
                                            })}
                                        </Select>
                                        {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
                                    </FormControl>
                                )}
                            />
                        </Box>
                        <Divider sx={{py:2}} />
                        <Box
                            sx={{
                                pt:4,
                                pb:0,
                                width:"100%",
                                display:"flex",
                                alignItems:"stretch",
                                justifyContent:"flex-end",
                                gap: 4
                            }}
                        >
                            <Button
                                variant="outlined"
                                onClick={() => navigate('/service-request')}
                            >
                                İptal
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                loading={formState.isSubmitting || loading}
                                disableRipple={true}
                                loadingPosition="start"
                                // startIcon={<Save/>}
                                disabled={formState.isSubmitting || !formState.isValid}
                            >
                                {serviceRequestId ? 'Düzenle' : 'Kaydet'}
                            </Button>
                        </Box>
                    </Paper>
                </Box>
            }
        </>
    )
}