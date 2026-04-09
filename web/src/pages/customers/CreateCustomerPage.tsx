import {useNavigate, useParams} from "react-router";
import {
    Box, Button,
    FormControl,
    FormControlLabel,
    FormLabel,
    Paper, Radio,
    RadioGroup, TextField,
    Typography
} from "@mui/material";
import {ArrowBack} from "@mui/icons-material";
import Divider from "@mui/material/Divider";
import {Controller, useForm, useWatch} from "react-hook-form";
import {createCustomerSchema, type CreateCustomerValue} from "@sts/schemas/create-customer.schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {CustomerService} from "@stf/features/customers/services/customer.service";
import {useSnackbar} from "../../context/SnackbarContext";
import {useEffect, useRef, useState} from "react";
import FormSkeleton from "../../compnents/common/skletons/FormSkeleton";
import {CustomerType} from "@sts/enums/customer-type.enum";


export default function CreateCustomerPage() {
    const defaultValues: CreateCustomerValue = {
        id: null,
        customerType: 'individual',
        fullName: '',
        phone: '',
        email: '',
        address: '',
        note: '',
        description: '',
        avatar: '',
        vatNumber: null
    }
    const params = useParams<{ customerId?: string }>();
    const customerId = params.customerId;
    const [loading, setLoading] = useState<boolean>(false);
    const {showSnackbar} = useSnackbar();
    const navigate = useNavigate();
    const controllerRef = useRef<AbortController | null>(null);
    const {control, handleSubmit, formState, reset} = useForm<CreateCustomerValue>({
        resolver: zodResolver(createCustomerSchema),
        defaultValues,
        mode: "onChange",
    });

    const getCustomerDetail = async (): Promise<void> => {
        if (!customerId) return;

        const controller = new AbortController();
        controllerRef.current = controller;
        setLoading(true);

        try {
            const response = await CustomerService.getCustomerById(customerId, controller.signal);
            const data = response.data;
            reset(data);
        } catch (err: any) {
            if (err.name === "CanceledError" || err.name === "AbortError") return;
            showSnackbar(err.response.data.error ?? 'Oppss! Birşeyler test gitti.', 'error')
        } finally {
            setLoading(false);
        }
    }

    const customerType = useWatch({control, name: 'customerType'});

    useEffect(() => {
        if (!customerId) return;

        (async () => {
            await getCustomerDetail();
        })();

        return () => {
            controllerRef.current?.abort();
        }
    }, [customerId])

    const onSubmit = async (values: CreateCustomerValue): Promise<void> => {
        const controller = new AbortController();
        controllerRef.current = controller;
        // setLoading(true);
        try {
            values = customerType === CustomerType.corporate
                ? {...values}
                : {
                    ...values,
                    vatNumber: null
                }
            customerId
                ? await CustomerService.updateCustomer(values, controller.signal)
                : await CustomerService.createCustomer(values, controller.signal);
            showSnackbar('Müşteri başarılı bir şekilde oluşturuldu.');
        } catch (err: any) {
            if (err.name === "CanceledError" || err.name === "AbortError") return;
            showSnackbar(err.response.data.error ?? "Müşteri kayıt edilirken bir şeyler ters gitti.", "error")
            console.log(err);
        } finally {
            // setLoading(false);
            navigate("/customers");
        }
    }

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
                        {customerId ? 'Müşteri düzenle' : 'Müşteri oluştur'}
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
                        <ArrowBack onClick={() => navigate('/customers')} cursor="pointer"/>
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
                        {/*Müşteri Tipi*/}
                        <Box sx={{py: 2}}>
                            <Controller
                                name="customerType"
                                control={control}
                                render={({field}) => (
                                    <FormControl>
                                        <FormLabel
                                            sx={{fontWeight: "bold", pb: 1, color: "black"}}
                                            required
                                            id="customer-type-label"
                                            focused={false}
                                        >
                                            Müşteri tipi
                                        </FormLabel>
                                        <RadioGroup
                                            row
                                            aria-labelledby="customer-type-label"
                                            {...field} // field.value ve field.onChange bağlanıyor
                                        >
                                            <FormControlLabel value="individual" control={<Radio/>} label="Bireysel"/>
                                            <FormControlLabel value="corporate" control={<Radio/>} label="Kurumsal"/>
                                        </RadioGroup>
                                    </FormControl>
                                )}
                            />
                        </Box>
                        <Divider/>
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
                                name="fullName"
                                control={control}
                                render={({field, fieldState}) => (
                                    <TextField
                                        {...field}
                                        value={field.value ?? ''}
                                        slotProps={{inputLabel: {required: true}}}
                                        error={fieldState.invalid}
                                        helperText={fieldState.error?.message}
                                        fullWidth
                                        id="demo-helper-text-aligned-no-helper"
                                        label="İsim soyisim"
                                        placeholder="İsim soyisim"
                                    />
                                )}
                            />

                            {
                                customerType === CustomerType.corporate ?

                                    <Controller
                                        name="vatNumber"
                                        control={control}
                                        render={({field, fieldState}) => (
                                            <TextField
                                                {...field}
                                                value={field.value ?? ''}
                                                slotProps={{inputLabel: {required: customerType === CustomerType.corporate}}}
                                                error={fieldState.invalid}
                                                helperText={fieldState.error?.message}
                                                fullWidth
                                                id="demo-helper-text-aligned-no-helper"
                                                label="Vergi numarası"
                                                placeholder="Vergi numarası"
                                            />
                                        )}
                                    /> : ''}
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
                                name="phone"
                                control={control}
                                render={({field, fieldState}) => (
                                    <TextField
                                        {...field}
                                        value={field.value ?? ''}
                                        slotProps={{inputLabel: {required: true}}}
                                        error={fieldState.invalid}
                                        helperText={fieldState.error?.message}
                                        fullWidth
                                        id="demo-helper-text-aligned-no-helper"
                                        label="Telefon numarası"
                                        placeholder="Telefon numarası"
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
                                        slotProps={{inputLabel: {required: true}}}
                                        error={fieldState.invalid}
                                        helperText={fieldState.error?.message}
                                        fullWidth
                                        id="demo-helper-text-aligned-no-helper"
                                        label="Email"
                                        placeholder="Email"
                                    />
                                )}
                            />
                        </Box>
                        <Divider sx={{py: 2}}/>
                        <Typography
                            variant="body1"
                            fontWeight="bold"
                            sx={{py: 3}}
                        >
                            Detaylı Bilgiler
                        </Typography>
                        <Box
                            sx={{
                                py: 2,
                                width: "100%",
                            }}
                        >
                            <Controller
                                name="address"
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
                                        rows={2}
                                        id="demo-helper-text-aligned-no-helper"
                                        label="Adres"
                                        placeholder="Adres"
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
                                name="note"
                                control={control}
                                render={({field, fieldState}) => (
                                    <TextField
                                        {...field}
                                        value={field.value ?? ''}
                                        slotProps={{inputLabel: {required: false}}}
                                        error={fieldState.invalid}
                                        helperText={fieldState.error?.message}
                                        fullWidth
                                        multiline
                                        rows={4}
                                        id="demo-helper-text-aligned-no-helper"
                                        label="Not"
                                        placeholder="Müşteri için not girebilirsiniz."
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
                                name="description"
                                control={control}
                                render={({field, fieldState}) => (
                                    <TextField
                                        {...field}
                                        value={field.value ?? ''}
                                        slotProps={{inputLabel: {required: false}}}
                                        error={fieldState.invalid}
                                        helperText={fieldState.error?.message}
                                        fullWidth
                                        multiline
                                        rows={4}
                                        id="demo-helper-text-aligned-no-helper"
                                        label="Açıklama"
                                        placeholder="Müşteri için açıklama ekleyebilirsiniz."
                                    />
                                )}
                            />
                            <Controller
                                name="avatar"
                                control={control}
                                render={({field, fieldState}) => (
                                    <TextField
                                        hidden={true}
                                        {...field}
                                        value={field.value ?? ''}
                                        slotProps={{inputLabel: {required: false}}}
                                        error={fieldState.invalid}
                                        helperText={fieldState.error?.message}
                                        fullWidth
                                        multiline
                                        rows={4}
                                        id="demo-helper-text-aligned-no-helper"
                                        label="Açıklama"
                                        placeholder="Müşteri için açıklama ekleyebilirsiniz."
                                    />
                                )}
                            />
                        </Box>
                        <Divider sx={{py: 2}}/>
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
                                onClick={() => navigate('/customers')}
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
                                disabled={formState.isSubmitting || !formState.isValid || !formState.isDirty}
                            >
                                {customerId ? 'Düzenle' : 'Kaydet'}
                            </Button>
                        </Box>
                    </Paper>
                </Box>
            }
        </>
    )
}