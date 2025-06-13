import React, { useState, useEffect, forwardRef, useRef } from "react";
import { MeetingProvider, MeetingConsumer } from "@videosdk.live/react-sdk";
import { authToken } from "../../utils/videoSdkHelpers/API";
import MeetingView from "../MeetingView/MeetingView";
import styles from "./CallingModalContainer.module.scss";

const CallingModalContainer = forwardRef(
  (
    {
      isOpen,
      onMeetingLeave,
      userName = "User",
      isAudioCall = true,
      meetingId,
      callState = "calling",
      currentUser,
      onAcceptCall,
    },
    ref
  ) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Showing video preview of the caller
    const [isVideoEnabled, setIsVideoEnabled] = useState(false);
    const videoRef = useRef(null);
    const streamRef = useRef(null);

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
        {/* <div
          className={`${styles.modal} ${isExpanded ? styles.expanded : ""}`}
          onDoubleClick={handleToggleExpand}
        > */}
        {/* Відео прев'ю тільки для calling та receiving */}

        {}

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

        <MeetingProvider
          config={{
            meetingId,
            micEnabled: true,
            webcamEnabled: false,
            name: currentUser?.name || "User",
          }}
          token={authToken}
        >
          <MeetingConsumer>
            {() => (
              <MeetingView
                ref={ref}
                onMeetingLeave={onMeetingLeave}
                userName={userName}
                isAudioCall={isAudioCall}
                callState={callState}
                onAcceptCall={onAcceptCall}
                // Передаємо стан камери прев'ю
                isPreviewVideoEnabled={isVideoEnabled}
                onTogglePreviewVideo={toggleVideo}
              />
            )}
          </MeetingConsumer>
        </MeetingProvider>
      </div>
      // </div>
    );
  }
);

CallingModalContainer.displayName = "CallingModalContainer";

export default CallingModalContainer;
