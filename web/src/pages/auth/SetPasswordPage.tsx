import {Alert, Box, Button, Card, CardContent, Container, LinearProgress, Typography} from "@mui/material";
import {useForm, useWatch} from "react-hook-form";
import PasswordField from "../../compnents/common/PasswordField";
import { setPasswordSchema, type SetPasswordValues} from "@sts/schemas/auth.schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect, useState} from "react";
import {passCriteria} from "@sts/schemas/common.schema";
import {useNavigate, useSearchParams} from "react-router";
import {authService} from "@stf/features/auth/services/auth.service";
import {useStore} from "@stf/store/use-store.store";
import type {SetPassword} from "@sts/models/set-password.model";
import type {VerifyTokenType} from "@sts/types/verify-token.type";

export default function SetPasswordPage() {
    const navigate = useNavigate();
    const state = useStore.getState();
    const [params] = useSearchParams();
    const userId = params.get("userId")!;
    const token = params.get("token")!;
    const [pending, setPending] = useState<boolean>(false);
    const [authError, setAuthError] = useState<string>('');
    const {control, handleSubmit, formState} = useForm<SetPasswordValues>({
        resolver: zodResolver(setPasswordSchema),
        defaultValues: {
            password: '',
            confirmPassword: ''
        }
    });
    
    const getVerifyToken = async () => {
        setPending(true);
        try {
            const body: VerifyTokenType = { userId, token };
            await authService.verifyToken(body);
        } catch (e: any) {
            setAuthError(e.response.data.error ?? 'Geçersiz token');
        } finally {
            setPending(false);
        }
    }
    
    const onSubmit = async (values: SetPasswordValues) => {
        setPending(true);
        setAuthError("");
        try {
            const body: SetPassword = { userId, token, password: values.password };
            await authService.setPassword(body);
            navigate("/auth/login");
        } catch (e: any) {
            setAuthError(e.response.data.error ?? 'Geçersiz token');
        } finally {
            setPending(false);
        }
    }
    
    useEffect(() => {
        state.logout();
        (async () => {
            await getVerifyToken();
        })();
    }, [])

    const password = useWatch({control, name: 'password'});
    const confirmPassword = useWatch({control, name: 'confirmPassword'})

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
        <>
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
                                Şifre Oluştur
                            </Typography>


                            <div className="flex items-center justify-center w-full">
                                <img
                                    width="300"
                                    src="/logo-primary.png"
                                    alt="logo"
                                    loading="lazy"
                                />
                            </div>

                            {authError  && (
                                <Alert sx={{display: "flex", alignItems: "center"}}
                                       severity="error">{authError}</Alert>
                            )}

                            {!formState.isValid && formState.isDirty && formErrorMessages().length > 0 ?
                                <Alert sx={{display: "flex", alignItems: "center"}}
                                       severity="error">{password !== confirmPassword ? 'Şifreler eşleşmiyor': '' + <br/> + formErrorMessages() }</Alert> : ''}

                            <PasswordField<SetPasswordValues>
                                name="password"
                                control={control}
                                label="Şifre"
                                placeholder="Şifre"
                                required={true}
                                inputId="password"
                            />

                            <PasswordField<SetPasswordValues>
                                name="confirmPassword"
                                control={control}
                                label="Şifre tekrarı"
                                placeholder="Şifre tekrarı"
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
                                Şifre oluştur
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </>
    )
}