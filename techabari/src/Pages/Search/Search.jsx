import React, { useEffect, useState } from 'react';
import blogsData from '../../utils/blogsData.json'; // Import the JSON file
import { Link, useNavigate } from 'react-router-dom';
import './search.css'
const Search = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [blogs, setBlogs] = useState([]); // This will store blogs fetched from JSON
  const [searchResults, setSearchResults] = useState([]);
  const [displayedBlogs, setDisplayedBlogs] = useState([]);
  const [showSeeMore, setShowSeeMore] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Use the imported JSON data instead of fetching it
    setBlogs(blogsData); // Set blogs to state after importing
  }, []);

  // Categories available in your data
  const categories = [...new Set(blogs.map(blog => blog.cat))]; // Extract unique categories

  useEffect(() => {
    // Filter blogs based on the search query and selected category
    let results = blogs.filter(blog =>
      (category ? blog.cat === category : true) &&
      (query ? blog.title.toLowerCase().includes(query.toLowerCase()) : true)
    );
    
    // Show only the first 6 blogs if a category is selected
    setDisplayedBlogs(results.slice(0, 6));
    setSearchResults(results);
    
    // If more than 6 results, show the "See More" button
    setShowSeeMore(results.length > 6);
  }, [query, category, blogs]);

  // Handle the "See More" button click to navigate to a category-specific page
  const handleSeeMore = () => {
    navigate(`/category/${category}`);
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setQuery(''); // Reset search query when category changes
  };

  return (
    <div className='w-full flex justify-center flex-col items-center py-10'>
      <h3 className='text-2xl font-bold'>Highlighted Articles Or News At TThe Top Of The Page</h3>
      <div className='w-full rounded-xl search-container flex justify-center flex-col items-center py-10 mt-3'>
        <div className="search-container flex items-center justify-center border-2 p-2 ">
         {/* Search Input */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for blogs..."
            className="search-bar"
          /> 

                   {/* Dropdown for categories */}
          <select value={category} onChange={handleCategoryChange} className="category-dropdown h-full border rounded-sm">
            <option className='option' value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat} className='option'>{cat}</option>
            ))}
          </select>
        </div>

       
       
      </div>
      <div >
      {displayedBlogs.length > 0 && (
          <div className='search-result w-full flex justify-between items-center rounded-sm mt-8'>
            {displayedBlogs.map((blog, index) => {
              const titleWords = blog.title.split(' ');
              const truncatedTitle = titleWords.length > 10 ? titleWords.slice(0, 10).join(' ') + '...' : blog.title;

              return (
                <div key={blog._id} className='search-result-content  '>
                    <div className='relative'>
                    <img src={blog.image} alt="" className='rounded-md'/>
                    <div className='absolute top-0 bg-slate-400 p-1 w-fit text-xs text-white font-bold rounded m-2'>{blog.cat}</div>
                    </div>g<p className='blog-author'>{blog.author} - {blog.date}</p>
                 
                </div>
              );
            })}
          </div>
        )}

        {/* Show "See More" Button if more than 6 blogs are available */}
        {showSeeMore && (
          <button onClick={handleSeeMore} className="see-more-btn">
            See More
          </button>
        )}
      </div>
    </div>
  );
};

export default Search;
