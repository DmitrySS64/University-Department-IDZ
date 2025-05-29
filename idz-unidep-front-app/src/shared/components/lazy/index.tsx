import {FC, memo, NamedExoticComponent, Suspense} from "react";
import Loader from "@components/loader";

export const LoadComponent = <Props extends object, >(Component: FC<Props>): NamedExoticComponent<Props> => memo((props) => (
    <Suspense fallback={<Loader/>}>
        <Component {...props} />
    </Suspense>
))
