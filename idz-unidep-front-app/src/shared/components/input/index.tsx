import { Form, Row, Col } from "react-bootstrap";
import { FieldError, UseFormRegister } from "react-hook-form";

interface FormInputProps {
    name: string;
    label: string;
    register: UseFormRegister<any>;
    error?: FieldError;
    type?: string;
    required?: boolean;
    smLabel?: number;
    smInput?: number;
}

export const FormInput = ({
                              name,
                              label,
                              register,
                              error,
                              type = "text",
                              required = false,
                              smLabel = 3,
                              smInput = 12 - smLabel,
                          }: FormInputProps) => {
    return (
        <Form.Group as={Row} className="mb-2">
            <Form.Label column md={smLabel} className="text-end">
                {label}
            </Form.Label>
            <Col md={smInput} >
                <Form.Control
                    type={type}
                    {...register(name, { required })}
                    isInvalid={!!error}/>
                <Form.Control.Feedback type="invalid">
                    {error?.message}
                </Form.Control.Feedback>
            </Col>
        </Form.Group>
    );
};
