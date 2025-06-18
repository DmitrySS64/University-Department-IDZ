//import {ReactNode} from 'react';
import {router} from "@/app/route";

import {RouterProvider} from "react-router-dom";
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "@/shared/lib/queryClient.ts";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {ListSettingsProvider} from "@/shared/context/ListSettingsContext.tsx";


const App = () => (
    <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <ListSettingsProvider>
            <RouterProvider router={router}/>
        </ListSettingsProvider>

    </QueryClientProvider>
)

export default App;

