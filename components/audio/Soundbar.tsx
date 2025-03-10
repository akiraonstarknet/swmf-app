import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import playAudio from "../../public/sound.png";
import pauseAudio from "../../public/pause.png";
import rewindAudio from "../../public/rewind.png";

const Soundbar = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const audio = new Audio("/scalingAudio.mp3");
      audio.loop = true;
      audioRef.current = audio;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setPaused(false))
          .catch(() => {
            console.log("Autoplay blocked, waiting for user interaction");
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
    <div className="fixed left-16 top-1/4 flex gap-4">
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
    </div>
  );
};

export default Soundbar;
