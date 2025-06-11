import React, { useState, useEffect } from 'react';
import { MeetingProvider, MeetingConsumer } from '@videosdk.live/react-sdk';
import { authToken } from '../../utils/videoSdkHelpers/API';
import MeetingView from '../MeetingView/MeetingView';
import styles from './CallingModal.module.scss';

const CallingModal = ({ 
  isOpen, 
  onMeetingLeave, 
  userName = "User", 
  isAudioCall = true, 
  meetingId, 
  callState = 'calling',
  currentUser,
  onAcceptCall
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Auto-expand when in call
  useEffect(() => {
    if (callState === 'in-call') {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }
  }, [callState]);

  if (!isOpen || !meetingId) return null;

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={styles.overlay}>
      <div className={`${styles.modal} ${isExpanded ? styles.expanded : ''}`}>
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
            webcamEnabled: !isAudioCall,
            name: currentUser?.name || "User",
          }}
          token={authToken}
        >
          <MeetingConsumer>
            {() => (
              <MeetingView 
                onMeetingLeave={onMeetingLeave}
                userName={userName}
                isAudioCall={isAudioCall}
                callState={callState}
                onAcceptCall={onAcceptCall}
              />
            )}
          </MeetingConsumer>
        </MeetingProvider>
      </div>
    </div>
  );
};

export default CallingModal;
