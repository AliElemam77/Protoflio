import { NavLink } from "react-router-dom";

const NavItems = [
  { title: "Home", href: "/" },
  { title: "About", href: "/about" },
  { title: "Projects", href: "/projects" },
  { title: "Contact", href: "/contact" },
];

const Navbar = () => {
  return (
    <header className="p-2 w-full absolute top-0 z-50 ">
      <div className="container mx-auto flex items-center justify-between">
        <div className="logo text-red-500 text-lg font-extrabold">Portfolio</div>

        <ul className="flex gap-4">
          {NavItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                isActive
                  ? "text-red-500 font-extrabold text-lg hover:bg-red-500/15 border border-red-500 backdrop-blur-3xl rounded-full px-2 py-1"
                  : "text-black font-medium text-lg py-1"
              }
            >
              {item.title}
            </NavLink>
          ))}
        </ul>
      </div>
    </header>
  );
};

export default Navbar;