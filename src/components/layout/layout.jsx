import { Outlet } from "react-router-dom";
// import Navbar from "../Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col relative bg-[#010203]">
      {/* <Navbar /> */}
      {/* <ScrollToTop /> */}
      <div className="grow relative z-10">
        <Outlet />
      </div>
      {/* <Footer /> */}
    </div>
  );
}