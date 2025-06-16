import React, { useState, useEffect } from "react";
import styles from "./CallTimer.module.scss";

const CallTimer = ({ joined, onDurationChange }) => {
  const [callDuration, setCallDuration] = useState(0);
  const [startTime, setStartTime] = useState(null);

  // Початок таймера
  useEffect(() => {
    if (joined === "JOINED" && !startTime) {
      console.log("⏰ Starting call timer");
      setStartTime(Date.now());
    }
  }, [joined, startTime]);

  // Оновлення таймера
  useEffect(() => {
    let interval;
    if (startTime && joined === "JOINED") {
      interval = setInterval(() => {
        const duration = Date.now() - startTime;
        setCallDuration(duration);
        if (onDurationChange) {
          onDurationChange(duration);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [startTime, joined, onDurationChange]);

  // ✅ Удосконалене форматування часу
  const formatDuration = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    // Якщо менше години - показуємо MM:SS
    if (hours === 0) {
      return `${minutes.toString().padStart(2, "0")}:${(seconds % 60)
        .toString()
        .padStart(2, "0")}`;
    }

    // Якщо більше години - показуємо HH:MM:SS
    return `${hours.toString().padStart(2, "0")}:${(minutes % 60)
      .toString()
      .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
  };

  if (!startTime || joined !== "JOINED") {
    return null;
  }

  return <div className={styles.callTimer}>{formatDuration(callDuration)}</div>;
};

export default CallTimer;
