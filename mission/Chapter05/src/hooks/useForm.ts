import { ChangeEvent, useEffect, useState } from "react";

interface UseFormProps<T> {
    initialValue: T;
    validate: (values: T) => Record<keyof T, string>;
}

export default function useForm<T>({ initialValue, validate }: UseFormProps<T>) {
    const [values, setValues] = useState<T>(initialValue);
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (name: keyof T, text: string) => {
        setValues(prev => ({ ...prev, [name]: text }));
    };

    const handleBlur = (name: keyof T) => {
        setTouched(prev => ({ ...prev, [name]: true }));
    };

    const getInputProps = (name: keyof T) => {
        const value = values[name];
        const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            handleChange(name, e.target.value);
        const onBlur = () => handleBlur(name);
        return { value, onChange, onBlur };
    };

    useEffect(() => {
        setErrors(validate(values));
    }, [validate, values]);

    return { values, errors, touched, getInputProps };
}
