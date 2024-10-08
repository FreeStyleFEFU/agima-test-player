import {
  CSSProperties,
  FC,
  useEffect,
  useRef,
  useState,
  MouseEvent,
  useLayoutEffect,
} from "react";
import clsx from "clsx";

import { MusicItem } from "../../../types/music";

import {
  PauseStreamIcon,
  RewindBackIcon,
  VolumeCrossIcon,
  VolumeLoudIcon,
} from "../../../assets/icons";

import styles from "./Player.module.scss";

import circle from "../../../assets/images/circle.png";
import circle2x from "../../../assets/images/circle@2x.png";

type PlayerProps = {
  items: MusicItem[];
};
export const Player: FC<PlayerProps> = (props) => {
  const { items } = props;

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [selectedMusicItemIndex, setSelectedMusicItemIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [volumePercent, setVolumePercent] = useState(100);

  const { title, audioSrc, coverSrc } = items[selectedMusicItemIndex];

  const handlePlayButtonClick = () => {
    const audio = audioRef?.current ?? null;

    if (audio === null) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }

    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  };

  const goToNextSong = () => {
    setSelectedMusicItemIndex((prevIndex) =>
      prevIndex === items.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const goToPrevSong = () => {
    setSelectedMusicItemIndex((prevIndex) =>
      prevIndex === 0 ? items.length - 1 : prevIndex - 1,
    );
  };

  const handleProgressClick = (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => {
    const audio = audioRef?.current ?? null;

    if (audio === null) return;

    const positionLeft = event.nativeEvent.offsetX;
    const width = (event.target as HTMLButtonElement).clientWidth;
    const duration = audio.duration;

    audio.currentTime = (positionLeft / width) * duration;
  };

  const makeLouder = () => {
    const audio = audioRef?.current ?? null;

    if (audio === null) return;

    const newVolume = audio.volume + 0.1;

    if (newVolume >= 1) audio.volume = 1;
    else audio.volume = newVolume;
  };

  const makeQuieter = () => {
    const audio = audioRef?.current ?? null;

    if (audio === null) return;

    const newVolume = audio.volume - 0.1;

    if (newVolume <= 0) audio.volume = 0;
    else audio.volume = newVolume;
  };

  const handleVolumeClick = (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => {
    const audio = audioRef?.current ?? null;

    if (audio === null) return;

    const positionLeft = event.nativeEvent.offsetX;
    const width = (event.target as HTMLButtonElement).clientWidth;

    audio.volume = positionLeft / width;
  };

  const audioTimeUpdate = (event: Event) => {
    const { duration, currentTime } = event.target as HTMLAudioElement;

    if (isNaN(duration)) return;

    const progress = (currentTime / duration) * 100;

    setProgressPercent(progress);

    if (progress === 100) goToNextSong();
  };

  const audioVolumeUpdate = (event: Event) => {
    const { volume } = event.target as HTMLAudioElement;

    setVolumePercent(volume * 100);
  };

  useLayoutEffect(() => {
    setProgressPercent(0);

    const audio = audioRef?.current ?? null;

    if (!isPlaying || audio === null) return;

    audio.play();
  }, [selectedMusicItemIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const audio = audioRef?.current ?? null;

    if (audio === null) return;

    audio.addEventListener("timeupdate", audioTimeUpdate);
    audio.addEventListener("volumechange", audioVolumeUpdate);

    return () => {
      audio.removeEventListener("timeupdate", audioTimeUpdate);
      audio.removeEventListener("volumechange", audioVolumeUpdate);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={styles.root}>
      <div className={styles.soundRow}>
        <button
          type="button"
          aria-label="rewind-back-button"
          className={styles.prevButton}
          onClick={goToPrevSong}
        >
          <RewindBackIcon />
        </button>

        <div className={styles.soundContainer}>
          <button
            type="button"
            aria-label="more-quietly-button"
            className={styles.quieterButton}
            onClick={makeQuieter}
          >
            <VolumeCrossIcon />
          </button>

          <button
            type="button"
            className={styles.soundTrackContainer}
            onClick={handleVolumeClick}
          >
            <div
              className={styles.soundTrack}
              style={{ "--progress": `${volumePercent}%` } as CSSProperties}
            />
          </button>

          <button
            type="button"
            aria-label="louder-button"
            className={styles.louderButton}
            onClick={makeLouder}
          >
            <VolumeLoudIcon />
          </button>
        </div>
      </div>

      <div className={styles.nameRow}>
        <button
          type="button"
          aria-label="play-button"
          className={styles.playButton}
          onClick={handlePlayButtonClick}
        >
          {isPlaying ? "||" : <PauseStreamIcon />}
        </button>

        <div className={styles.nameContainer}>
          <span className={styles.name}>{title}</span>
        </div>
      </div>

      <div className={styles.progressRow}>
        <button
          type="button"
          aria-label="fast-forward-button"
          className={styles.nextButton}
          onClick={goToNextSong}
        >
          <RewindBackIcon className={styles.nextIcon} />
        </button>

        <button
          type="button"
          className={styles.progressContainer}
          onClick={handleProgressClick}
        >
          <div
            className={styles.progressTrack}
            style={{ "--progress": `${progressPercent}%` } as CSSProperties}
          />
        </button>
      </div>

      <audio ref={audioRef} src={audioSrc} />

      <div className={styles.coverContainer}>
        <img alt={title} src={coverSrc} className={styles.cover} />
      </div>

      <img
        alt="circle"
        className={clsx(styles.circle, isPlaying && styles.isRotating)}
        src={circle}
        srcSet={circle2x}
      />
    </div>
  );
};
