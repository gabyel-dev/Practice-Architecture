import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import DashboardHeader from "../Headers/DashboardHeader";

export default function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postError, setPostError] = useState(null);

  const formatTimeAgo = (createdAt) => {
    const createdTime = new Date(createdAt);
    const now = new Date();
    const diffInSeconds = Math.floor((now - createdTime) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hrs ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  useEffect(() => {
    if (!id || id === "0") return;

    const fetchUser = async () => {
      try {
        console.log("Fetching user with ID:", id);
        const res = await axios.get(
          `https://epbi-production.up.railway.app/user/${id}`
        );
        setUser(res.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("User not found or failed to fetch.");
      }
    };

    fetchUser();
  }, [id]);

  useEffect(() => {
    if (!id || id === "0") return;

    const fetchPosts = async () => {
      try {
        console.log("Fetching posts for user ID:", id);
        const res = await axios.get(
          `https://epbi-production.up.railway.app/user_posts/${id}`
        );
        setPosts(res.data);
        setPostError(null);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPostError("Failed to fetch posts.");
      }
    };

    fetchPosts();
  }, [id]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!user) return <p>Loading user...</p>;

  return (
    <>
      <DashboardHeader />
      <div className="max-w-3xl mx-auto mt-4 px-4 sm:px-6">
        {/* Cover Photo */}
        <div className="relative w-full h-40 sm:h-48 md:h-56 lg:h-64 bg-gray-300 rounded-lg">
          <img
            src={user.cover_photo || "https://via.placeholder.com/800x200"}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          {/* Profile Picture - Positioned outside cover */}
          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-30px] sm:bottom-[-40px] md:bottom-[-50px] flex justify-center">
            <img
              src={
                user.avatar ||
                "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
              }
              alt="User Avatar"
              className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 rounded-full border-4 border-white shadow-lg"
            />
          </div>
        </div>

        {/* User Info */}
        <div className="mt-16 sm:mt-20 text-center">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold">
            {user.first_name} {user.last_name}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">{user.email}</p>
        </div>

        {/* Display Posts */}
        <h2 className="text-lg sm:text-xl font-semibold mt-6 mb-2">Posts</h2>
        {postError && <p className="text-red-500">{postError}</p>}
        <div className="space-y-4">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post.id}
                className="bg-white shadow-md rounded-lg p-4 relative"
              >
                {/* Post Header */}
                <div className="flex items-center space-x-3">
                  <img
                    src={
                      post.avatar ||
                      "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
                    }
                    alt="User Avatar"
                    className="h-8 w-8 sm:h-10 sm:w-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-sm sm:text-md">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {formatTimeAgo(post.created_at)}
                    </p>
                  </div>
                </div>

                {/* Post Content */}
                <p className="mt-2 text-gray-800 text-sm sm:text-base font-semibold">
                  {post.content}
                </p>

                {/* Post Actions */}
                <div className="mt-3 flex justify-between text-gray-500 text-xs sm:text-sm">
                  <button className="hover:underline">Like</button>
                  <button className="hover:underline">Comment</button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No posts found.</p>
          )}
        </div>
      </div>
    </>
  );
}
