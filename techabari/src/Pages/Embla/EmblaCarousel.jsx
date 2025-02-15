import React, { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import axios from 'axios';
import './embla.css';
import { DotButton, useDotButton } from './EmblaCarouselDotButton';
import { PrevButton, NextButton, usePrevNextButtons } from './EmblaCarouselArrowButtons';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
const EmblaCarousel = (props) => {
  const { options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay({ playOnInit: false, delay: 3000 })]);
  const navigate = useNavigate()
  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);
  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi);
  const [featuredPosts,  setFeaturedPosts] = useState([])
  const [blogs, setBlogs] = useState([]); // Flat array of blogs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const maxContentLength = 300;
  const maxTitleLength = 40;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/userPost/latest-blogs');
        console.log('Latest blogs response:', response.data);
        // Assuming the API returns an array of blogs, not nested by category
        setBlogs(response.data.blogs || []); // Handle undefined or missing data
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to fetch blogs.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const [loadingFeaturedPosts, setLoadingFeaturedPosts] = useState(true);

useEffect(() => {
  const fetchFeaturedPosts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/userPost/featured-posts'); // Update with your API route
      setFeaturedPosts(response.data);
    } catch (error) {
      console.error('Error fetching featured posts:', error);
    } finally {
      setLoadingFeaturedPosts(false);
    }
  };

  fetchFeaturedPosts();
}, []);


const handleView = async (postId) => {
  try {
    await axios.post(`http://localhost:5000/api/userPost/posts/${postId}/view`);
    console.log('View tracked for post:', postId);
  } catch (error) {
    console.error('Error tracking view:', error);
  }
};


  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const animationVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1, // Add a delay for each item based on its index
        duration: 0.5,
      },
    }),
  };
  return (
    <div className="w-full flex">
      <div className="w-[70%]">
        <section className="embla">
          <div className="embla__viewport rounded-lg" ref={emblaRef}>
            <div className="embla__container">
              {blogs.map((blog) => (
                <div className="embla__slide " key={blog._id} >
                  <img src={blog.image} className="w-full h-full object-cover object-center" />
                  <div className="slide-blog absolute top-0 w-full h-full">
                  <div className='bg-slate-400 p-1 w-fit text-xs mb-3 text-white font-bold rounded cursor-pointer'>
                     <Link to={`/categories/${blog.category.toLowerCase().replace(/\s+/g, '-')}`}>
                       {blog.category}
                     </Link>
                   </div>
                   <div className='cursor-pointer'  onClick={() => {
                  handleView(blog._id);
                  navigate(`/post/${blog._id}`); // Navigate to post details page
                }}>
                  <h2 className='text-white text-2xl font-bold'>{blog.title}</h2>
                  <div
                       className="text-white text-sm leading-relaxed font-[200] mt-1"
                       dangerouslySetInnerHTML={{
                         __html: blog.content.length > maxContentLength 
                           ? blog.content.slice(0, maxContentLength) + '...' 
                           : blog.content,
                       }}
                     />
                  </div>
           </div>
                </div>
              ))}
            </div>
          </div>
          <div className="embla__controls">
            <div className="embla__buttons">
              <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
              <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
            </div>
            <div className="embla__dots">
              {scrollSnaps.map((_, index) => (
                <DotButton
                  key={index}
                  onClick={() => onDotButtonClick(index)}
                  className={`embla__dot${index === selectedIndex ? ' embla__dot--selected' : ''}`}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
      <div className="w-[30%] px-4 ml-10">
        <h1 className="font-bold uppercase mb-2">Featured Posts</h1>
        {loadingFeaturedPosts ? (
               <div>Loading featured posts...</div>
             ) : (
              featuredPosts.map((post, index) => (
                <motion.div
                  key={post._id}
                  className="w-full cursor-pointer flex p-4 items-center shadow-md rounded-lg my-1 transition-transform hover:scale-105"
                  onClick={() => {
                    handleView(post._id);
                    navigate(`/post/${post._id}`); // Navigate to post details page
                  }}
                  variants={animationVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index} // Pass index to the variants for staggered animation
                >
                <div className='w-28 h-12 mr-3'><img className="w-full h-full rounded object-cover transition-transform hover:scale-105" src={post.image} alt="" /></div>
                <h2 className="text-sm ml-3 font-bold">
                     {post.title.length > maxTitleLength 
                       ? post.title.slice(0, maxTitleLength) + '...' 
                       : post.title}
                   </h2>
                </motion.div>
              ))
             )}

        </div>
    </div>
  );
};

export default EmblaCarousel;
