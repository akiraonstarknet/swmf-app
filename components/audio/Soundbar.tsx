import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import playAudio from "../../public/sound.png";
import pauseAudio from "../../public/pause.png";
import rewindAudio from "../../public/rewind.png";
import downloadIcon from "../../public/download.png";
import lyricsIcon from "../../public/lyrics.png";

const Soundbar = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const audio = new Audio("/swmf.mp3");
      audio.loop = true;
      audioRef.current = audio;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setPaused(false))
          .catch((err) => {
            console.log("Autoplay blocked, waiting for user interaction", err);
            setPaused(true);
          });
      }

      audio.addEventListener("canplaythrough", () => {
        if (!paused) {
          audio.play();
        }
      });

      return () => {
        audio.removeEventListener("canplaythrough", () => {});
      };
    }
  }, []);

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
    setPaused(!paused);
  };

  const restartAudio = () => {
    if (!audioRef.current) return;

    audioRef.current.currentTime = 0;
    audioRef.current.play();
    setPaused(false);
  };

  return (
    <div className="text-center">
      <p className="mb-2 opacity-50">SWMF Anthem</p>
      <div className="flex gap-4 items-center justify-center">
          <button className="cursor-pointer" onClick={togglePlayPause}>
            {paused ? (
              <Image
                src={playAudio}
                alt=""
                style={{ width: "40px", height: "40px" }}
              />
            ) : (
              <Image
                src={pauseAudio}
                alt=""
                style={{ width: "40px", height: "40px" }}
              />
            )}
          </button>
          <button className="cursot-pointer pointer-events-auto" onClick={()=>{
            restartAudio()
            console.log('cliked')
          }}>
            <Image
              src={rewindAudio}
              alt=""
              style={{ width: "40px", height: "40px" }}
            />
          </button>
          <button className="cursot-pointer pointer-events-auto">
            <a href="/swmf.mp3" target="_blank" download>
              <Image
                src={downloadIcon}
                alt=""
                style={{ width: "40px", height: "40px" }}
              />
            </a>
          </button>
          <button className="cursot-pointer pointer-events-auto">
            <a href="https://docs.google.com/document/d/1I-5jX56hN___h6EnesqfO_pWdNkKlgEFBCAqLAm8zhE/edit?usp=sharing" target="_blank">
              <Image
                src={lyricsIcon}
                alt=""
                style={{ width: "40px", height: "40px" }}
              />
            </a>
          </button>
      </div>
    </div>
  );
};

export default Soundbar;
