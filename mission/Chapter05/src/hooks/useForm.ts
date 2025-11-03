import { useEffect, useState, type ChangeEvent } from "react";

interface UseFormProps<T> {
  initialValue: T;
  validate: (values: T) => Record<keyof T, string>;
}

function useForm<T>({ initialValue, validate }: UseFormProps<T>) {
  const [values, setValues] = useState(initialValue);
  const [touch, setTouch] = useState<Record<string, boolean>>();
  const [error, setError] = useState<Record<string, string>>();

  const handleChange = (name: keyof T, text: string) => {
    setValues({
      ...values,
      [name]: text,
    });
  };

  const handleBlur = (name: keyof T) => {
    setTouch({
      ...touch,
      [name]: true,
    });
  };

  const getInputProps = (name: keyof T) => {
    const value = values[name];
    const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      handleChange(name, e.target.value);

    const onBlur = () => handleBlur(name);

    return { value, onChange, onBlur };
  };

  useEffect(() => {
    const newErrors = validate(values);
    setError(newErrors);
  }, [validate, values]);

  return { values, error, touch, getInputProps };
}

export default useForm;
