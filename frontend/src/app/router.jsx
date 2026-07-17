import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/Mainlayout";
import Home from "../pages/Home";
import Notes from "../pages/Notes";
import CaseLaw from "../pages/CaseLaw";
import Contact from "../pages/Contact";
import Services from "../pages/Services";
import Login from "../pages/auth/Login"
import Register from "../pages/auth/Register";
import NotFound from "../pages/NotFound";
export const router = createBrowserRouter([
  { path:"/",
    element:<MainLayout/>,
    errorElement:<NotFound/>,
    children:[
      {index:true,element:<Home/>},
      {path:"notes",element:<Notes/>},
      {path:"caselaw",element:<CaseLaw/>},
      {path:"contact",element:<Contact/>},
      {path:"services",element:<Services/>},
      {path:"login",element:<Login/>},
      {path:"register",element:<Register/>}
    ]
  }
]);