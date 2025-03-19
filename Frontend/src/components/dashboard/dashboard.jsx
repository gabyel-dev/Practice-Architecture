import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "../Headers/DashboardHeader";

export default function Dashboard() {
  const navigate = useNavigate();
  const [postData, setPostData] = useState({ user_id: null, content: "" });
  const [posts, setPosts] = useState([]);
  const [timeUpdate, setTimeUpdate] = useState(0);

  const formatTimeAgo = (createdAt) => {
    if (!createdAt) return "unknown";
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

  const fetchPosts = async () => {
    try {
      const res = await axios.get(
        "https://epbi-production.up.railway.app/posts"
      );
      setPosts(res.data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!postData.user_id || !postData.content.trim()) {
      alert("User ID or content is missing!");
      return;
    }

    try {
      await axios.post(
        "https://epbi-production.up.railway.app/post",
        postData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setPostData({ user_id: postData.user_id, content: "" });
      fetchPosts();
    } catch (error) {
      console.error("Error posting:", error);
    }
  };

  const deletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete(
        `https://epbi-production.up.railway.app/posts/${postId}`
      );
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await axios.get(
          "https://epbi-production.up.railway.app/user",
          {
            withCredentials: true,
          }
        );

        if (!res.data.logged_in) {
          navigate("/");
        } else {
          setPostData((prev) => ({ ...prev, user_id: res.data.user.id }));
          fetchPosts();
        }
      } catch (error) {
        console.error("Session check failed:", error);
      }
    };

    checkSession();
  }, [navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeUpdate((prev) => prev + 1);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const logout = async () => {
    try {
      await axios.post(
        "https://epbi-production.up.railway.app/logout",
        {},
        { withCredentials: true }
      );
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <DashboardHeader />
      <div className="max-w-lg mx-auto mt-8 px-4">
        <form
          onSubmit={handlePost}
          className="bg-white shadow-md rounded-lg p-4 mb-4"
        >
          <textarea
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="What's on your mind?"
            value={postData.content}
            onChange={(e) =>
              setPostData({ ...postData, content: e.target.value })
            }
            required
          />
          <button
            type="submit"
            className="w-full mt-3 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Post
          </button>
        </form>

        <div className="space-y-4">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post.id}
                className="bg-white shadow-md rounded-lg p-4 relative"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={
                      post.avatar ||
                      "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
                    }
                    alt="User Avatar"
                    className="h-10 w-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-md">
                      {post.first_name || "Unknown"} {post.last_name || "User"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatTimeAgo(post.created_at)}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-gray-800 font-semibold text-2xl">
                  {post.content}
                </p>
                <div className="mt-4 flex justify-between text-gray-500 text-sm">
                  <button className="hover:underline">Like</button>
                  <button className="hover:underline">Comment</button>
                  <button
                    className="hover:underline"
                    onClick={() => deletePost(post.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No posts yet.</p>
          )}
        </div>

        <button
          onClick={logout}
          className="w-full mt-6 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
        >
          Logout
        </button>
      </div>
    </>
  );
}
