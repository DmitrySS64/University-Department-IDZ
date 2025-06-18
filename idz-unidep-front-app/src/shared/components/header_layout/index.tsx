import NavbarCustom from "./navbar";
import {Outlet} from "react-router-dom";


const HeaderLayout = () => {
    return (
        <>
            <NavbarCustom/>
            <div className="container" style={{height: 'calc(100% - 56px)'}}>
                <Outlet/>
            </div>
        </>
    )
}

export default HeaderLayout;