import { Navigate, RouteObject, createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import ActivityDashboard from "../../Features/activities/dashboard/ActivityDashboard";
import ActivivityForm from "../../Features/activities/form/ActivivityForm";
import ActivityDetails from "../../Features/activities/details/ActivityDetails";
import TestErrors from "../../Features/errors/TestError";
import NotFound from "../../Features/errors/NotFound";
import ServerError from "../../Features/errors/ServerError";
import LoginForm from "../../Features/Users/LoginForm";

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <App />,
        children: [
            {path: 'activities', element: <ActivityDashboard />},
            {path: 'createActivity', element: <ActivivityForm key="create"/>},
            {path: 'activities/:id', element: <ActivityDetails />},
            {path: 'manage/:id', element: <ActivivityForm key={"manage"}/>},
            {path: 'login', element: <LoginForm />},
            {path: 'errors', element: <TestErrors />},
            {path: 'not-found', element: <NotFound />},
            {path: 'server-error', element: <ServerError />},
            {path: '*', element: <Navigate replace to="/not-found" />}
        ]
    }
]

export const router = createBrowserRouter(routes)