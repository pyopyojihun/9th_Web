import { useState, useEffect, useCallback, type ChangeEvent } from "react";

interface UseFormProps<T> {
  initialValue: T;
  validate: (values: T) => Partial<Record<keyof T, string>>;
}

function useForm<T>({ initialValue, validate }: UseFormProps<T>) {
  const [values, setValues] = useState<T>(initialValue);
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const handleChange = useCallback((name: keyof T, text: string) => {
    setValues((prev) => ({ ...prev, [name]: text }));
  }, []);

  const handleBlur = useCallback((name: keyof T) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  // values가 바뀔 때마다 검증
  useEffect(() => {
    setErrors(validate(values));
  }, [validate, values]);

  // 각 필드에 바인딩할 props 생성
  function getInputProps<K extends keyof T>(name: K) {
    const value = (values[name] ?? "") as unknown as string;
    const onChange = (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => handleChange(name, e.target.value);
    const onBlur = () => handleBlur(name);
    return { value, onChange, onBlur, name: String(name) };
  }

  return { values, errors, touched, handleChange, handleBlur, getInputProps };
}

export default useForm;
