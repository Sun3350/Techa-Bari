import React from 'react'
import './home.css'
import '../../Pages/Embla/embla.css'
import EmblaCarousel from '../../Pages/Embla/EmblaCarousel'
import Search from '../../Pages/Search/Search'
const Home = () => {
    const OPTIONS = { axis: 'y', loop: true }
    /**const handleLike = async (postId) => {
  try {
    await axios.post(`/api/posts/${postId}/like`);
    alert('Post liked!');
  } catch (error) {
    console.error('Error liking post:', error);
  }
};

const handleComment = async (postId, text) => {
  try {
    await axios.post(`/api/posts/${postId}/comment`, { text, user: 'Guest' });
    alert('Comment added!');
  } catch (error) {
    console.error('Error adding comment:', error);
  }
};

{post.comments.map((comment, index) => (
  <div key={index}>
    <strong>{comment.user}</strong>: {comment.text}
  </div>
))}


<div 
  key={post._id} 
  className="featured-post" 
  onClick={() => {
    handleView(post._id);
    navigate(`/posts/${post._id}`); // Navigate to post details page
  }}
>
  <img src={post.image} alt={post.title} />
  <h2>{post.title}</h2>
  <p>{post.description}</p>
  <p>Likes: {post.likes} | Views: {post.views} | Comments: {post.comments.length}</p>
</div>



 */
  return (
    <div className='home-container w-full px-16 pt-5'>
     
   <EmblaCarousel  options={OPTIONS} />
      
   
       <div className='w-full'>
        <Search/>
      </div>
    </div>
  )
}

export default Home
