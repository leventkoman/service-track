import type {Control, FieldValues, Path} from "react-hook-form";

export interface PasswordFieldProps<T extends FieldValues> {
    name: Path<T>;
    control: Control<T>;
    label: string;
    placeholder: string;
    required: boolean;
    inputId: string;
}