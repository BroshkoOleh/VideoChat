import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import { MeetingProvider, MeetingConsumer } from "@videosdk.live/react-sdk";
import { authToken, createMeeting } from "../utils/videoSdkHelpers/API";
import socketService from "../utils/socket";

const VideoSDKContext = createContext();

export const useVideoSDK = () => {
  const context = useContext(VideoSDKContext);
  if (!context) {
    throw new Error("useVideoSDK повинен використовуватися в VideoSDKProvider");
  }
  return context;
};

export const VideoSDKProvider = ({ children }) => {
  // Meeting states
  const [meetingId, setMeetingId] = useState("");
  const [callState, setCallState] = useState("idle");
  const [currentCall, setCurrentCall] = useState(null);
  const [joined, setJoined] = useState(null);
  const [initialMicOn, setInitialMicOn] = useState(true);

  // User states
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  // Refs
  const meetingViewRef = useRef(null);

  // Meeting actions
  const createNewMeeting = async () => {
    try {
      const newMeetingId = await createMeeting();
      setMeetingId(newMeetingId);
      return newMeetingId;
    } catch (error) {
      console.error("Помилка створення мітингу:", error);
      throw error;
    }
  };

  const handleMeetingLeave = useCallback(() => {
    console.log("🔄 handleMeetingLeave called with callState:", callState);

    if (!currentCall) {
      console.warn("❌ No current call to handle");
      return;
    }

    // Викликаємо leave() локально через ref
    if (meetingViewRef.current?.triggerLeave) {
      console.log("✅ Calling triggerLeave from handleMeetingLeave");
      meetingViewRef.current.triggerLeave();
    }

    // Socket операції в залежності від стану
    if (callState === "calling") {
      socketService.cancelCall({
        meetingId: currentCall.meetingId,
        to: currentCall.to,
      });
    } else if (callState === "receiving") {
      socketService.rejectCall({
        meetingId: currentCall.meetingId,
        from: currentCall.from,
      });
    } else if (callState === "in-call") {
      socketService.endCall({
        meetingId: currentCall.meetingId,
        to: currentCall.to,
        from: currentUser,
      });
    }

    // Очищення стану
    setCallState("idle");
    setCurrentCall(null);
    setMeetingId("");
    setJoined(null);
  }, [callState, currentCall, currentUser]);

  const handleMakeCall = async (type, targetUserKey) => {
    if (!targetUserKey || !currentUser) return;

    try {
      const newMeetingId = await createNewMeeting();
      const targetUser = onlineUsers.find((u) => u.key === targetUserKey);

      if (!targetUser) {
        throw new Error("Користувач недоступний");
      }

      setCallState("calling");

      const callData = {
        to: targetUser.key,
        from: currentUser,
        targetUser: targetUser,
        meetingId: newMeetingId,
        type,
      };

      setCurrentCall(callData);
      socketService.initiateCall(callData);
    } catch (error) {
      console.error("Call error:", error);
      throw error;
    }
  };

  const acceptCall = () => {
    if (currentCall) {
      console.log("📞 Accepting call, transitioning to in-call state...");
      socketService.acceptCall({
        meetingId: currentCall.meetingId,
        from: currentCall.from,
      });
      // ✅ Користувач який приймає одразу переходить в стан in-call
      setCallState("in-call");
    }
  };

  // Socket management
  const initializeSocket = useCallback((userData) => {
    socketService.connect();

    socketService.on("connect", () => {
      console.log("🔌 WebSocket connected");
      setIsSocketConnected(true);
      socketService.registerUser(userData);
      socketService.getOnlineUsers();
    });

    socketService.on("disconnect", () => {
      setIsSocketConnected(false);
    });

    socketService.on("users-updated", (users) => {
      const uniqueUsers = users.reduce((acc, user) => {
        const existingIndex = acc.findIndex((u) => u.key === user.key);
        if (existingIndex >= 0) {
          acc[existingIndex] = user;
        } else {
          acc.push(user);
        }
        return acc;
      }, []);
      setOnlineUsers(uniqueUsers);
    });

    socketService.on("incoming-call", (callData) => {
      console.log("📞 Incoming call:", callData);
      setCurrentCall(callData);
      setCallState("receiving");
      setMeetingId(callData.meetingId);
    });

    socketService.on("call-accepted", () => {
      console.log("✅ Call accepted");
      setCallState("in-call");
    });

    socketService.on("call-rejected", () => {
      console.log("❌ Call rejected");
      setCallState("idle");
      setCurrentCall(null);
      setMeetingId("");
      setJoined(null);
    });

    socketService.on("call-cancelled", () => {
      console.log("🚫 Call cancelled");
      if (meetingViewRef.current?.triggerLeave) {
        meetingViewRef.current.triggerLeave();
      }
      setCallState("idle");
      setCurrentCall(null);
      setMeetingId("");
      setJoined(null);
    });

    socketService.on("call-ended", () => {
      console.log("📞 Call ended");
      if (meetingViewRef.current?.triggerLeave) {
        meetingViewRef.current.triggerLeave();
      }
      setCallState("idle");
      setCurrentCall(null);
      setMeetingId("");
      setJoined(null);
    });
  }, []);

  // Context value
  const value = {
    // States
    meetingId,
    callState,
    currentCall,
    joined,
    currentUser,
    selectedUser,
    onlineUsers,
    isSocketConnected,
    initialMicOn,

    // Actions
    createNewMeeting,
    handleMeetingLeave,
    handleMakeCall,
    acceptCall,
    initializeSocket,

    // Setters
    setCurrentUser,
    setSelectedUser,
    setJoined,
    setInitialMicOn,

    // Refs
    meetingViewRef,
  };

  return (
    <VideoSDKContext.Provider value={value}>
      {meetingId ? (
        <MeetingProvider
          config={{
            meetingId,
            micEnabled: initialMicOn,
            webcamEnabled: false,
            name: currentUser?.name || "User",
          }}
          token={authToken}
        >
          <MeetingConsumer>{() => children}</MeetingConsumer>
        </MeetingProvider>
      ) : (
        children
      )}
    </VideoSDKContext.Provider>
  );
};
