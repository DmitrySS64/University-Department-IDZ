import { Form, Row, Col } from "react-bootstrap";
import { FieldError, UseFormRegister } from "react-hook-form";

interface Option {
    value: string | number;
    label: string;
}

interface FormSelectProps {
    name: string;
    label: string;
    options: Option[];
    register: UseFormRegister<any>;
    error?: FieldError;
    required?: boolean;
    smLabel?: number;
    smInput?: number;
    placeholder?: string; // для "Выберите значение"
}

export const FormSelect = ({
                               name,
                               label,
                               options,
                               register,
                               error,
                               required = false,
                               smLabel = 3,
                               smInput = 12 - smLabel,
                               placeholder = "Выберите значение",
                           }: FormSelectProps) => {
    return (
        <Form.Group as={Row} className="mb-2">
            <Form.Label column md={smLabel} className="text-end">
                {label}
            </Form.Label>
            <Col md={smInput}>
                <Form.Select
                    {...register(name, { required })}
                    isInvalid={!!error}
                >
                    <option value="">{placeholder}</option>
                    {options.map(({ value, label }) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                    {error?.message}
                </Form.Control.Feedback>
            </Col>
        </Form.Group>
    );
};
