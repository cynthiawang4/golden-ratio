import { useCallback, useRef } from "react";
import Golden from "../../images/golden.mp3";

export default function useGoldenMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startTime = 64;
  const endTime = 72;

  const playSpecificPortion = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = startTime;
    audio.play().catch((e) => console.error("Autoplay blocked", e));

    const handleTimeUpdate = () => {
      if (audio.currentTime >= endTime) {
        audio.pause();
        audio.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
  }, []);

  return {
    audio: <audio ref={audioRef} src={Golden} preload="auto" />,
    play: playSpecificPortion,
  };
}
