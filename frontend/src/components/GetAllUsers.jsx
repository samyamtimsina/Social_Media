import { useState, useEffect, useContext } from 'react';
import axios from '../api/axios'; // Adjust the import path as necessary
import { useNavigate, useParams } from 'react-router-dom'; // Import useNavigate for navigation
import { AuthContext } from '../contexts/AuthContext.jsx'; // Import AuthContext to access current user

const GetAllUsers = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const { user: userContext } = useContext(AuthContext);
  const [userData, setUserData] = useState(userContext);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const handleViewProfile = (myId) => {
    navigate(`/profile/${myId}`); // Navigate to the profile page with the user's ID
  };

  const handleFollowUser = async (userId) => {
    setActionLoading(userId);
    try {
      const response = await axios.post(`/follow/${userId}`);
      const newFollow = response.data;

      setUserData((prev) => ({
        ...prev,
        following: [...(prev.following || []), newFollow],
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnfollowUser = async (userId) => {
    setActionLoading(userId);
    try {
      await axios.delete(`/follow/${userId}`);

      setUserData((prev) => ({
        ...prev,
        following: (prev.following || []).filter(
          (item) => item.followingId !== userId,
        ),
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading(null);
    }
  };
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/users');
        setUsers(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []); // Fetch users when currentUserId changes

  //get all users

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <span className="loading loading-spinner text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {users.map((user) => (
        <div
          key={user.id}
          className="card bg-base-100 shadow-md p-6 flex flex-col items-center text-center rounded-2xl transition hover:shadow-xl border border-base-300"
        >
          <div className="avatar mb-3 cursor-pointer">
            <div
              className="w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2"
              onClick={() => handleViewProfile(user.id)}
            >
              <img
                src={user.image || '/default-avatar.png'}
                alt={user.username}
              />
            </div>
          </div>
          <h3
            className="text-lg font-bold text-primary cursor-pointer"
            onClick={() => handleViewProfile(user.id)}
          >
            {user.username}
          </h3>
          <p className="text-sm text-gray-400">{user.email}</p>
          {user.bio && <p className="text-xs text-gray-500 mt-1">{user.bio}</p>}

          {userData.following.some((item) => item.followingId === user.id) ? (
            <button
              className=" mt-4 px-4 py-2 text-sm font-semibold
    btn btn-primary rounded-lg

    transition-all duration-200 ease-in-out
    transform hover:scale-105 hover:shadow-lg
    focus:outline-none focus:ring focus:ring-primary focus:ring-opacity-50"
              onClick={() => handleUnfollowUser(user.id)}
              disabled={actionLoading === user.id}
            >
              {actionLoading === user.id ? (
                <>
                  <span className="loading loading-spinner mr-2" />
                  Working...
                </>
              ) : (
                'Unfollow'
              )}
            </button>
          ) : (
            <button
              className=" mt-4 px-4 py-2 text-sm font-semibold
    btn btn-primary rounded-lg

    transition-all duration-200 ease-in-out
    transform hover:scale-105 hover:shadow-lg
    focus:outline-none focus:ring focus:ring-primary focus:ring-opacity-50"
              onClick={() => handleFollowUser(user.id)}
              disabled={actionLoading === user.id}
            >
              {actionLoading === user.id ? (
                <>
                  <span className="loading loading-spinner mr-2" />
                  Working...
                </>
              ) : (
                'Follow'
              )}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default GetAllUsers;
