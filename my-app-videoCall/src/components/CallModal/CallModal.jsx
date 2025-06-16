import React from "react";
import Accept_call from "../../assets/icons/acceptCall.svg";
import Call from "../../assets/icons/call.svg";
import Zoom from "../../assets/icons/zoom.svg";
import Zoom1 from "../../assets/icons/zoom_out1.svg";
import profileCircle from "../../assets/icons/profile-circle.svg";
import styles from "./CallModal.module.scss";
import MeetingControls from "../MeetingControls/MeetingControls";
import ParticipantView from "../ParticipantView/ParticipantView";
import CallTimer from "../CallTimer/CallTimer";
//Accept call or reject component modal

function CallModal({
  userName,
  localMicOn,
  localWebcamOn,
  participants,
  joined,
  callState,
}) {
  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalContent}>
        <div className={styles.rowCommenvv1}>
          <div className={`${styles.imageContent}`}>
            <img
              className={styles.imageAvatar}
              // src={userDetail?.photo ? userDetail.photo : profileCircle}
              src={profileCircle}
              alt="Caller"
            />
          </div>
          <div className={styles.content}>
            {/* <h4>{userDetail?.name || "Unknown Caller"}</h4> */}
            <h4>{userName || "Unknown Caller"}</h4>
            {joined === "JOINED" ? (
              <CallTimer
                joined={joined}
                onDurationChange={(duration) =>
                  console.log("Call duration:", duration)
                }
              />
            ) : (
              <p>{callState !== "in-call" ? "Calling..." : "Connecting..."}</p>
            )}
          </div>
        </div>
        <div className={styles.meetingActive}>
          <div className={styles.participantsGrid}>
            {participants &&
              [...participants.keys()].map((participantId) => (
                <ParticipantView
                  key={participantId}
                  participantId={participantId}
                />
              ))}
          </div>
        </div>

        <MeetingControls
          localMicOn={localMicOn}
          localWebcamOn={localWebcamOn}
        />

        <button
          className={styles.zoomBtn}
          // onClick={onZoomClick}
        >
          <img
            // src={isPositionChanged ? Zoom1 : Zoom}
            src={Zoom}
            alt="Zoom"
          />
        </button>
      </div>
    </div>
  );
}

export default CallModal;
