import React, { useRef, useMemo, useEffect } from "react";
import { useParticipant } from "@videosdk.live/react-sdk";
import styles from "./ParticipantView.module.scss";

const ParticipantView = ({ participantId }) => {
  const micRef = useRef(null);
  const videoRef = useRef(null);
  const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName } =
    useParticipant(participantId);

  console.log("participantId", participantId);
  // Debug logging
  useEffect(() => {
    console.log(
      `🎥 [${displayName || participantId}] webcamOn:`,
      webcamOn,
      "webcamStream:",
      !!webcamStream
    );
  }, [webcamOn, webcamStream, displayName, participantId]);

  const videoStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      console.log(
        `🎥 [${displayName || participantId}] Created video stream:`,
        mediaStream
      );
      return mediaStream;
    }
    console.log(
      `🎥 [${displayName || participantId}] No video stream - webcamOn:`,
      webcamOn,
      "webcamStream:",
      !!webcamStream
    );
    return null;
  }, [webcamStream, webcamOn, displayName, participantId]);

  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);

        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((error) => console.error("audio play failed", error));
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  // Handle video stream
  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
      videoRef.current.play().catch((error) => {
        console.error(
          `🎥 [${displayName || participantId}] Video play error:`,
          error
        );
      });
    } else if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [videoStream, displayName, participantId]);

  return (
    <div className={styles.participantContainer} key={participantId}>
      <div className={styles.participantInfo}>
        {/* <h4 className={styles.participantName}>
          {displayName || "Учасник"} {isLocal && "(Ви)"}
        </h4> */}
        {/* <div className={styles.participantStatus}>
          <span
            className={`${styles.statusIndicator} ${
              webcamOn ? styles.on : styles.off
            }`}
          >
            📹 {webcamOn ? "Увімк" : "Вимк"}
          </span>
          <span
            className={`${styles.statusIndicator} ${
              micOn ? styles.on : styles.off
            }`}
          >
            🎤 {micOn ? "Увімк" : "Вимк"}
          </span>
        </div> */}
      </div>

      {/* Audio stream */}
      <audio ref={micRef} autoPlay muted={isLocal} />

      {/* Video stream - show when webcam is on, regardless of call type */}
      {webcamOn && videoStream ? (
        <div className={styles.videoContainer}>
          <video ref={videoRef} autoPlay muted />
        </div>
      ) : (
        /* Avatar when video is off or not available */
        <div></div>

        // <div className={styles.avatarContainer}>
        //   <div className={styles.avatar}>
        //     {(displayName || "User").charAt(0).toUpperCase()}
        //   </div>
        //   <p className={styles.avatarName}>
        //     {displayName || "Учасник"} {isLocal && "(Ви)"}
        //   </p>
        // </div>
      )}
    </div>
  );
};

export default ParticipantView;
