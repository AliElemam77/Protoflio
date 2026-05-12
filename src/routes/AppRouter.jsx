import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import Loader from "../components/loader";
// import NotFound from "../pages/NotFound";
// const Layout = React.lazy(() => import("../components/layout/layout"));
import  Home  from "../pages/Home/index";
import Layout from "../components/layout/layout";
const router = createBrowserRouter([
  {
    path: "/",
    element: (
        <Layout />
    ),
    children: [
      {
        index: true,
        element: (
            <Home />
        ),
      },
    //   {
    //     path: "*",
    //     element: <NotFound />,
    //   },
    ],
  },
]);
export default function AppRouter() {
  return <RouterProvider router={router} />;
}