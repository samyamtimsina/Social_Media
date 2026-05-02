import { useEffect, useState, useContext } from 'react';
import axios from '../api/axios.js';
import { AuthContext } from '../contexts/AuthContext.jsx';

const UserPosts = ({ userId }) => {
  const { user } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState(null);

  const myId = userId ? userId : user?.id;

  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingLike, setLoadingLike] = useState(null);

  useEffect(() => {
    if (!myId) return;

    const fetchFeed = async () => {
      try {
        const response = await axios.get(`/posts/${myId}/posts`);
        setFeed(response.data);

        if (userId) {
          const profileRes = await axios.get(`/profile/${myId}`);
          setCurrentUser(profileRes.data);
        } else {
          setCurrentUser(user); // Set only once, not in useState directly
        }
      } catch (error) {
        console.error('Error fetching feed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, [myId, userId, user]);
  // };

  // Handle like or unlike action
  const handleToggleLike = async (post) => {
    const isLiked = post.likes.some((like) => like.userId === myId);
    setLoadingLike(post.id);
    try {
      let response;
      if (isLiked) {
        response = await axios.post(`/unlike/${post.id}/${myId}`);
      } else {
        response = await axios.post(`/like/${post.id}/${myId}`);
      }

      if (response?.data?.likes) {
        setFeed((prevFeed) =>
          prevFeed.map((p) =>
            p.id === post.id ? { ...p, likes: response.data.likes } : p,
          ),
        );
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLoadingLike(null);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center p-8">
        <span className="loading loading-spinner text-primary" />
      </div>
    );

  return (
    <div className="p-4 space-y-6 max-w-2xl w-full mx-auto rounded-2xl">
      {feed.length === 0 ? (
        <div>No posts to display. Share something!</div>
      ) : (
        feed.map((post) => {
          const isLiked = post.likes.some((like) => like.userId === myId);
          const likeCount = post.likes.length;

          return (
            <div key={post.id} className="card w-full bg-base-100  shadow-xl  ">
              <div className="card-body bg-base-200 ">
                <div className="flex gap-4">
                  <div className="avatar">
                    <div className="w-12 rounded-full">
                      {currentUser?.image ? (
                        <img src={currentUser?.image} alt="User Avatar" />
                      ) : null}
                    </div>
                  </div>

                  <p className="text-lg">
                    <strong></strong> {currentUser?.username}
                  </p>
                </div>
                {/* Post content here... */}
                <strong>{post.content}</strong>

                <div className="rounded-2xl shadow-xl overflow-hidden">
                  {post.image ? (
                    <div className="w-full h-80 flex items-center justify-center ">
                      <img
                        src={post.image}
                        alt=" "
                        className="w-full h-full object-cover rounded-2xl transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  ) : null}
                </div>

                {/* Like button */}
                <button
                  className={`btn btn-outline btn-accent max-w-2xs ${isLiked ? 'btn-active' : ''}`}
                  onClick={() => handleToggleLike(post)}
                  disabled={loadingLike === post.id}
                >
                  {loadingLike === post.id ? (
                    <>
                      <span className="loading loading-spinner mr-2" />
                      Working...
                    </>
                  ) : (
                    <>
                      {isLiked ? '💖' : '🤍'} {likeCount}{' '}
                      {likeCount === 1 ? 'like' : 'likes'}
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default UserPosts;
