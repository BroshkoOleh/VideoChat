import React, { useState, useEffect } from 'react';
import { useMeeting } from '@videosdk.live/react-sdk';
import ParticipantView from '../ParticipantView/ParticipantView';
import styles from './MeetingView.module.scss';

const MeetingView = ({ 
  onMeetingLeave, 
  userName, 
  isAudioCall, 
  callState, 
  onAcceptCall 
}) => {
  const [joined, setJoined] = useState(null);
  
  const { join, leave, toggleMic, toggleWebcam, participants } = useMeeting({
    onMeetingJoined: () => {
      console.log('✅ Meeting joined successfully');
      setJoined("JOINED");
    },
    onMeetingLeft: () => {
      console.log('📞 Meeting left');
      onMeetingLeave();
    },
    onError: (error) => {
      console.error('❌ Meeting error:', error);
    }
  });

  // Auto-join when call state becomes 'in-call'
  useEffect(() => {
    if (callState === 'in-call' && joined === null) {
      console.log('🔗 Auto-joining meeting...');
      setJoined("JOINING");
      join();
    }
  }, [callState, joined, join]);

  const handleAccept = () => {
    onAcceptCall();
  };

  const handleReject = () => {
    onMeetingLeave();
  };

  if (callState === 'receiving') {
    return (
      <div className={styles.container}>
        <div className={styles.incomingCall}>
          <div className={styles.userAvatar}>
            <div className={styles.avatarCircle}>
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
          <h3 className={styles.callerName}>{userName}</h3>
          <p className={styles.callType}>
            {isAudioCall ? '📞 Аудіо дзвінок' : '📹 Відео дзвінок'}
          </p>
          <div className={styles.callActions}>
            <button 
              className={`${styles.actionBtn} ${styles.accept}`}
              onClick={handleAccept}
            >
              ✅ Прийняти
            </button>
            <button 
              className={`${styles.actionBtn} ${styles.reject}`}
              onClick={handleReject}
            >
              ❌ Відхилити
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (callState === 'calling') {
    return (
      <div className={styles.container}>
        <div className={styles.outgoingCall}>
          <div className={styles.userAvatar}>
            <div className={styles.avatarCircle}>
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
          <h3 className={styles.callerName}>{userName}</h3>
          <p className={styles.callStatus}>Дзвонимо...</p>
          <button 
            className={`${styles.actionBtn} ${styles.cancel}`}
            onClick={onMeetingLeave}
          >
            📞 Скасувати
          </button>
        </div>
      </div>
    );
  }

  if (callState === 'in-call') {
    return (
      <div className={styles.container}>
        {joined === "JOINED" ? (
          <div className={styles.meetingActive}>
            <div className={styles.meetingHeader}>
              <h3>🔗 З'єднано з {userName}</h3>
              <p className={styles.participantCount}>
                Учасників: {participants ? participants.size : 0}
              </p>
            </div>
            
            <div className={styles.participantsGrid}>
              {participants && [...participants.keys()].map((participantId) => (
                <ParticipantView
                  key={participantId}
                  participantId={participantId}
                  isAudioCall={isAudioCall}
                />
              ))}
            </div>
            
            <div className={styles.meetingControls}>
              <button 
                className={`${styles.controlBtn} ${styles.mic}`}
                onClick={toggleMic}
              >
                🎤 Мікрофон
              </button>
              {!isAudioCall && (
                <button 
                  className={`${styles.controlBtn} ${styles.camera}`}
                  onClick={toggleWebcam}
                >
                  📹 Камера
                </button>
              )}
              <button 
                className={`${styles.controlBtn} ${styles.leave}`}
                onClick={leave}
              >
                📞 Завершити
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.connecting}>
            <p>🔄 З'єднання...</p>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default MeetingView; 