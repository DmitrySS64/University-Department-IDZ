import {createBrowserRouter, Navigate} from "react-router-dom";
import {ERouterPath} from "@/shared/enum/route";
import HeaderLayout from "@/shared/components/header_layout";
import * as Pages from "@/app/route/pages";

export const router = createBrowserRouter([
    {
        element: <HeaderLayout/>,
        children: [{
            path: ERouterPath.MAIN,
            element: <Navigate to={ERouterPath.TEACHER} replace/>,
        }, {
            path: ERouterPath.AUTHORIZATION,
            element: <Pages.AuthorizationPage/>
        }, {
            path: ERouterPath.TEACHER,
            element: <Pages.TeachersPage/>
        }, {
            path: `${ERouterPath.TEACHER}/${ERouterPath.ID}`,
            element: <Pages.TeacherDetailsPage/>
        }, {
            path: `${ERouterPath.TEACHER}/${ERouterPath.CREATE}`,
            element: <Pages.TeacherCreatePage/>
        }, {
            path: `${ERouterPath.TEACHER}/${ERouterPath.EDIT}/${ERouterPath.ID}`,
            element: <Pages.TeacherEditPage/>
        }, {
            path: `${ERouterPath.TEACHER}/${ERouterPath.DELETE}/${ERouterPath.ID}`,
            element: <Pages.TeacherDeletePage/>
        }, {
            path: ERouterPath.DISCIPLINES,
            element: <Pages.DisciplinesPage/>
        }, {
            path: `${ERouterPath.DISCIPLINES}/${ERouterPath.ID}`,
            element: <Pages.DisciplineDetailsPage/>
        }, {
            path: ERouterPath.ADDITIONAL_ACTIVITIES,
            element: <Pages.TeachersPage/>
        }, {
            path: ERouterPath.OFFICES,
            element: <Pages.TeachersPage/>
        }],
    },
])