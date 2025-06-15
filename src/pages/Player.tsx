import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Hls from 'hls.js';
import useStore from '../store/useStore';
import { Content } from '../types';

const Player: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [searchParams] = useSearchParams();
  const videoUrl = searchParams.get('videoUrl');

  const { movies, tvShows, addToWatchHistory } = useStore();
  const [content, setContent] = useState<Content | null>(null);

  useEffect(() => {
    const allContent = [...movies, ...tvShows];
    const foundContent = allContent.find((item) => item.id === id);
    setContent(foundContent || null);

    if (foundContent) {
      addToWatchHistory(foundContent);
    }
  }, [id, movies, tvShows, addToWatchHistory]);

  useEffect(() => {
    if (!videoUrl) {
      console.error('No video URL provided.');
      return;
    }

    if (videoRef.current) {
      if (videoUrl.includes('.m3u8')) {
        if (Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(videoUrl);
          hls.attachMedia(videoRef.current);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            videoRef.current?.play();
          });
        } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
          videoRef.current.src = videoUrl;
          videoRef.current.addEventListener('loadedmetadata', () => {
            videoRef.current?.play();
          });
        } else {
          console.error('HLS is not supported on this browser.');
        }
      } else {
        console.log('Detected embed URL:', videoUrl);
      }
    }
  }, [videoUrl]);

  const handleBack = () => {
    navigate(-1);
  };

  if (!videoUrl || !content) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-500">
        Error: No video source or content details found. Please go back and select a video.
        <button
          onClick={handleBack}
          className="mt-4 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-gray-900 rounded-lg shadow-xl overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-gray-700">
          <button
            onClick={handleBack}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg
              className="w-6 h-6 inline-block mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>
          <h2 className="text-xl font-semibold text-white">Playing {content.title}</h2>
          <div></div>
        </div>
        <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
          {videoUrl.includes('.m3u8') ? (
            <video
              ref={videoRef}
              controls
              className="absolute top-0 left-0 w-full h-full object-cover"
            >
              {content.subtitleUrls &&
                content.subtitleUrls.map((sub) => (
                  <track
                    key={sub.lang}
                    kind="subtitles"
                    src={sub.url}
                    srcLang={sub.lang}
                    label={sub.label}
                    default={sub.lang === 'en'} // Default to English if available
                  />
                ))}
            </video>
          ) : (
            <iframe
              src={videoUrl}
              frameBorder="0"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full object-cover"
              title="Embedded Video Player"
            ></iframe>
          )}
        </div>
      </div>
    </div>
  );
};

export default Player;