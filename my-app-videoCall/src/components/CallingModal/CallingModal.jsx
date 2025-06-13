import React, { useState, useEffect, forwardRef, useRef } from 'react';
import { MeetingProvider, MeetingConsumer } from '@videosdk.live/react-sdk';
import { authToken } from '../../utils/videoSdkHelpers/API';
import MeetingView from '../MeetingView/MeetingView';
import styles from './CallingModal.module.scss';

const CallingModal = forwardRef(({ 
  isOpen, 
  onMeetingLeave, 
  userName = "User", 
  isAudioCall = true, 
  meetingId, 
  callState = 'calling',
  currentUser,
  onAcceptCall
}, ref) => {
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
            audio: false 
          });
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } else {
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
          }
          if (videoRef.current) {
            videoRef.current.srcObject = null;
          }
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setIsVideoEnabled(false);
      }
    };

    setupVideo();

    // Cleanup при розмонтуванні
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
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
  className={`${styles.modal} ${isExpanded ? styles.expanded : ''}`}
  onDoubleClick={handleToggleExpand}
>

          {/* Відео прев'ю тільки для calling та receiving */}

{}

          {(callState === 'calling' || callState === 'receiving') && isExpanded && isVideoEnabled ? (
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
                      {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : <div></div>}




        <div className={styles.topControls}>

          
          <button 
            className={styles.expandButton} 
            onClick={handleToggleExpand}
            title={isExpanded ? "Minimize window" : "Expand window"}
          >
            {isExpanded ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="black">
                <path d="M8 3V5H5V8H3V5C3 3.89543 3.89543 3 5 3H8Z" fill="currentColor"/>
                <path d="M3 16V19C3 20.1046 3.89543 21 5 21H8V19H5V16H3Z" fill="currentColor"/>
                <path d="M16 3H19C20.1046 3 21 3.89543 21 5V8H19V5H16V3Z" fill="currentColor"/>
                <path d="M21 16V19C21 20.1046 20.1046 21 19 21H16V19H19V16H21Z" fill="currentColor"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="black">
                <path d="M8 3V5H5V8H3V5C3 3.89543 3.89543 3 5 3H8Z" fill="currentColor"/>
                <path d="M3 16V19C3 20.1046 3.89543 21 5 21H8V19H5V16H3Z" fill="currentColor"/>
                <path d="M16 3H19C20.1046 3 21 3.89543 21 5V8H19V5H16V3Z" fill="currentColor"/>
                <path d="M21 16V19C21 20.1046 20.1046 21 19 21H16V19H19V16H21Z" fill="currentColor"/>
                <path d="M9 9L15 15M15 9L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
          </button>
        </div>

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
    </div>
  );
});

CallingModal.displayName = 'CallingModal';

export default CallingModal;
