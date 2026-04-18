import { useContext } from "react";
import { Outlet } from "react-router-dom"; 
import { UserContext } from "../context/userContext";
import Navbar from "./Navbar";

const DashboardLayout = () => {
  const { user } = useContext(UserContext);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {user && (
        <div className="flex-1">
          <Outlet />
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
