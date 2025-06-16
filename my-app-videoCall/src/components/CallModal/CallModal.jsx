import React from "react";
import Accept_call from "../../assets/icons/acceptCall.svg";
import Call from "../../assets/icons/call.svg";
import Zoom from "../../assets/icons/zoom.svg";
import Zoom1 from "../../assets/icons/zoom_out1.svg";
import profileCircle from "../../assets/icons/profile-circle.svg";
import styles from "./CallModal.module.scss";
import MeetingControls from "../MeetingControls/MeetingControls";
import ParticipantView from "../ParticipantView/ParticipantView";

//Accept call or reject component modal

function CallModal({
  // handleAccept,
  // handleReject,
  userName,
  localMicOn,
  localWebcamOn,
  participants,
  joined,
  callState,
  // userDetail,
  // callState,
  // onAccept,
  // onDecline,
  // onZoomClick
  // micOn,
  // webcamOn,
}) {
  return (
    <div
      // className={`modal call_model ${isPositionChanged ? "calling-position-change1" : ""}`}

      style={{ display: "block" }}
    >
      <div
      //  className="modal-dialog modal-dialog-centered"
      >
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
                <p>({"timer"})</p>
              ) : (
                <div className={styles.connecting}>
                  <p>
                    {callState !== "in-call" ? "Calling..." : "Connecting..."}
                  </p>
                </div>
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
            // handleAccept={handleAccept}
            // handleReject={handleReject}
            // callState={callState}
            // micOn={micOn}
            // webcamOn={webcamOn}
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
    </div>
  );
}

export default CallModal;
