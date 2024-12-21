import React from "react";
import { NavLink } from "react-router-dom";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import { Button } from "@/components/ui/button"; // ShadCN Button

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 text-black dark:text-white py-10 m-0">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        {/* Logo and Links Section */}
        <div className="mb-6 md:mb-0">
          <NavLink
            to="/"
            className="text-3xl font-bold text-orange-500 hover:text-white dark:hover:text-orange-500"
          >
            MyLogo
          </NavLink>
          <nav className="mt-4 md:mt-0 flex space-x-6">
            <NavLink
              to="/"
              className="text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-500"
            >
              All Posts
            </NavLink>
            <NavLink
              to="/your-posts"
              className="text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-500"
            >
              Your Posts
            </NavLink>
            <NavLink
              to="/create"
              className="text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-500"
            >
              Create
            </NavLink>
          </nav>
        </div>

        {/* Social Media Section */}
        <div className="flex space-x-4 mb-6 md:mb-0">
          <Button variant="link" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-500">
            <FaFacebook size={24} />
          </Button>
          <Button variant="link" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-500">
            <FaTwitter size={24} />
          </Button>
          <Button variant="link" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-500">
            <FaLinkedin size={24} />
          </Button>
          <Button variant="link" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-500">
            <FaInstagram size={24} />
          </Button>
        </div>

        {/* Footer Text and Copyright */}
        <div className="text-center md:text-right text-gray-400 mt-4 md:mt-0">
          <p>&copy; {new Date().getFullYear()} MyWebsite. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
