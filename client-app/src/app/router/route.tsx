import { RouteObject, createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import ActivityDashboard from "../../Features/activities/dashboard/ActivityDashboard";
import ActivivityForm from "../../Features/activities/form/ActivivityForm";
import ActivityDetails from "../../Features/activities/details/ActivityDetails";

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: 'activities',
                element: <ActivityDashboard />
            },
            {
                path: 'createActivity',
                element: <ActivivityForm key="create"/>
            },
            {
                path: 'activities/:id',
                element: <ActivityDetails />
            },
            {
                path: 'manage/:id',
                element: <ActivivityForm key={"manage"}/>
            }
        ]
    }
]

export const router = createBrowserRouter(routes)