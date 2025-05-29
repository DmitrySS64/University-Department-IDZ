import NavbarCustom from "./navbar";
import {Outlet} from "react-router-dom";


const HeaderLayout = () => {
    return (
        <>
            <NavbarCustom/>
            <Outlet/>
        </>
    )
}

export default HeaderLayout;