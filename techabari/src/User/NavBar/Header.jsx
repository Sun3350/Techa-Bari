import React, { useState, useEffect } from "react";
import "./header.css";

function Header() {
  const [showHeader, setShowHeader] = useState(true); // Tracks if the header is visible
  const [lastScrollY, setLastScrollY] = useState(0); // Tracks the last scroll position

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show header if scrolling up, hide if scrolling down
      if (currentScrollY < lastScrollY || currentScrollY === 0) {
        setShowHeader(true);
      } else {
        setShowHeader(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <div className={`header-main-container ${showHeader ? "show" : "hide"}`}>
      <div className="header-container flex justify-between items-center px-4 py-2 bg-gray-100 shadow-md">
        <div className="text-3xl logo font-bold">Techabari</div>
        <div className="menu flex space-x-4 text-sm font-medium text-gray-700">
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
          <li>Blogs</li>
          <li>Services</li>
        </div>
      </div>

      {/* Sticky Dropdown */}
      <div className="header-dropdown bg-white flex justify-center items-center py-1 border-y text-sm font-[300] shadow-md">
        <li className="cursor-pointer">| Home |</li>
        <li className="cursor-pointer">| About |</li>
        <li className="cursor-pointer">| Contact |</li>
        <li className="cursor-pointer">| Blogs |</li>
        <li className="cursor-pointer">| Services |</li>
      </div>
    </div>
  );
}

export default Header;
