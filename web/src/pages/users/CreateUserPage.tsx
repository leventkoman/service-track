import {useNavigate, useParams} from "react-router";
import {useEffect, useRef, useState} from "react";
import {UserService} from "@stf/features/users/services/user.service";
import {useSnackbar} from "../../context/SnackbarContext";
import {createUserSchema, type CreateUserValues} from "@stf/features/users/schemas/create-user.schema";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import FormSkeleton from "../../compnents/common/skletons/FormSkeleton";
import {
    Box, 
    Button,
    Paper,
    TextField,
    Typography
} from "@mui/material";
import {ArrowBack} from "@mui/icons-material";
import Divider from "@mui/material/Divider";

export default function CreateUserPage() {
    const defaultValues: CreateUserValues = {
        id: null,
        title: '',
        fullName: '',
        phone: '',
        email: '',
        address: '',
        description: '',
        avatar: ''
    }
    const { showSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const controllerRef = useRef<AbortController | null>(null);
    const params = useParams<{userId: string}>();
    const userId = params.userId;
    const [loading, setLoading] = useState<boolean>(false);
    const { control, handleSubmit, formState, reset } = useForm<CreateUserValues>({
        resolver: zodResolver(createUserSchema),
        defaultValues,
        mode: "onChange"
    })
    
    const getUserById = async () => {
        if (!userId) return;
        
        setLoading(true);
        const controller = new AbortController();
        controllerRef.current = controller;
        
        try {
            const response = await UserService.getUserById(userId, controller.signal);
            reset(response.data);
        } catch (err: any) {
            if (err.name === "CanceledError" || err.name === "AbortError") return;
            showSnackbar(err.response.data.error ?? 'Oppss! Birşeyler test gitti.', 'error')
        } finally {
            setLoading(false);
        }
    }
    
    const onSubmit = async (values: CreateUserValues) => {
        const controller = new AbortController();
        controllerRef.current = controller;

        try {
            userId 
                ? await UserService.updateUser(values, controller.signal)
                : await UserService.createUser(values, controller.signal); 
            
            showSnackbar('Kullanıcı başarılı bir şekilde oluşturuldu.');
        } catch (err: any) {
            if (err.name === "CanceledError" || err.name === "AbortError") return ;
            showSnackbar(err.response.data.error ?? "Kullanıcı oluşturulurken bir şeyler ters gitti.", "error")
        } finally {
            navigate("/users");
        }
    }
    
    useEffect(() => {
        (async () => {
            await getUserById()
        })();
        
        return () => {
            controllerRef.current?.abort()
        }
    }, [userId]);
    
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
                        {userId ? 'Kullanıcı düzenle' : 'Kullanıcı oluştur'}
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
                        <ArrowBack onClick={() => navigate('/users')} cursor="pointer"/>
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
                                name="title"
                                control={control}
                                render={({field, fieldState}) => (
                                    <TextField
                                        {...field}
                                        value={field.value ?? ''}
                                        slotProps={{inputLabel: {required: false}}}
                                        error={fieldState.invalid}
                                        helperText={fieldState.error?.message}
                                        fullWidth
                                        id="demo-helper-text-aligned-no-helper"
                                        label="Unvan"
                                        placeholder="Unvan"
                                    />
                                )}
                            />

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
                        <Box
                            sx={{
                                py:2,
                                width:"100%",
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
                        <Divider sx={{py:2}} />
                        <Typography
                            variant="body1"
                            fontWeight="bold"
                            sx={{py: 3}}
                        >
                            Detaylı Bilgiler
                        </Typography>
                        <Box
                            sx={{
                                py:2,
                                width:"100%",
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
                                        placeholder="Kullanıcı için açıklama ekleyebilirsiniz."
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
                                        placeholder="Kullanıcı için açıklama ekleyebilirsiniz."
                                    />
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
                                onClick={() => navigate('/users')}
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
                                {userId ? 'Düzenle' : 'Kaydet'}
                            </Button>
                        </Box>
                    </Paper>
                </Box>
            }
        </>
    )
}