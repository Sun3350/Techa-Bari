import React, { useState, useEffect } from "react";
import "./header.css";
import SearchOverlay from "../../Pages/Search/Search";

function Header() {
  const [showHeader, setShowHeader] = useState(true); // Tracks if the header is visible
  const [lastScrollY, setLastScrollY] = useState(0); // Tracks the last scroll position
  const [searchOpen, setSearchOpen] = useState(false);
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
        <div className="text-3xl logo font-bold"><a href="/">Techabari</a></div>
        <div className="menu flex space-x-4 text-sm font-medium text-gray-700">
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
          <li>Blogs</li>
          <li>Services</li>
        </div>
        <button
          onClick={() => setSearchOpen(true)}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>
      {/* Sticky Dropdown */}
      <div className="header-dropdown bg-white flex overflow-x-auto whitespace-nowrap py-2 px-5 border-y  font-[300] shadow-md custom-scrollbar">
      {[
    "Artificial Intelligence",
    "Machine Learning",
    "Cybersecurity",
    "Cloud Computing",
    "Blockchain",
    "Internet of Things (IoT)",
    "Augmented Reality (AR)",
    "Virtual Reality (VR)",
    "Data Science",
    "Big Data",
    "Quantum Computing",
    "DevOps",
    "Web Development",
    "Mobile App Development",
    "Software Engineering",
    "Programming Languages",
    "Game Development",
    "Open Source",
    "Tech Reviews",
    "Startups & Entrepreneurship",
    "Networking",
    "Gadgets & Hardware",
    "UI/UX Design",
    "Automation & Robotics",
    "5G & Future Technologies",
  ].map((category, index) => (
    <a key={index} className="cursor-pointer text-[12px] font-semibold px-2 py-1 flex-shrink-0" href={`/categories/${category.toLowerCase().replace(/\s+/g, '-')}`}>| {category} |</a>
  ))}
</div>
{searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}

    </div>
  );
}

export default Header;
