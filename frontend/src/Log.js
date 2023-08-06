import "./Log.css";
import { useRef, useEffect } from "react";

function Log({ onClick, url, date }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    video.addEventListener("loadeddata", () => {
      // You can adjust the time if you want to capture a frame other than the first one
      video.currentTime = 1;
    });

    video.addEventListener("seeked", () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    });
  }, [url]);

  return (
    <div onClick={onClick} className="log">
      <video ref={videoRef} src={url} style={{ display: "none" }}></video>
      <canvas ref={canvasRef} width="100" height="100"></canvas>
      <div className="details">
        <h3>Person Motion Detected</h3>
        <p>{date}</p>
      </div>
    </div>
  );
}

export default Log;
