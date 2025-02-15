import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './search.css';

// Utility function to highlight matching query text in blue
const highlightText = (text, query) => {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? <span key={i} style={{ color: 'blue' }}>{part}</span> : part
  );
};

const SearchOverlay = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [blogs, setBlogs] = useState([]); // Blogs fetched from backend
  const [searchResults, setSearchResults] = useState([]);
  const [displayedBlogs, setDisplayedBlogs] = useState([]);
  const [showSeeMore, setShowSeeMore] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch blogs from the backend
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/userPost/search');
        setBlogs(response.data);
      } catch (error) {
        console.error('Error fetching blogs from backend:', error);
      }
    };

    fetchBlogs();
  }, []);

  // Extract unique categories from the fetched blogs
  const categories = [...new Set(blogs.map(blog => blog.category))];

  useEffect(() => {
    let results = [];
    const lowerQuery = query.toLowerCase();

    if (category) {
      // If a category is selected, start with all blogs from that category
      results = blogs.filter(blog => blog.category === category);
      // If text is also entered, further filter these results by text match
      if (query) {
        results = results.filter(blog =>
          blog.title.toLowerCase().includes(lowerQuery) ||
          blog.content.toLowerCase().includes(lowerQuery)
        );
      }
    } else {
      // If no category is selected, only filter when there's a query
      if (query) {
        results = blogs.filter(blog =>
          blog.title.toLowerCase().includes(lowerQuery) ||
          blog.content.toLowerCase().includes(lowerQuery)
        );
      } else {
        // Neither category nor text input: show no results
        results = [];
      }
    }

    // Apply sorting if specified. Assumes each blog has "createdAt" and "views" properties.
    if (sortOption) {
      if (sortOption === 'mostRecent') {
        results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (sortOption === 'oldest') {
        results.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      } else if (sortOption === 'mostViewed') {
        results.sort((a, b) => b.views - a.views);
      } else if (sortOption === 'leastViewed') {
        results.sort((a, b) => a.views - b.views);
      }
    }

    setSearchResults(results);
    setDisplayedBlogs(results.slice(0, 6)); // Initially show only the first 6 results
    setShowSeeMore(results.length > 6);
  }, [query, category, sortOption, blogs]);

  // Navigate to a category-specific page when "See More" is clicked
  const handleSeeMore = () => {
    navigate(`/category/${category}`);
    onClose(); // Optionally close the overlay after navigation
  };

  // Reset the query when category changes
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setQuery('');
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-4xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">Search Blogs</h3>
          <button onClick={onClose} className="text-red-500 font-bold">Close</button>
        </div>
        <div className="flex items-center justify-center border-2 p-2 mb-4">
          {/* Search Input */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for blogs..."
            className="search-bar flex-1"
          />
          {/* Dropdown for categories */}
          <select
            value={category}
            onChange={handleCategoryChange}
            className="category-dropdown h-full border rounded-sm ml-3"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {/* Dropdown for sort options */}
          <select
            value={sortOption}
            onChange={handleSortChange}
            className="category-dropdown h-full border rounded-sm ml-3"
          >
            <option value="">Sort By</option>
            <option value="mostRecent">Most Recent</option>
            <option value="oldest">Oldest</option>
            <option value="mostViewed">Most Viewed</option>
            <option value="leastViewed">Least Viewed</option>
          </select>
        </div>
        <div className="results-container w-full">
          {displayedBlogs.map(blog => (
            <div key={blog.id || blog._id} className="p-4 border-b">
              <Link to={`/post/${blog.id || blog._id}`} onClick={onClose}>
                <h2 className="text-xl font-bold">
                  {highlightText(blog.title, query)}
                </h2>
                <p className="text-gray-700">
                  {highlightText(blog.content.slice(0, 200) + '...', query)}
                </p>
                <p className="text-sm text-gray-500">
                  {blog.category} | {new Date(blog.createdAt).toLocaleDateString()}
                </p>
              </Link>
            </div>
          ))}
          {displayedBlogs.length === 0 && (
            <p className="text-gray-600 text-center py-10">No results found.</p>
          )}
        </div>
        {showSeeMore && (
          <button
            onClick={handleSeeMore}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            See More
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchOverlay;
