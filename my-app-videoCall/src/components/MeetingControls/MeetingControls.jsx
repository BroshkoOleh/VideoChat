import React from 'react';
import { useMeeting } from '@videosdk.live/react-sdk';
import styles from './MeetingControls.module.scss';

const MeetingControls = ({ onMeetingLeave, isAudioCall }) => {
  const { leave, toggleMic, toggleWebcam, micOn, webcamOn } = useMeeting();

  const handleToggleMic = () => {
    toggleMic();
  };

  const handleToggleWebcam = () => {
    toggleWebcam();
  };

  const handleEndCall = () => {
    leave();
    onMeetingLeave();
  };

  return (
    <div className={styles.controls}>
      <button 
        className={`${styles.controlButton} ${styles.videoButton} ${webcamOn ? styles.active : styles.inactive}`}
        onClick={handleToggleWebcam}
        disabled={isAudioCall}
        style={{ opacity: isAudioCall ? 0.5 : 1 }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M23 7L16 12L23 17V7Z" fill="currentColor"/>
          <path d="M15 5H3C1.89543 5 1 5.89543 1 7V17C1 18.1046 1.89543 19 3 19H15C16.1046 19 17 18.1046 17 17V7C17 5.89543 16.1046 5 15 5Z" fill="currentColor"/>
        </svg>
      </button>

      <button 
        className={`${styles.controlButton} ${styles.micButton} ${micOn ? styles.active : styles.inactive}`}
        onClick={handleToggleMic}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 1C10.3431 1 9 2.34315 9 4V12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12V4C15 2.34315 13.6569 1 12 1Z" fill="currentColor"/>
          <path d="M5 12C5 12.5523 5.44772 13 6 13C6.55228 13 7 12.5523 7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12C17 12.5523 17.4477 13 18 13C18.5523 13 19 12.5523 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12Z" fill="currentColor"/>
          <path d="M12 19C12.5523 19 13 19.4477 13 20C13 20.5523 12.5523 21 12 21C11.4477 21 11 20.5523 11 20C11 19.4477 11.4477 19 12 19Z" fill="currentColor"/>
          <path d="M12 17V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      <button 
        className={`${styles.controlButton} ${styles.endButton}`}
        onClick={handleEndCall}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M22 15.7969V18.7969C22.0008 19.1208 21.9269 19.4401 21.7842 19.7293C21.6415 20.0185 21.4336 20.2695 21.1769 20.4629C20.9202 20.6562 20.6214 20.7866 20.3047 20.8429C19.9881 20.8992 19.6628 20.8801 19.3569 20.7869C16.0569 19.9369 12.9769 18.3469 10.3469 16.1169C7.92688 13.9769 6.01688 11.2969 4.73688 8.29688C4.63688 7.98438 4.61688 7.65188 4.67688 7.32813C4.73688 7.00438 4.87188 6.69688 5.07188 6.43688C5.27188 6.17688 5.52188 5.96563 5.81688 5.82188C6.11188 5.67813 6.43688 5.60938 6.76688 5.61688H9.76688C10.3069 5.61688 10.8269 5.81688 11.2269 6.17688C11.6269 6.53688 11.8769 7.02688 11.9269 7.55688C12.0169 8.61688 12.2269 9.65688 12.5569 10.6569C12.7169 11.1269 12.7369 11.6369 12.6169 12.1169C12.4969 12.5969 12.2469 13.0269 11.8969 13.3569L10.6769 14.5769C12.5569 17.0769 15.1069 19.6269 17.6069 21.5069L18.8269 20.2869C19.1569 19.9369 19.5869 19.6869 20.0669 19.5669C20.5469 19.4469 21.0569 19.4669 21.5269 19.6269C22.5269 19.9569 23.5669 20.1669 24.6269 20.2569C25.1669 20.3069 25.6669 20.5669 26.0269 20.9769C26.3869 21.3869 26.5769 21.9169 26.5669 22.4669Z" fill="currentColor"/>
        </svg>
      </button>
    </div>
  );
};

export default MeetingControls; 