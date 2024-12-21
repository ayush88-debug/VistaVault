import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { GiHamburgerMenu } from "react-icons/gi"; // Hamburger Icon
import { FaTimes } from "react-icons/fa"; // Close Icon for Sidebar
import account from "@/Appwrite/services";
import { useDispatch, useSelector } from "react-redux";
import { deleteData } from "@/store/authSlice";

const Header = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const authData=useSelector((state)=> state.auth)

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const logout=async()=>{
    try {
      return await account.deleteSessions();
    } catch (err) {
      console.log("Error in logout in Header Component: ",err.message)
      alert(err.message)
    }
  }
  const handdelLogout= ()=>{
    logout()
    .then(dispatch(deleteData()))
    .then(navigate("/login"))
  }

  return (
    <header className="sticky z-50 top-0 bg-white dark:bg-gray-900 shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <NavLink
          to="/"
          className="text-2xl font-bold text-gray-800 dark:text-white"
        >
          MyLogo
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 w-full justify-end pr-10">
          <div>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `mx-10 ${isActive ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-700 dark:text-gray-300 hover:text-orange-500"}`
                
            }
          >
            ALL POSTS
          </NavLink>
          {authData.userData && (
            <NavLink
            to="/your-posts"
            className={({ isActive }) =>
                `mx-10 ${isActive ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-700 dark:text-gray-300 hover:text-orange-500"}`
                  
            }
          >
            YOUR POSTS
          </NavLink>
          )}
          <NavLink
            to="/create"
            className={({ isActive }) =>
                `mx-10  ${isActive ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-700 dark:text-gray-300 hover:text-orange-500"}`
                  
            }
          >
            <Button>Create</Button>
          </NavLink>
          </div>
        </nav>


        {/* Avatar with Popover */}
        {authData.userData ? (
        <div className="hidden md:block">
        <Popover >
          <PopoverTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage
                src="https://via.placeholder.com/40"
                alt="User Avatar"
              />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </PopoverTrigger>
          <PopoverContent className="w-max bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <div className="px-4 py-2">
              <p className="font-semibold text-gray-700 dark:text-gray-200">
                {authData.userData && <p>Welcome,<br /> {authData.userData.name}</p> }
              </p>
            </div>
            <Button
              className="w-full mt-2"
              onClick={handdelLogout}
            >
              Logout
            </Button>
          </PopoverContent>
        </Popover>
        </div>
        ) : (
          <div className="hidden md:block">
            <Button onClick={()=>navigate("/login")} >Sign in</Button>
          </div>
        ) }

        {/* Hamburger Icon (Visible on mobile) */}
        <div className="md:hidden">
          <button onClick={toggleSidebar}>
            <GiHamburgerMenu size={30} className="text-gray-800 dark:text-white" />
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden transition-all ${
          isSidebarOpen ? "block" : "hidden"
        }`}
        onClick={toggleSidebar}
      >
        {/* Sidebar Content */}
        <div
          className={`fixed top-16 left-0 w-64 h-full bg-white dark:bg-gray-800 shadow-lg transition-all transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center p-4">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">Menu</h3>
            <button onClick={toggleSidebar}>
              <FaTimes size={30} className="text-gray-800 dark:text-white" />
            </button>
          </div>
          <nav className="flex flex-col space-y-4 p-4">
            <NavLink
              to="/"
              className="text-gray-700 dark:text-gray-300 hover:text-orange-500"
              onClick={toggleSidebar}
            >
              ALL POSTS
            </NavLink>

            {authData.userData && (
            <NavLink
               to="/your-posts"
               className="text-gray-700 dark:text-gray-300 hover:text-orange-500"
               onClick={toggleSidebar}
            >
               YOUR POSTS
            </NavLink> )}

            <NavLink
              to="/create"
              className="text-gray-700 dark:text-gray-300 hover:text-orange-500"
              onClick={toggleSidebar}
            >
              CREATE
            </NavLink>
          </nav>

          {/* Avatar and Logout button at the end of the sidebar */}
          {authData.userData ? (
            <div className="flex flex-col items-center mt-auto p-4">
            <div className="flex flex-col items-center">
              <Avatar className="cursor-pointer">
                <AvatarImage
                  src="https://via.placeholder.com/40"
                  alt="User Avatar"
                />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <p className="mt-2 text-gray-700 dark:text-gray-200">
              {authData.userData && <p className="text-center">Welcome,<br /> {authData.userData.name}</p> }
              </p>
            </div>
            <Button
              variant="default"
              className="w-full mt-4"
              onClick={handdelLogout}
            >
              Logout
            </Button>
          </div>
          ) : (
            <Button
             className="w-full mt-4"
             onClick={()=>navigate("/login")} 
             >Sign in</Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
