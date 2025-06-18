// src/shared/context/ListSettingsContext.tsx
import {createContext, useContext, useState, ReactNode } from "react";

type ListSettings = {
    limit: number;
    setLimit: (limit: number) => void;
    sortDirection: 'asc' | 'desc';
    setSortDirection: React.Dispatch<React.SetStateAction<'asc' | 'desc'>>;
};

const ListSettingsContext = createContext<ListSettings | undefined>(undefined);

export const ListSettingsProvider = ({ children }: { children: ReactNode }) => {
    const storedLimit = localStorage.getItem("list_limit");
    const [limit, setLimitState] = useState<number>(storedLimit ? +storedLimit : 10);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const setLimit = (newLimit: number) => {
        setLimitState(newLimit);
        localStorage.setItem("list_limit", newLimit.toString());
    };

    return (
        <ListSettingsContext.Provider value={{ limit, setLimit, sortDirection, setSortDirection }}>
            {children}
        </ListSettingsContext.Provider>
    );
};

export const useListSettings = (): ListSettings => {
    const context = useContext(ListSettingsContext);
    if (!context) throw new Error("useListSettings must be used within ListSettingsProvider");
    return context;
};
