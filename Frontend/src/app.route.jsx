import { createBrowserRouter } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import ForgotPassword from "./features/auth/pages/ForgotPassword";
import { Protected } from "./features/auth/components/protected.jsx";
import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/Interview";
import Reports from "./features/interview/pages/Reports";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Landing />,
    },
    {
        path: "/dashboard",
        element: (
            <Protected>
                <Home />
            </Protected>
        ),
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/forgot-password",
        element: <ForgotPassword />,
    },
    {
        path: "/reports",
        element: (
            <Protected>
                <Reports />
            </Protected>
        ),
    },
    {
        path: "/interview/:interviewId",
        element: (
            <Protected>
                <Interview />
            </Protected>
        ),
    },
]);


