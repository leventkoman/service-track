import {
    createServiceRequestSchema,
    type CreateServiceRequestValues, serviceRequestResponseSchema
} from "@stf/features/service-request/schemas/create-service-request.schema";
import {useSnackbar} from "../../context/SnackbarContext";
import {useNavigate, useParams} from "react-router";
import { useEffect, useRef, useState} from "react";
import {Controller, useFieldArray, useForm, useWatch} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {serviceRequestService} from "@stf/features/service-request/services/service-request.service";
import FormSkeleton from "../../compnents/common/skletons/FormSkeleton";
import {
    Box,
    Button,
    FormControl,
    FormHelperText, IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography
} from "@mui/material";
import {Add, ArrowBack, CheckBox, CheckBoxOutlineBlank, Delete} from "@mui/icons-material";
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
import type {Units} from "@sts/models/units.model";
import {UnitService} from "@stf/features/units/services/unit.service";
import type {VatRates} from "@sts/models/vat-rates.model";
import {VatRateService} from "@stf/features/vat-rate/services/vat-rate.service";
import {ServiceRequestStatus} from "api/src/enums/service-request-status.enum";

export default function CreateServiceRequestPage() {
    const defaultValues: CreateServiceRequestValues = {
        id: null,
        serviceProviderId: '',
        problem: '',
        serviceRequestStatusId: '',
        customerId: '',
        employeeIds: [],
        totalAmount: null,
        solution: null
    };
    const {showSnackbar} = useSnackbar();
    const navigate = useNavigate();
    const [displayedValues, setDisplayedValues] = useState({
        customerName: '',
        serviceProviderName: '',
        items: []
    });
    const [serviceRequestStatus, setServiceRequestStatus] = useState<any[] | null>(null);
    const [employees, setEmployees] = useState<UserProfileForServiceRequest[]>([]);
    const [customers, setCustomers] = useState<UserProfileForServiceRequest[]>([]);
    const [units, setUnits] = useState<Units[]>([]);
    const [vatRates, setVatRates] = useState<VatRates[]>([]);
    const controllerRef = useRef<AbortController | null>(null);
    const params = useParams<{ serviceRequestId: string }>();
    const serviceRequestId = params.serviceRequestId;
    const [loading, setLoading] = useState<boolean>(false);
    const [serviceProvider, setServiceProvider] = useState<ServiceProviderForMinimal | null>(null);
    const {control, handleSubmit, formState, reset, setValue} = useForm<CreateServiceRequestValues>({
        resolver: zodResolver(createServiceRequestSchema),
        defaultValues,
        mode: "onChange"
    });
    const {fields, append, remove} = useFieldArray({
        control,
        name: 'items'
    });

    const requestStatus = useWatch({control, name: 'serviceRequestStatusId'});
    const isDone = serviceRequestStatus?.find(s => s.id === requestStatus)?.name === ServiceRequestStatus.Done;

    const items = useWatch({control, name: 'items'});
    const calculateLine = (item: any, vatRates?: any[]) => {
        const unitTotal = (item?.unitPrice || 0) * (item?.quantity || 0);

        const vatRate: any = vatRates?.find(v => v.id === item?.vatRateId)?.rate || 0;

        const vatAmount: any = unitTotal * Number(vatRate) / 100;

        const total: any = unitTotal + vatAmount;

        return {
            unitTotal,
            vatAmount,
            total
        };
    };

    const vatTotal = (items || []).reduce(
        (sum, item) => sum + calculateLine(item, vatRates).vatAmount,
        0
    );

    const totalUnitPrice = (items || []).reduce(
        (sum, item) => sum + calculateLine(item, vatRates).unitTotal,
        0
    );
    
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

    const getUnits = async () => {
        if (!serviceRequestId) return;

        const controller = new AbortController();
        controllerRef.current = controller;
        setLoading(true);
        try {
            const res = await UnitService.getAll(controller.signal);
            setUnits(res.data);
        } catch (err: any) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const getVatRates = async () => {
        if (!serviceRequestId) return;

        const controller = new AbortController();
        controllerRef.current = controller;
        setLoading(true);
        try {
            const res = await VatRateService.getAll(controller.signal);
            setVatRates(res.data);
        } catch (err: any) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const getServiceProviderById = async () => {
        // if (serviceRequestId) return;
        const userJson = localStorage.getItem('user');
        if (!userJson) {
            return;
        }
        const user: LoginUser = JSON.parse(userJson);
        const controller = new AbortController();
        controllerRef.current = controller;
        setLoading(true);
        try {
            const res = await serviceProviderService.getAllServiceProviderById(user?.serviceProviderId, controller.signal);
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
                items: []
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
        items?.map((item: any) => {
            console.log("lineTotal", calculateLine(item, vatRates).unitTotal);
        })
        try {
            if (serviceRequestId) {
                const serviceItems = items?.map(item => {
                    return {
                        ...item,
                        lineTotal: calculateLine(item, vatRates).total.toFixed(2),
                        vatRatePrice: calculateLine(item, vatRates).vatAmount.toFixed(2),
                        unitPrice: Number(item.unitPrice).toFixed(2),
                        itemPrice: calculateLine(item, vatRates).unitTotal.toFixed(2),
                    };
                });

                values = {
                    ...values,
                    totalAmount: (vatTotal + totalUnitPrice) > 0 ? (vatTotal + totalUnitPrice) : null,
                    items: serviceItems ?? []
                };
                console.log(values);
                await serviceRequestService.updateServiceRequests(values, controller.signal)
            } else {
                await serviceRequestService.createServiceRequests(values, controller.signal)
            }

            showSnackbar('Servis kaydı başarılı bir şekilde oluşturuldu.');
        } catch (err: any) {
            if (err.name === "CanceledError" || err.name === "AbortError") return;
            showSnackbar(err.response.data.error ?? "Servis kaydı oluşturulurken bir şeyler ters gitti.", "error")
        } finally {
            navigate("/service-requests");
        }
    }

    useEffect(() => {
        (async () => {
            await Promise.all([getServiceProviderById(), fetchData(), getServiceRequestStatus(), getCustomers(), getEmployees(), getUnits(), getVatRates()])
        })();

        return () => {
            controllerRef.current?.abort()
        }
    }, [serviceRequestId]);

    return (
        <>
            {loading
                ? <FormSkeleton/>
                :
                <Box sx={{
                    flexWrap: 'wrap',
                    py: {sm: 3, xs: 2, xl: 3},
                    px: 0
                }}>
                    <Typography variant="h5" display="flex" fontWeight="bold">
                        {serviceRequestId ? 'Servis kaydı düzenle' : 'Servis kaydı oluştur'}
                    </Typography>
                    <Box
                        sx={{
                            flex: "wrap",
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            py: 3
                        }}
                    >
                        <ArrowBack onClick={() => navigate('/service-requests')} cursor="pointer"/>
                        <Typography variant="body1" display="flex" justifyContent="center" alignItems="center"
                                    fontWeight="bold">
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
                            px: {xs: 4, lg: 8}
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
                                py: 2,
                                display: "flex",
                                flexDirection: {xs: "column", lg: "row"},
                                alignItems: "stretch",
                                width: "100%",
                                gap: {xs: 4, lg: 8}
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
                                        {fieldState.error &&
                                            <FormHelperText>{fieldState.error.message}</FormHelperText>}
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
                                py: 2,
                                width: "100%",
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
                                py: 2,
                                display: "flex",
                                flexDirection: {xs: "column", lg: "row"},
                                alignItems: "stretch",
                                width: "100%",
                                gap: {xs: 4, lg: 8}
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
                                        {fieldState.error &&
                                            <FormHelperText>{fieldState.error.message}</FormHelperText>}
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
                                                            style={{
                                                                marginRight: 8,
                                                                padding: 9,
                                                                boxSizing: 'content-box'
                                                            }}
                                                        />
                                                        <ListItemText primary={item.fullName}/>
                                                    </MenuItem>
                                                );
                                            })}
                                        </Select>
                                        {fieldState.error &&
                                            <FormHelperText>{fieldState.error.message}</FormHelperText>}
                                    </FormControl>
                                )}
                            />
                        </Box>

                        {
                            isDone && (
                                <>
                                    <Box
                                        sx={{
                                            py: 2,
                                            width: "100%",
                                        }}
                                    >
                                        <Controller
                                            name="solution"
                                            control={control}
                                            render={({field, fieldState}) => (
                                                <TextField
                                                    {...field}
                                                    value={field?.value ?? ''}
                                                    slotProps={{inputLabel: {required: true}}}
                                                    error={fieldState.invalid}
                                                    helperText={fieldState.error?.message}
                                                    fullWidth
                                                    multiline
                                                    rows={4}
                                                    label="Çözüm"
                                                    placeholder="Bu servis kaydı için uygulanan çözümleri belirtiniz."
                                                />
                                            )}
                                        />
                                    </Box>
                                    <Divider sx={{py: 2}}/>

                                    <Typography variant="body1" fontWeight="bold" sx={{py: 3}}>
                                        Servis Kaydı hizmetleri
                                    </Typography>

                                    {fields.map((field, index) => {
                                        const item = items?.[index];
                                        const line = calculateLine(item, vatRates);
                                        return (

                                            <Box
                                                key={field.id}
                                                sx={{
                                                    py: 1,
                                                    display: 'flex',
                                                    flexDirection: {xs: 'column', lg: 'row'},
                                                    alignItems: 'center',
                                                    gap: 2,
                                                }}
                                            >
                                                <Controller
                                                    name={`items.${index}.itemName`}
                                                    control={control}
                                                    render={({field, fieldState}) => (
                                                        <TextField
                                                            {...field}
                                                            label="Mal/hizmet"
                                                            error={fieldState.invalid}
                                                            helperText={fieldState.error?.message}
                                                            sx={{width: {xs: '100%', lg: 300}}}
                                                            slotProps={{inputLabel: {required: true}}}
                                                        />
                                                    )}
                                                />
                                                <Controller
                                                    name={`items.${index}.quantity`}
                                                    control={control}
                                                    render={({field, fieldState}) => (
                                                        <TextField
                                                            {...field}
                                                            onChange={(e) => field.onChange(e.target.value)}
                                                            label="Miktar"
                                                            type="number"
                                                            error={fieldState.invalid}
                                                            helperText={fieldState.error?.message}
                                                            sx={{width: {xs: '100%', lg: 80}}}
                                                            slotProps={{inputLabel: {required: true}}}
                                                        />
                                                    )}
                                                />
                                                <Controller
                                                    name={`items.${index}.unitId`}
                                                    control={control}
                                                    render={({field, fieldState}) => (
                                                        <FormControl
                                                            required={true}
                                                            sx={{width: {xs: '100%', lg: 150}}}
                                                            error={fieldState.invalid}>
                                                            <InputLabel id="unit-label">Birim</InputLabel>
                                                            <Select
                                                                {...field}
                                                                labelId="unit-label"
                                                                value={field.value ?? ''}
                                                                label="Birim"
                                                            >
                                                                {units?.map((item) => (
                                                                    <MenuItem key={item.id}
                                                                              value={item.id}>{item.name}</MenuItem>
                                                                ))}
                                                            </Select>
                                                            {fieldState.error &&
                                                                <FormHelperText>{fieldState.error.message}</FormHelperText>}
                                                        </FormControl>
                                                    )}
                                                />
                                                <Controller
                                                    name={`items.${index}.unitPrice`}
                                                    control={control}
                                                    render={({field, fieldState}) => (
                                                        <TextField
                                                            {...field}
                                                            onChange={(e) => field.onChange(e.target.value)}
                                                            label="Birim fiyat"
                                                            type="number"
                                                            error={fieldState.invalid}
                                                            helperText={fieldState.error?.message}
                                                            sx={{width: {xs: '100%', lg: 100}}}
                                                            slotProps={{inputLabel: {required: true}}}
                                                        />
                                                    )}
                                                />
                                                <TextField
                                                    value={line.unitTotal.toFixed(2)}
                                                    label="Mal/hizmet tutarı"
                                                    type="number"
                                                    sx={{width: {xs: '100%', lg: 150}}}
                                                    variant="standard"
                                                    disabled
                                                />
                                                <Controller
                                                    name={`items.${index}.vatRateId`}
                                                    control={control}
                                                    render={({field, fieldState}) => (
                                                        <FormControl
                                                            required={true}
                                                            sx={{width: {xs: '100%', lg: 100}}}
                                                            error={fieldState.invalid}>
                                                            <InputLabel id="rate-label">Kdv</InputLabel>
                                                            <Select
                                                                {...field}
                                                                labelId="rate-label"
                                                                value={field.value ?? ''}
                                                                label="Kdv"
                                                            >
                                                                {vatRates?.map((item) => (
                                                                    <MenuItem key={item.id}
                                                                              value={item.id}>{item.name}</MenuItem>
                                                                ))}
                                                            </Select>
                                                            {fieldState.error &&
                                                                <FormHelperText>{fieldState.error.message}</FormHelperText>}
                                                        </FormControl>
                                                    )}
                                                />
                                                <TextField
                                                    value={line.vatAmount.toFixed(2)}
                                                    label="KDV tutarı"
                                                    type="number"
                                                    sx={{width: {xs: '100%', lg: 150}}}
                                                    variant="standard"
                                                    disabled
                                                />
                                                <TextField
                                                    name={`items.${index}.lineTotal`}
                                                    value={line.total.toFixed(2)}
                                                    label="Toplam"
                                                    type="number"
                                                    sx={{width: {xs: '100%', lg: 150}}}
                                                    variant="standard"
                                                    disabled
                                                />
                                                {/*<Controller*/}
                                                {/*    name={`items.${index}.lineTotal`}*/}
                                                {/*    control={control}*/}
                                                {/*    render={({field}) => (*/}
                                                {/*        <TextField*/}
                                                {/*            {...field}*/}
                                                {/*            value={field.value ?? line.total.toFixed(2)}*/}
                                                {/*            label="Toplam"*/}
                                                {/*            type="number"*/}
                                                {/*            sx={{width: {xs: '100%', lg: 150}}}*/}
                                                {/*            variant="standard"*/}
                                                {/*            disabled*/}
                                                {/*        />*/}
                                                {/*    )}*/}
                                                {/*/>*/}
                                                <IconButton onClick={() => remove(index)} color="error">
                                                    <Delete fontSize="small"/>
                                                </IconButton>
                                            </Box>
                                        )
                                    })}

                                    <Button
                                        startIcon={<Add/>}
                                        onClick={() => append({
                                            itemName: '',
                                            quantity: "1",
                                            unitPrice: "0",
                                            unitId: '',
                                            vatRateId: '',
                                            vatRatePrice: '0',
                                            itemPrice: '0',
                                            lineTotal: '0'
                                        })}
                                        sx={{mt: 2}}
                                    >
                                        Mal/hizmet ekle
                                    </Button>

                                    {fields.length > 0 && (
                                        <>
                                            <Divider sx={{py: 2}}/>
                                            <Typography
                                                variant="body1"
                                                fontWeight="bold"
                                                sx={{py: 3}}
                                            >
                                                Toplamlar
                                            </Typography>
                                            <Box
                                                sx={{
                                                    py: 1,
                                                    display: 'flex',
                                                    flexDirection: {xs: 'column', lg: 'row'},
                                                    alignItems: 'center',
                                                    justifyContent:'center',
                                                    gap: 2,
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        py: 1,
                                                        display: 'flex',
                                                        flexDirection: {xs: 'column', lg: 'column'},
                                                        alignItems: 'flex-end',
                                                        justifyContent: 'flex-end',
                                                        gap: 2,
                                                    }}
                                                >
                                                    <Typography variant="body1" fontWeight="bold">
                                                        Mal/Hizmet Toplam Tutarı
                                                    </Typography>
                                                    <Typography variant="body1" fontWeight="bold">
                                                        Hesaplanan KDV
                                                    </Typography>
                                                    <Typography variant="body1" fontWeight="bold">
                                                        Vergiler Dahil Toplam Tutar
                                                    </Typography>
                                                    <Typography variant="body1" fontWeight="bold">
                                                        Ödenecek Tutar
                                                    </Typography>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        py: 1,
                                                        display: 'flex',
                                                        flexDirection: {xs: 'column', lg: 'column'},
                                                        alignItems: 'flex-start',
                                                        justifyContent: 'flex-start',
                                                        gap: 2,
                                                    }}
                                                >
                                                    <Typography variant="body1">
                                                        {totalUnitPrice}
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        {vatTotal}
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        {totalUnitPrice + vatTotal}
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        {totalUnitPrice + vatTotal}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Divider sx={{py: 2}}/>
                                        </>
                                    )}
                                </>
                            )
                        }

                        <Box
                            sx={{
                                pt: 4,
                                pb: 0,
                                width: "100%",
                                display: "flex",
                                alignItems: "stretch",
                                justifyContent: "flex-end",
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