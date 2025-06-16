import React from "react";

import Accept_call from "../../assets/icons/acceptCall.svg";
import Call from "../../assets/icons/call.svg";
import MicrophoneOn from "../../assets/icons/microOn.svg";
import MicrophoneOff from "../../assets/icons/microOff.svg";

import { useMeeting } from "@videosdk.live/react-sdk";
import styles from "./MeetingControls.module.scss";
import { useVideoSDK } from "../../context/VideoSDKContext";
// const { webcamOn, micOn } = useParticipant(participantId);

const MeetingControls = ({ localMicOn, localWebcamOn }) => {
  const {
    callState,
    acceptCall,
    handleMeetingLeave,
    setInitialMicOn,
    initialMicOn,
  } = useVideoSDK();

  const { toggleMic, toggleWebcam } = useMeeting();

  console.log("callState", callState);

  const handleAccept = () => {
    acceptCall();
  };

  const handleReject = () => {
    handleMeetingLeave();
  };

  const handleToggleMic = () => {
    toggleMic();
  };
  const setUpInitialMicOn = () => {
    setInitialMicOn(!initialMicOn);
  };

  const handleToggleWebcam = () => {
    console.log("📹 Toggling webcam...");
    toggleWebcam();
  };
  return (
    <div className={styles.actionsBtns}>
      {callState === "calling" && (
        <>
          <button
            className={`${styles.actionsBtnsBx} ${styles.video}`}
            // onClick={handleToggleWebcam}
          >
            <div className={styles.image}>
              <img src={Accept_call} alt="Video" />
            </div>
            <span>Video</span>
          </button>

          <button
            className={`${styles.actionsBtnsBx} ${styles.microphone}`}
            onClick={setUpInitialMicOn}
          >
            <div className={styles.image}>
              <img
                src={initialMicOn ? MicrophoneOn : MicrophoneOff}
                alt="Microphone"
              />
            </div>
            <span>Microphone</span>
          </button>

          <button
            className={`${styles.actionsBtnsBx} ${styles.call}`}
            onClick={handleReject}
          >
            <div className={styles.image}>
              <img src={Call} alt="Decline" />
            </div>
            <span>Decline</span>
          </button>
        </>
      )}

      {callState === "receiving" && (
        <>
          <button
            className={`${styles.actionsBtnsBx} ${styles.accept}`}
            onClick={handleAccept}
          >
            <div className={styles.image}>
              <img src={Accept_call} alt="Accept" />
            </div>
            <span>Accept</span>
          </button>

          <button
            className={`${styles.actionsBtnsBx} ${styles.call}`}
            onClick={handleReject}
          >
            <div className={styles.image}>
              <img src={Call} alt="Decline" />
            </div>
            <span>Decline</span>
          </button>
        </>
      )}

      {callState === "in-call" && (
        <>
          <button
            className={`${styles.actionsBtnsBx} ${styles.video}`}
            onClick={handleAccept}
          >
            <div className={styles.image}>
              <img src={Accept_call} alt="Video" />
            </div>
            <span>Video</span>
          </button>

          <button
            className={`${styles.actionsBtnsBx} ${styles.microphone}`}
            onClick={handleToggleMic}
          >
            <div className={styles.image}>
              <img
                src={localMicOn ? MicrophoneOn : MicrophoneOff}
                alt="Microphone"
              />
            </div>
            <span>Microphone</span>
          </button>

          <button
            className={`${styles.actionsBtnsBx} ${styles.call}`}
            onClick={handleReject}
          >
            <div className={styles.image}>
              <img src={Call} alt="Decline" />
            </div>
            <span>Decline</span>
          </button>
        </>
      )}
    </div>
  );
};

export default MeetingControls;
