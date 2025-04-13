import React from 'react';

const VideoPlayer = () => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <video controls className="w-full rounded-lg shadow-lg">
        <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;