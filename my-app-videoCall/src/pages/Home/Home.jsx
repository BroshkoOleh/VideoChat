import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useVideoSDK } from "../../context/VideoSDKContext";
import socketService from "../../utils/socket";
import styles from "./Home.module.scss";
import Header from "../../components/Header/Header";
import MainContent from "../../components/MainContent/MainContent";

const Home = () => {
  const navigate = useNavigate();

  // Використовуємо централізований VideoSDK контекст
  const {
    // States
    currentUser,
    selectedUser,
    onlineUsers,
    isSocketConnected,

    // Actions

    initializeSocket,

    // Setters
    setCurrentUser,
    setSelectedUser,
  } = useVideoSDK();

  // Authentication check
  useEffect(() => {
    const authData = localStorage.getItem("videocall-auth");
    if (!authData) {
      navigate("/login");
      return;
    }

    try {
      const userData = JSON.parse(authData);
      setCurrentUser(userData);

      // Connect to WebSocket через контекст
      initializeSocket(userData);
    } catch (error) {
      console.error("Auth error:", error);
      navigate("/login");
    }
  }, [navigate, setCurrentUser, initializeSocket]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      socketService.disconnect();
    };
  }, []);

  // Filter available users (exclude current user)
  const availableUsers = onlineUsers.filter(
    (user) => user.key !== currentUser?.key
  );

  // Auto-select first available user
  useEffect(() => {
    if (availableUsers.length > 0 && !selectedUser) {
      setSelectedUser(availableUsers[0].key);
    }
  }, [availableUsers, selectedUser, setSelectedUser]);

  const handleLogout = () => {
    localStorage.removeItem("videocall-auth");
    socketService.disconnect();

    // Dispatch custom event for auth sync
    window.dispatchEvent(new CustomEvent("auth-change"));
    navigate("/login");
  };

  if (!currentUser) {
    return <div className={styles.loading}>Завантаження...</div>;
  }

  return (
    <div className={styles.container}>
      <Header
        currentUser={currentUser}
        isSocketConnected={isSocketConnected}
        handleLogout={handleLogout}
      />

      <MainContent
        onlineUsers={onlineUsers}
        availableUsers={availableUsers}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        currentUser={currentUser}
      />
    </div>
  );
};

export default Home;
