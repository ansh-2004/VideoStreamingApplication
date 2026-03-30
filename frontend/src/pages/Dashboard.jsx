import { useEffect, useState, useContext } from "react";
import API from "../utils/api";
import Upload from "../components/Upload";
import VideoCard from "../components/VideoCard";
import Navbar from "../components/Navbar";
import socket from "../utils/socket";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const [videos, setVideos] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  const { user } = useContext(AuthContext);

  const fetchVideos = async () => {
    try {
      const res = await API.get("/videos/all");

      // safety handling
      const data = res.data?.data || res.data || [];
      setVideos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVideos();

    // 🔴 REAL-TIME PROGRESS
    socket.on("videoProgress", ({ videoId, progress }) => {
      setVideos((prev) =>
        prev.map((v) => {
          if (!v || !v._id) return v;
          return v._id === videoId ? { ...v, progress } : v;
        })
      );
    });

    // 🔴 COMPLETION
    socket.on("videoCompleted", ({ videoId, status }) => {
      setVideos((prev) =>
        prev.map((v) => {
          if (!v || !v._id) return v;
          return v._id === videoId
            ? { ...v, status, progress: 100 }
            : v;
        })
      );
    });

    return () => {
      socket.off("videoProgress");
      socket.off("videoCompleted");
    };
  }, []);

  // ✅ APPLY FILTERS + SEARCH
  const filteredVideos = videos
    ?.filter((v) => v && v._id)
    .filter((v) => !statusFilter || v.status === statusFilter)
    .filter((v) =>
      v.title?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <>
      {/* ✅ NAVBAR */}
      <Navbar />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        {/* ✅ FILTER + SEARCH UI */}
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          {/* Status Filter */}
          <select
            className="border p-2 rounded"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Videos</option>
            <option value="safe">Safe</option>
            <option value="flagged">Flagged</option>
            <option value="processing">Processing</option>
          </select>

          {/* Search */}
          <input
            type="text"
            placeholder="Search by title..."
            className="border p-2 rounded w-full md:w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* ✅ RBAC: Only Editor/Admin can upload */}
        {(user?.role === "editor" || user?.role === "admin") && (
          <Upload setVideos={setVideos} />
        )}

        {/* ❗ Optional: show message for viewer */}
        {user?.role === "viewer" && (
          <p className="text-sm text-gray-500 mt-2">
            You have read-only access.
          </p>
        )}

        {/* ✅ VIDEO LIST */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {filteredVideos.length > 0 ? (
            filteredVideos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))
          ) : (
            <p className="text-gray-500">No videos found</p>
          )}
        </div>
      </div>
    </>
  );
}