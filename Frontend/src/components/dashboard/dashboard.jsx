import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "../Headers/DashboardHeader";
import moment from "moment"; // For time formatting

export default function Dashboard() {
  const navigate = useNavigate();

  const [postData, setPostData] = useState({ user_id: null, content: "" });
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/posts");
      setPosts(res.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!postData.user_id || !postData.content) {
      alert("User ID or content is missing!");
      return;
    }

    try {
      await axios.post("http://localhost:5000/post", postData, {
        headers: { "Content-Type": "application/json" },
      });

      setPostData({ user_id: postData.user_id, content: "" });
      fetchPosts();
    } catch (error) {
      console.error("Error posting:", error);
    }
  };

  const deletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete(`http://localhost:5000/posts/${postId}`);
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await axios.get("http://localhost:5000/user", {
          withCredentials: true,
        });

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

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/logout",
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
      <div className="max-w-lg mx-auto mt-8">
        {/* Post Form */}
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

        {/* Display Posts */}
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
                    src={post.avatar || "https://via.placeholder.com/40"} // Placeholder avatar
                    alt="User Avatar"
                    className="h-10 w-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">
                      {post.username || `User ${post.user_id}`}
                    </p>
                    <p className="text-sm text-gray-500">
                      {moment.utc(post.created_at).local().fromNow()}
                    </p>
                  </div>
                </div>

                {/* Post Content */}
                <p className="mt-3 text-gray-800">{post.content}</p>

                {/* Post Actions */}
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
