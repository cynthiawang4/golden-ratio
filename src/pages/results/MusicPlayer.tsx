import { useCallback, useRef } from "react";

export default function useGoldenMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startTime = 64;
  const endTime = 72;

  const playSpecificPortion = useCallback(() => {
    const audio = audioRef.current;
    console.log("AUDIO REF: ", audio);
    if (!audio) return;

    audio.currentTime = startTime;
    audio
      .play()
      .then(() => console.log("PLAYED GOLDEN"))
      .catch((e) => console.error("Autoplay blocked", e));

    const handleTimeUpdate = () => {
      if (audio.currentTime >= endTime) {
        audio.pause();
        audio.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
  }, []);

  return {
    audio: <audio ref={audioRef} src={"/golden.mp3"} preload="auto" />,
    play: playSpecificPortion,
  };
}
