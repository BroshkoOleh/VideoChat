import React, { useEffect, forwardRef, useImperativeHandle } from "react";
import { useMeeting } from "@videosdk.live/react-sdk";
import { useVideoSDK } from "../../context/VideoSDKContext";
import ParticipantView from "../ParticipantView/ParticipantView";
import styles from "./MeetingView.module.scss";
import CallModal from "../CallModal/CallModal";

const MeetingView = forwardRef(
  (
    {
      // onMeetingLeave,
      userName,
      isAudioCall,
      callState,
      // onAcceptCall,
      // isPreviewVideoEnabled,
      // onTogglePreviewVideo,
    },
    ref
  ) => {
    // Використовуємо централізований контекст
    const { joined, setJoined, handleMeetingLeave, meetingId } = useVideoSDK();

    const {
      join,
      leave,
      // toggleMic,
      // toggleWebcam,
      participants,
      localMicOn,
      localWebcamOn,
    } = useMeeting({
      onMeetingJoined: () => {
        console.log("✅ Meeting joined successfully");
        console.log("👥 Current participants:", participants?.size || 0);
        setJoined("JOINED");
      },
      onMeetingLeft: () => {
        console.log("📞 Meeting left");
        console.log("🔄 Resetting joined state and calling handleMeetingLeave");
        setJoined(null);
        handleMeetingLeave();
      },
      onError: (error) => {
        console.error("❌ Meeting error:", error);
        console.log("🔄 Resetting joined state due to error");
        setJoined(null);
      },
    });
    // console.log("participants", participants);
    useImperativeHandle(
      ref,
      () => ({
        triggerLeave: () => {
          console.log("🔄 Triggered leave from socket event");
          console.log("🔍 Current joined state:", joined);
          console.log("🔍 Leave function available:", typeof leave);
          if (joined === "JOINED") {
            console.log("✅ Calling leave() from triggerLeave");
            leave();
          } else {
            console.warn(
              "❌ Cannot call leave() - not joined or joined state:",
              joined
            );
          }
        },
      }),
      [leave, joined]
    );

    // Auto-join when call state becomes 'in-call'
    useEffect(() => {
      console.log("🔍 Auto-join check:", { callState, joined, meetingId });

      if (callState === "in-call" && joined === null) {
        console.log("🔗 Auto-joining meeting...");
        setJoined("JOINING");

        // Додаємо невелику затримку для синхронізації
        setTimeout(() => {
          console.log("⚡ Executing join() after timeout");
          join();
        }, 100);
      }
    }, [callState, joined, join, setJoined, meetingId]);

    // Cleanup тільки при розмонтуванні компонента
    useEffect(() => {
      return () => {
        console.log("🧹 Component unmounting, cleaning up");
      };
    }, []);

    // Debug: log joined state changes
    useEffect(() => {
      console.log("🔍 MeetingView joined state changed:", joined);
    }, [joined]);

    // const handleAccept = () => {
    //   onAcceptCall();
    // };

    // const handleReject = () => {
    //   onMeetingLeave();
    // };

    // // Контроли мітингу
    // const handleToggleMic = () => {
    //   console.log("handleToggleMic");
    //   toggleMic();
    // };

    // const handleToggleWebcam = () => {
    //   toggleWebcam();
    // };

    // const handleLeave = () => {
    //   leave();
    // };

    console.log("callState", callState);

    if (callState === "receiving") {
      return <CallModal userName={userName} isAudioCall={isAudioCall} />;
    }

    if (callState === "calling") {
      return <CallModal userName={userName} isAudioCall={isAudioCall} />;
    }

    // if (callState === "in-call") {
    //   return (
    //     <div className={styles.modalViewContainer}>
    //       {joined === "JOINED" ? (
    //         <div className={styles.meetingActive}>
    //           <div className={styles.participantsGrid}>
    //             {participants &&
    //               [...participants.keys()].map((participantId) => (
    //                 <ParticipantView
    //                   key={participantId}
    //                   participantId={participantId}
    //                 />
    //               ))}
    //           </div>

    //           <div className={styles.meetingControls}>
    //             <button
    //               className={`${styles.controlBtn} ${styles.camera} ${
    //                 localWebcamOn ? styles.active : styles.inactive
    //               }`}
    //               onClick={handleToggleWebcam}
    //               title={
    //                 isAudioCall
    //                   ? "Включити відео (аудіо дзвінок)"
    //                   : "Увімкнути/вимкнути камеру"
    //               }
    //             >
    //               {localWebcamOn ? "📹" : "🚫📹"} Камера
    //             </button>
    //             <button
    //               className={`${styles.controlBtn} ${styles.mic} ${
    //                 localMicOn ? styles.active : styles.inactive
    //               }`}
    //               onClick={handleToggleMic}
    //             >
    //               {localMicOn ? "🎤" : "🚫🎤"} Мікрофон
    //             </button>

    //             <button
    //               className={`${styles.controlBtn} ${styles.leave}`}
    //               onClick={handleLeave}
    //             >
    //               📞 Завершити
    //             </button>
    //           </div>
    //         </div>
    //       ) : (
    //         <div className={styles.connecting}>
    //           <p>🔄 З'єднання...</p>
    //         </div>
    //       )}
    //     </div>
    //   );
    // }
    if (callState === "in-call") {
      return (
        <CallModal
          userName={userName}
          isAudioCall={isAudioCall}
          localMicOn={localMicOn}
          localWebcamOn={localWebcamOn}
          participants={participants}
          joined={joined}
          callState={callState}
          // onAcceptCall={handleAccept}
          // onRejectCall={handleReject}
          // onTogglePreviewVideo={onTogglePreviewVideo}
        />
      );
    }

    return null;
  }
);

MeetingView.displayName = "MeetingView";

export default MeetingView;
