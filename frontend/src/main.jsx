
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router.jsx";
import { AuthProvider } from "./context/authContext.jsx";
import { Toaster } from "sonner";
createRoot(document.getElementById("root")).render(
    <AuthProvider>
      <RouterProvider router={router} />
       <Toaster richColors position="top-right" />
    </AuthProvider>
);
