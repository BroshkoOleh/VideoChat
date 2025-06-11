import React, { useRef, useMemo, useEffect } from 'react';
import { useParticipant } from '@videosdk.live/react-sdk';
import ReactPlayer from 'react-player';
import styles from './ParticipantView.module.scss';

const ParticipantView = ({ participantId, isAudioCall }) => {
  const micRef = useRef(null);
  const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName } =
    useParticipant(participantId);

  const videoStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
  }, [webcamStream, webcamOn]);

  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);

        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((error) =>
            console.error("audio play failed", error)
          );
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  return (
    <div className={styles.participantContainer} key={participantId}>
      <div className={styles.participantInfo}>
        <h4 className={styles.participantName}>
          {displayName || 'Учасник'} {isLocal && '(Ви)'}
        </h4>
        <div className={styles.participantStatus}>
          <span className={`${styles.statusIndicator} ${webcamOn ? styles.on : styles.off}`}>
            📹 {webcamOn ? "Увімк" : "Вимк"}
          </span>
          <span className={`${styles.statusIndicator} ${micOn ? styles.on : styles.off}`}>
            🎤 {micOn ? "Увімк" : "Вимк"}
          </span>
        </div>
      </div>
      
      {/* Audio stream */}
      <audio ref={micRef} autoPlay muted={isLocal} />
      
      {/* Video stream - only if not audio call and webcam is on */}
      {!isAudioCall && webcamOn && videoStream && (
        <div className={styles.videoContainer}>
          <ReactPlayer
            playsinline
            pip={false}
            light={false}
            controls={false}
            muted={true}
            playing={true}
            url={videoStream}
            width="100%"
            height="100%"
            className={styles.videoPlayer}
            onError={(err) => {
              console.log(err, "participant video error");
            }}
          />
        </div>
      )}
      
      {/* Avatar when video is off or audio call */}
      {(isAudioCall || !webcamOn) && (
        <div className={styles.avatarContainer}>
          <div className={styles.avatar}>
            {(displayName || 'User').charAt(0).toUpperCase()}
          </div>
          <p className={styles.avatarName}>
            {displayName || 'Учасник'} {isLocal && '(Ви)'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ParticipantView; 