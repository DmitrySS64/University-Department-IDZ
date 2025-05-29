import {createBrowserRouter} from "react-router-dom";
import {ERouterPath} from "@/shared/enum/route";
import HeaderLayout from "@/shared/components/header_layout";
import {AuthorizationPage, MainPage, TeacherPage} from "@/app/route/pages";

export const router = createBrowserRouter([
    {
        element: <HeaderLayout/>,
        children: [{
            path: ERouterPath.MAIN,
            element: <MainPage/>,
        }, {
            path: ERouterPath.AUTHORIZATION,
            element: <AuthorizationPage/>
        }, {
            path: ERouterPath.TEACHER,
            element: <TeacherPage/>
        }],
    },
])