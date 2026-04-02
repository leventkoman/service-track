import {loginSchema, type LoginValues} from "@sts/schemas/auth.schema";
import {Controller, useForm, useWatch} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Alert, Box, Button, Card, CardContent, Container, LinearProgress, TextField, Typography} from "@mui/material";
import {passCriteria} from "@sts/schemas/common.schema";
import {useEffect, useState} from "react";
import {authService} from "@stf/features/auth/services/auth.service";
import PasswordField from "../../compnents/common/PasswordField";
import {useNavigate} from "react-router";

export default function LoginPage() {
    const navigation = useNavigate();
    const [pending, setPending] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const {control, handleSubmit, formState} = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            phone: "",
            password: ""
        },
        mode: "onChange",
    });

    //Todo: Add handle error.
    const onSubmit = async (values: LoginValues) => {
        try {
            setPending(true);
            const response = await authService.login(values);
            console.log('response:', response);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigation('/dashboard');
        } catch (e: any) {
            console.error('catch:', e.response);
            setError(e.response?.data?.message ?? 'Bir hata oluştu.');
            console.log(error);
        } finally {
            setPending(false);
        }
    }
    
    useEffect(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }, [])

    const password = useWatch({control, name: 'password'});

    const criteria = [
        {label: passCriteria.length, valid: password?.length >= 8},
        {label: passCriteria.lowerCase, valid: /[a-z]/.test(password || '')},
        {label: passCriteria.uppercase, valid: /[A-Z]/.test(password || '')},
        {label: passCriteria.number, valid: /[0-9]/.test(password || '')},
        {label: passCriteria.specialSymbol, valid: /[^a-zA-Z0-9]/.test(password || '')},
    ];

    const formErrorMessages = () => {
        return criteria.map((value, index) => <div key={index}
                                                   className={value.valid ? "text-[#2e7d32] pb-4" : "text-[#d32f2f] pb-4"}>{value.valid ? '✓' : '✗'} {value.label}</div>)
    }

    return (
        <Container maxWidth="sm">
            <Card sx={{boxShadow: 'none', borderRadius: '16px', border: '1px solid', borderColor: 'divider'}}>
                {(pending) ?
                    <Box sx={{width: '100%'}}>
                        <LinearProgress/>
                    </Box> : null
                }
                <CardContent sx={{paddingBottom: '48px !important', p: {xs: 3, sm: 4, md: 6}}}>
                    <Box
                        component="form"
                        onSubmit={handleSubmit(onSubmit)}
                        display="flex"
                        flexDirection="column"
                        gap={5}
                    >
                        <Typography variant="h5" textAlign="center" fontWeight="bold">
                            Giriş Yap
                        </Typography>

                        <Typography variant="h5" textAlign="center" display="flex" alignItems="center"
                                    justifyContent="center" fontWeight="bold">
                            <div
                                className="rounded-full w-16 h-16 p-3 bg-primary/10 flex items-center justify-center">
                                <span className="material-symbols-outlined !text-3xl text-primary">handyman</span>
                            </div>
                        </Typography>                        

                        {!formState.isValid && formState.isDirty && formErrorMessages().length > 0 ?
                            <Alert sx={{display: "flex", alignItems: "center"}}
                                   severity="error">{formErrorMessages() }</Alert> : ''}

                        <Controller
                            name="phone"
                            control={control}
                            render={({field, fieldState}) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Telefon"
                                    placeholder="Telefon"
                                    slotProps={{inputLabel: {required: true}}}
                                    error={fieldState.invalid}
                                    helperText={fieldState.invalid ? 'Geçersiz telefon numarası' : ''}
                                />
                            )}
                        />

                        <PasswordField<LoginValues>
                            name="password"
                            control={control}
                            label="Şifre"
                            placeholder="Şifre"
                            required={true}
                            inputId="password"
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={!formState.isValid || pending}
                            fullWidth
                            size="large"
                        >
                            Giriş Yap
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
}