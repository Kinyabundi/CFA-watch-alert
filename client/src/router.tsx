import {createBrowserRouter, RouteObject} from 'react-router-dom';
import Home from './pages/home';
import MainLayout from './layout/MainLayout';
import Dashboard from './pages/dashboard';

const routes: RouteObject[] = [
    {
        path: '/',
        element: <Home />,
    },
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                path: 'dashboard',
                element: <Dashboard />,
            },
        ],

    }
];

const Router = createBrowserRouter(routes);

export default Router;