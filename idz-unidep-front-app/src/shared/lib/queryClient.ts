import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        mutations: {
            retry: false,
            networkMode: "always",
        },
        queries: {
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            retry: false,
            networkMode: "always",
        },
    },
});