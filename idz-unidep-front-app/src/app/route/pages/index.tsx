import {LoadComponent} from "@components/lazy";
import {lazy} from "react";

export const TeacherPage = LoadComponent(lazy(async () => import("@/pages/teacher_page")));

export const MainPage = LoadComponent(lazy(async () => import("@/app/App.tsx")));

export const AuthorizationPage = LoadComponent(lazy(async () => import("@/pages/authorization_page")));


