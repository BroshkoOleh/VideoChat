import React from "react";
import AppRoutes from "../../AppRouters";
import { useVideoSDK } from "../../context/VideoSDKContext";
import CallingModal from "../CallingModal/CallingModal";

function AppContent() {
  const {
    // States
    callState,
    currentCall,
    meetingId,
    currentUser,

    // Actions
    handleMeetingLeave,
    acceptCall,

    // Refs
    meetingViewRef,
  } = useVideoSDK();

  // Перевіряємо чи користувач авторизований
  const isAuthenticated = !!localStorage.getItem("videocall-auth");

  return (
    <>
      {/* Основні маршрути */}
      <AppRoutes />

      {/* Глобальне модальне вікно дзвінків - працює на всіх сторінках */}
      {isAuthenticated && (
        <CallingModal
          ref={meetingViewRef}
          isOpen={callState !== "idle"}
          onMeetingLeave={handleMeetingLeave}
          userName={
            callState === "calling"
              ? currentCall?.targetUser?.name || "Невідомий"
              : callState === "receiving"
              ? currentCall?.from?.name || "Невідомий"
              : callState === "in-call"
              ? (currentCall?.from?.key === currentUser?.key
                  ? currentCall?.targetUser?.name
                  : currentCall?.from?.name) || "Невідомий"
              : "Невідомий"
          }
          isAudioCall={currentCall?.type === "audio"}
          meetingId={meetingId}
          callState={callState}
          currentUser={currentUser}
          onAcceptCall={acceptCall}
        />
      )}
    </>
  );
}

export default AppContent;
