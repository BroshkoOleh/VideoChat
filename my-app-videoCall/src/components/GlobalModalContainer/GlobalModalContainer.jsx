import React, { useState, useEffect, useRef } from "react";
import MeetingView from "../MeetingView/MeetingView";
import { useVideoSDK } from "../../context/VideoSDKContext";
import styles from "./GlobalModalContainer.module.scss";

const GlobalModalContainer = () => {
  const {
    // States
    callState,
    currentCall,
    meetingId,
    currentUser,

    // Actions
    handleMeetingLeave,
    acceptCall,

    // Refs
    meetingViewRef,
  } = useVideoSDK();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Визначаємо чи модал відкритий
  const isOpen = callState !== "idle";

  // Визначаємо ім'я користувача для відображення
  const userName =
    callState === "calling"
      ? currentCall?.targetUser?.name || "Невідомий"
      : callState === "receiving"
      ? currentCall?.from?.name || "Невідомий"
      : callState === "in-call"
      ? (currentCall?.from?.key === currentUser?.key
          ? currentCall?.targetUser?.name
          : currentCall?.from?.name) || "Невідомий"
      : "Невідомий";

  // Визначаємо тип дзвінка
  const isAudioCall = currentCall?.type === "audio";

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Отримуємо доступ до камери користувача
  useEffect(() => {
    const setupVideo = async () => {
      try {
        if (isVideoEnabled) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } else {
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
          }
          if (videoRef.current) {
            videoRef.current.srcObject = null;
          }
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        setIsVideoEnabled(false);
      }
    };

    setupVideo();

    // Cleanup при розмонтуванні
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isVideoEnabled]);

  const toggleVideo = () => {
    if (!isExpanded) {
      setIsExpanded(!isExpanded);
    }

    setIsVideoEnabled(!isVideoEnabled);
  };

  if (!isOpen || !meetingId) return null;

  console.log("isVideoEnabled", isVideoEnabled);

  return (
    <div className={styles.overlay}>
      <div
        className={`${styles.modal} ${isExpanded ? styles.expanded : ""}`}
        onDoubleClick={handleToggleExpand}
      >
        {/* Відео прев'ю тільки для calling та receiving */}
        {(callState === "calling" || callState === "receiving") &&
        isExpanded &&
        isVideoEnabled ? (
          <div className={styles.videoPreview}>
            <div className={styles.videoContainer}>
              {isVideoEnabled ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className={styles.videoElement}
                />
              ) : (
                <div className={styles.avatarPreview}>
                  <div className={styles.avatarCircle}>
                    {currentUser?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div></div>
        )}

        <div className={styles.topControls}>
          <button
            className={styles.expandButton}
            onClick={handleToggleExpand}
            title={isExpanded ? "Minimize window" : "Expand window"}
          ></button>
        </div>

        <MeetingView
          ref={meetingViewRef}
          onMeetingLeave={handleMeetingLeave}
          userName={userName}
          isAudioCall={isAudioCall}
          callState={callState}
          onAcceptCall={acceptCall}
          isPreviewVideoEnabled={isVideoEnabled}
          onTogglePreviewVideo={toggleVideo}
        />
      </div>
    </div>
  );
};

GlobalModalContainer.displayName = "CallingModal";

export default GlobalModalContainer;
