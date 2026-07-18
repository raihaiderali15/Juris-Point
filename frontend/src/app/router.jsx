import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/Mainlayout";
import Home from "../pages/Home";
import Notes from "../pages/Notes";
import CaseLaw from "../pages/CaseLaw";
import Contact from "../pages/Contact";
import Services from "../pages/Services";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../routes/ProctectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },

      // Public Routes
      { path: "contact", element: <Contact /> },
      { path: "services", element: <Services /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },

      // Protected Routes
      {
        element: <ProtectedRoute />,
        children: [
          { path: "notes", element: <Notes /> },
          { path: "caselaw", element: <CaseLaw /> },
        ],
      },
    ],
  },
]);