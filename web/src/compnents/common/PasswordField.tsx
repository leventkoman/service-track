import {
    FormControl,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput
} from "@mui/material";
import type {PasswordFieldProps} from "@stf/models/PasswordFieldProps";
import {Controller, type FieldValues} from "react-hook-form";
import React, {useState} from "react";
import {Visibility, VisibilityOff} from "@mui/icons-material";

export default function PasswordField<T extends FieldValues>({
                                                                 name,
                                                                 control,
                                                                 label,
                                                                 placeholder,
                                                                 required,
                                                                 inputId
                                                             }: PasswordFieldProps<T>) {
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    }
    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event?.preventDefault();
    }

    return (
        <Controller
            control={control}
            name={name}
            render={({field, fieldState}) => (
                <FormControl
                    fullWidth
                    error={fieldState.invalid}
                >
                    <InputLabel required={required} htmlFor={inputId}>{label}</InputLabel>
                    <OutlinedInput
                        id={inputId}
                        label={label}
                        placeholder={placeholder}
                        type={showPassword ? "text" : "password"}
                        {...field}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label={showPassword ? "Hide Password" : "Show Password"}
                                    onClick={handleClickShowPassword}
                                    onMouseUp={handleMouseUpPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff/> : <Visibility/>}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                    <FormHelperText>{fieldState.invalid ? "Geçersiz şifre." : ""}</FormHelperText>
                </FormControl>
            )}
        />
    )
}