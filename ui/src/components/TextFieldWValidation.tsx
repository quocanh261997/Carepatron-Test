import { TextField, Typography } from '@mui/material';
import { forwardRef, useImperativeHandle, useState } from 'react';

interface Props {
	label: string;
	onChange: (value: string, isValid: boolean) => void;
	validate: (value: string) => void;
}
export interface TextFieldWValidationRef {
    validate: ()=>void
}
export const TextFieldWValidation = forwardRef(({ label, onChange, validate }: Props,ref) => {
	const [error, setError] = useState<string|undefined>();
	const [value, setValue] = useState('');

    useImperativeHandle(ref, () => ({
        // start() has type inferrence here
        validate: ()=>{
            try {
                validate(value);
                setError(undefined)
            } catch (err) {
                setError((err as Error)?.toString?.());
            }
        }
      }));

    const changeHandler = (event:any) => {
        const _value = event.target.value;
        setValue(_value);
        try {
            validate(_value);
            onChange(_value, true)
            setError(undefined)
        } catch (err) {
            onChange(_value, false)
            setError((err as Error)?.toString?.());
        }
    }
	return (
		<>
			<Typography variant='body2'>{label}</Typography>
			<TextField
				error={!!error}
				value={value}
				fullWidth
				helperText={error as string}
                onBlur={changeHandler}
				onChange={changeHandler}
				InputLabelProps={{ shrink: true }}
			></TextField>
		</>
	);
})
