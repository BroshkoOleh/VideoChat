import React from "react";
import MeetingView from "../MeetingView/MeetingView";
import { useVideoSDK } from "../../context/VideoSDKContext";
import styles from "./GlobalModalContainer.module.scss";

const GlobalModalContainer = () => {
  const {
    // States
    callState,
    currentCall,
    meetingId,
    currentUser,

    // Refs
    meetingViewRef,
  } = useVideoSDK();

  // Визначаємо чи модал відкритий
  const isOpen = callState !== "idle";

  // Визначаємо ім'я користувача для відображення
  const userName =
    callState === "calling"
      ? currentCall?.targetUser?.name || "Невідомий"
      : callState === "receiving"
      ? currentCall?.from?.name || "Невідомий"
      : callState === "in-call"
      ? (currentCall?.from?.key === currentUser?.key
          ? currentCall?.targetUser?.name
          : currentCall?.from?.name) || "Невідомий"
      : "Невідомий";

  // Визначаємо тип дзвінка
  const isAudioCall = currentCall?.type === "audio";

  if (!isOpen || !meetingId) return null;

  return (
    <div className={styles.overlay}>
      <MeetingView
        ref={meetingViewRef}
        userName={userName}
        isAudioCall={isAudioCall}
        callState={callState}
      />
    </div>
  );
};

GlobalModalContainer.displayName = "CallingModal";

export default GlobalModalContainer;
