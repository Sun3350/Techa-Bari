import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { formatDistanceToNow, parseISO } from 'date-fns';


const Category = () => {
  const { category } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 const navigate = useNavigate()
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const formattedCategory = encodeURIComponent(category);
        const response = await axios.get(
          `http://localhost:5000/api/userPost/category?category=${formattedCategory}`
        );

        console.log("Fetched blogs:", response.data);
        setBlogs(Array.isArray(response.data) ? response.data : response.data.blogs || []);
      } catch (err) {
        console.error("Error fetching category blogs:", err);
        setError("Failed to fetch blogs.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [category]);

  if (loading) return <div className="text-center text-lg">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className=" px-10 py-8">
      <h1 className="text-3xl font-bold my-6 text-center capitalize">
       {category.replace("-", " ")}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
        {blogs.map((blog) => (
          <div key={blog._id} className=" flex h-[25vh] justify-between">
            <div onClick={() => { 
                 navigate(`/post/${blog._id}`); // Navigate to post details page
               }} className="w-[50%] bg-black h-full rounded-xl cursor-pointer"> 
            <img src={blog.image} alt="" className="w-full h-full object-cover rounded-xl" />

            </div>
            <div className="w-[45%] ">
              <h2 className="text-lg text-blue-600 font-bold mb-2">{blog.category}</h2>
              <h3 onClick={() => {
                  navigate(`/post/${blog._id}`); // Navigate to post details page
                }} className=" text-lg font-bold cursor-pointer">{blog.title}</h3>
              {blog.publishedAt ? (
                                <p className="font-[400] text-sm mt-5">{formatDistanceToNow(parseISO(blog.publishedAt), { addSuffix: true})}</p>
                              ) : (
                                <p>Just now</p>
                              )}
              
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
