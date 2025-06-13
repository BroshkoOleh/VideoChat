import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useMeeting } from "@videosdk.live/react-sdk";
import ParticipantView from "../ParticipantView/ParticipantView";
import styles from "./MeetingView.module.scss";
import CallModal from "../CallModal/CallModal";

const MeetingView = forwardRef(
  (
    {
      onMeetingLeave,
      userName,
      isAudioCall,
      callState,
      onAcceptCall,
      isPreviewVideoEnabled,
      onTogglePreviewVideo,
    },
    ref
  ) => {
    const [joined, setJoined] = useState(null);

    const {
      join,
      leave,
      toggleMic,
      toggleWebcam,
      participants,
      micOn,
      webcamOn,
    } = useMeeting({
      onMeetingJoined: () => {
        console.log("✅ Meeting joined successfully");
        setJoined("JOINED");
      },
      onMeetingLeft: () => {
        console.log("📞 Meeting left");
        onMeetingLeave();
      },
      onError: (error) => {
        console.error("❌ Meeting error:", error);
      },
    });

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
      if (callState === "in-call" && joined === null) {
        console.log("🔗 Auto-joining meeting...");
        setJoined("JOINING");
        join();
      }
    }, [callState, joined, join]);

    // Cleanup тільки при розмонтуванні компонента, не під час активного дзвінка
    useEffect(() => {
      return () => {
        console.log("🧹 Component unmounting, cleaning up");
        setJoined(null);
      };
    }, []);

    // Debug: log joined state changes
    useEffect(() => {
      console.log("🔍 MeetingView joined state changed:", joined);
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

    // приймач дзвінка
    if (callState === "receiving") {
      return (
        <CallModal
          handleAccept={handleAccept}
          handleReject={handleReject}
          userName={userName}
          callState={callState}
          micOn={micOn}
          webcamOn={webcamOn}
        />
      );
    }

    // ініціатор дзвінка

    if (callState === "calling") {
      return (
        <CallModal
          handleAccept={handleAccept}
          handleReject={handleReject}
          userName={userName}
          callState={callState}
          micOn={micOn}
          webcamOn={webcamOn}
        />
      );
    }

    if (callState === "in-call") {
      return (
        <div className={styles.container}>
          {joined === "JOINED" ? (
            <CallModal
              handleAccept={handleAccept}
              handleReject={handleReject}
              userName={userName}
              callState={callState}
              micOn={micOn}
              webcamOn={webcamOn}
            />
          ) : (
            <CallModal
              handleAccept={handleAccept}
              handleReject={handleReject}
              userName={userName}
              callState={callState}
              callingType="connecting"
              micOn={micOn}
              webcamOn={webcamOn}
            />
          )}
        </div>
      );
    }

    return null;
  }
);

MeetingView.displayName = "MeetingView";

export default MeetingView;
