import { Menu, X } from "lucide-react";
import { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { UserContext } from "../context/userContext";

const navLinks = [
  {
    name: "Dashboard",
    href: "/dashboard",
  },
  {
    name: "Items",
    href: "/items",
  },
  {
    name: "Revision",
    href: "/revision",
  },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, clearUser } = useContext(UserContext);
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white border-b border-gray-200">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/dashboard" className="text-xl font-bold">
          PrepTrack
        </Link>

        <nav className="hidden md:flex gap-6 items-center">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.href}
              className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-600 transition duration-300 ease-in-out cursor-pointer"
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button className="hidden md:inline-block">
            {user.name}
          </button>
          {user && (
            <button
              onClick={clearUser}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-300 ease-in-out cursor-pointer"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile navigation */}

        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-900 hover:text-gray-600 transition duration-300 ease-in-out"
          >
            {isOpen ? <X /> : <Menu />}
          </button>
          {isOpen && (
            <div className="fixed top-16 min-h-screen bg-white p-4 right-0 w-64 z-50 shadow-lg">
              <nav className="flex flex-col gap-4 mt-4">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-sm font-semibold leading-6 text-gray-900"
                  >
                    {link.name}
                  </NavLink>
                ))}
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
