import React from "react";
import Accept_call from "../../assets/icons/acceptCall.svg";
import Call from "../../assets/icons/call.svg";
import Zoom from "../../assets/icons/zoom.svg";
import Zoom1 from "../../assets/icons/zoom_out1.svg";
import profileCircle from "../../assets/icons/profile-circle.svg";
import styles from "./CallModal.module.scss";
import MeetingControls from "../MeetingControls/MeetingControls";

//Accept call or reject component modal

function CallModal({
  handleAccept,
  handleReject,
  userName,
  callingType,
  // userDetail,
  callState,
  // onAccept,
  // onDecline,
  // onZoomClick
  micOn,
  webcamOn,
}) {
  return (
    <div
      // className={`modal call_model ${isPositionChanged ? "calling-position-change1" : ""}`}
      id="videoModalToggle5"
      aria-hidden="true"
      tabIndex="-1"
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
              <p>
                ({callingType === "connecting" ? "Connecting..." : "Calling..."}
                )
              </p>
            </div>
          </div>

          <MeetingControls
            handleAccept={handleAccept}
            handleReject={handleReject}
            callState={callState}
            micOn={micOn}
            webcamOn={webcamOn}
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
