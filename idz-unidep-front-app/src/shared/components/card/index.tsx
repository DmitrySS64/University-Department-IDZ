import {ReactNode} from "react";

type Props = {
    key: number;
    children: ReactNode;
};

export const Card = ({ children }: Props) => {
    return (
        <div className="card px-4 py-2" style={{ backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
            {children}
        </div>
    );
};