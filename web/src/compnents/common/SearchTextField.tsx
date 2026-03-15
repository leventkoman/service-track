import {InputAdornment, TextField} from "@mui/material";
import {Close, Search} from "@mui/icons-material";

interface SearchTextFieldProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function SearchTextField({value, onChange, placeholder = 'Ara ...'}: SearchTextFieldProps) {

    const handleClear = () => onChange('');
    return (
        <TextField
            className="w-75"
            sx={{pb: 1}} size="small"
            id="outlined-basic"
            placeholder={placeholder}
            variant="outlined"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            slotProps={{
                input: {
                    endAdornment: (
                        <InputAdornment position="end">
                            {
                                value 
                                    ? <Close className="cursor-pointer" onClick={handleClear}/> 
                                    : <Search/>
                            }
                        </InputAdornment>
                    )
                }
            }}
        />
    )
}