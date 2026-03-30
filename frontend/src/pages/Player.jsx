import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Player() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <div className="p-6 flex flex-col items-center">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-4 bg-gray-300 px-3 py-1 rounded"
        >
          ← Back
        </button>

        <div className="bg-black p-4 rounded-lg shadow-lg w-full max-w-3xl">
          <video
            controls
            className="w-full rounded"
            src={`http://localhost:3000/api/videos/stream/${id}`}
          />
        </div>
      </div>
    </>
  );
}