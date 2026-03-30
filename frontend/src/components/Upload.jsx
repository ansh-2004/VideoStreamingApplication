import { useState } from "react";
import API from "../utils/api";

export default function Upload({ setVideos }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [progress, setProgress] = useState(0);
  const [msg, setMsg] = useState("");

  const handleUpload = async () => {
    if (!file || !title) {
      return setMsg("Title and video required");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("video", file);

    try {
      setMsg("Uploading...");

      const res = await API.post("/videos/upload", formData, {
        onUploadProgress: (p) => {
          const percent = Math.round((p.loaded * 100) / p.total);
          setProgress(percent);
        },
      });

      console.log('res',res.data)
     
      const newVideo = res.data.data;

      if (newVideo && newVideo._id) {
        setVideos((prev) => [newVideo, ...prev]);
      }

      setMsg("Upload successful");

      setTitle("");
      setFile(null);

      // Delay reset for better UX
      setTimeout(() => setProgress(0), 2000);

    } catch (err) {
      setMsg("Upload failed");
    }
  };

  return (
    <div className="bg-white shadow p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-2">Upload Video</h2>

      <input
        type="text"
        placeholder="Video title"
        className="border p-2 w-full mb-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="file"
        className="mb-2"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Upload
      </button>

      {progress > 0 && (
        <div className="mt-2">
          <div className="bg-gray-200 h-2 rounded">
            <div
              className="bg-green-500 h-2 rounded"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm">{progress}%</p>
        </div>
      )}

      {msg && <p className="mt-2 text-sm">{msg}</p>}
    </div>
  );
}