import {LoadComponent} from "@components/lazy";
import {lazy} from "react";

export const TeachersPage = LoadComponent(lazy(async () => import("@/pages/teacher_page/list.tsx")));
export const TeacherDetailsPage = LoadComponent(lazy(async () => import("@/pages/teacher_page/details.tsx")));
export const TeacherCreatePage = LoadComponent(lazy(async () => import("@/pages/teacher_page/create.tsx")));
export const TeacherEditPage = LoadComponent(lazy(async () => import("@/pages/teacher_page/edit.tsx")));
export const TeacherDeletePage = LoadComponent(lazy(async () => import("@/pages/teacher_page/delete.tsx")));


export const DisciplinesPage = LoadComponent(lazy(async () => import("@/pages/discipline_page/list.tsx")));
export const DisciplineDetailsPage = LoadComponent(lazy(async () => import("@/pages/discipline_page/details.tsx")));


export const AuthorizationPage = LoadComponent(lazy(async () => import("@/pages/authorization_page")));

