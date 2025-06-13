import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useMeeting } from '@videosdk.live/react-sdk';
import ParticipantView from '../ParticipantView/ParticipantView';
import styles from './MeetingView.module.scss';

const MeetingView = forwardRef(({ 
  onMeetingLeave, 
  userName, 
  isAudioCall, 
  callState, 
  onAcceptCall,
  isPreviewVideoEnabled,
  onTogglePreviewVideo
}, ref) => {
  const [joined, setJoined] = useState(null);
  
  const { join, leave, toggleMic, toggleWebcam, participants, micOn, webcamOn } = useMeeting({
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

  useImperativeHandle(ref, () => ({
    triggerLeave: () => {
      console.log('🔄 Triggered leave from socket event');
      console.log('🔍 Current joined state:', joined);
      console.log('🔍 Leave function available:', typeof leave);
      if (joined === "JOINED") {
        console.log('✅ Calling leave() from triggerLeave');
        leave();
      } else {
        console.warn('❌ Cannot call leave() - not joined or joined state:', joined);
      }
    }
  }), [leave, joined]);

  // Auto-join when call state becomes 'in-call'
  useEffect(() => {
    if (callState === 'in-call' && joined === null) {
      console.log('🔗 Auto-joining meeting...');
      setJoined("JOINING");
      join();
    }
  }, [callState, joined, join]);

  // Cleanup тільки при розмонтуванні компонента, не під час активного дзвінка
  useEffect(() => {
    return () => {
      console.log('🧹 Component unmounting, cleaning up');
      setJoined(null);
    };
  }, []);

  // Debug: log joined state changes
  useEffect(() => {
    console.log('🔍 MeetingView joined state changed:', joined);
  }, [joined]);

  const handleAccept = () => {
    onAcceptCall();
  };

  const handleReject = () => {
    onMeetingLeave();
  };

  // Виправлено: toggleMic без передачі event об'єкта
  const handleToggleMic = () => {
    toggleMic();
  };

  // Виправлено: toggleWebcam без передачі event об'єкта  
  const handleToggleWebcam = () => {
    toggleWebcam();
  };

  // Виправлено: leave з правильним очищенням
  const handleLeave = () => {
    leave();
  };
  console.log("callState", callState);

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
            {/* Кнопка керування камерою прев'ю */}
            {onTogglePreviewVideo && (
              <button 
                className={`${styles.actionBtn} ${styles.previewVideo} ${isPreviewVideoEnabled ? styles.active : styles.inactive}`}
                onClick={onTogglePreviewVideo}
                title={isPreviewVideoEnabled ? "Вимкнути відео" : "Увімкнути відео"}
              >
                {isPreviewVideoEnabled ? '📹' : '🚫📹'}
              </button>
            )}
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
          <div className={styles.callActions}>
            {/* Кнопка керування камерою прев'ю */}
            {onTogglePreviewVideo && (
              <button 
                className={`${styles.actionBtn} ${styles.previewVideo} ${isPreviewVideoEnabled ? styles.active : styles.inactive}`}
                onClick={onTogglePreviewVideo}
                title={isPreviewVideoEnabled ? "Вимкнути відео" : "Увімкнути відео"}
              >
                {isPreviewVideoEnabled ? '📹' : '🚫📹'}
              </button>
            )}
            <button 
              className={`${styles.actionBtn} ${styles.cancel}`}
              onClick={() => {
                onMeetingLeave();
              }}
            >
              📞 Скасувати
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (callState === 'in-call') {
    return (
      <div className={styles.container}>
        {joined === "JOINED" ? (
          <div className={styles.meetingActive}>
            {/* <div className={styles.meetingHeader}>
              <h3>🔗 З'єднано з {userName}</h3>
             
            </div> */}
            
            <div className={styles.participantsGrid}>
              {participants && [...participants.keys()].map((participantId) => (
                <ParticipantView
                  key={participantId}
                  participantId={participantId}
                />
              ))}
            </div>
            
            <div className={styles.meetingControls}>
            <button 
                className={`${styles.controlBtn} ${styles.camera} ${webcamOn ? styles.active : styles.inactive}`}
                onClick={handleToggleWebcam}
                title={isAudioCall ? "Включити відео (аудіо дзвінок)" : "Увімкнути/вимкнути камеру"}
              >
                {webcamOn ? '📹' : '🚫📹'} Камера
              </button>
              <button 
                className={`${styles.controlBtn} ${styles.mic} ${micOn ? styles.active : styles.inactive}`}
                onClick={handleToggleMic}
              >
                {micOn ? '🎤' : '🚫🎤'} Мікрофон
              </button>
           
              <button 
                className={`${styles.controlBtn} ${styles.leave}`}
                onClick={handleLeave}
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
});

MeetingView.displayName = 'MeetingView';

export default MeetingView;