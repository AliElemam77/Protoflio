import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import Home from "../pages/Home/index";
import Layout from "../components/layout/layout";

const Admin = lazy(() => import("../pages/Admin/index"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <Suspense fallback={<div className="flex h-screen items-center justify-center bg-[#080808] font-mono text-xs tracking-[0.4em] text-zinc-500">LOADING CONSOLE…</div>}>
        <Admin />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: <Layout />,
    children: [{ index: true, element: <Home /> }],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
