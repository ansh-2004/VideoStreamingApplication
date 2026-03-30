import { useNavigate } from "react-router-dom";

export default function VideoCard({ video }) {
  const navigate = useNavigate();

  const getColor = () => {
    if (video.status === "safe") return "text-green-600";
    if (video.status === "flagged") return "text-red-600";
    return "text-yellow-600";
  };

  return (
    <div
      className="border p-4 rounded shadow cursor-pointer"
      onClick={() => navigate(`/video/${video._id}`)}
    >
      <h3 className="font-semibold">{video.title}</h3>
      <p className={`mt-2 ${getColor()}`}>
        Status: {video.status}
      </p>

      {
        video.progress !== undefined && video.status === 'processing' && (
          <div className="mt-2">
            <div className="bg-gray-200 h-2 rounded">
              <div className="bg-blue-500 h-2 rounded" style={{width: `${video.progress}%`}}>

              </div>
            </div>
            <p className="text-sm">{video.progress}%</p>
          </div>
        )
      }
    </div>
  );
}