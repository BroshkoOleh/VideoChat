import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useVideoSDK } from "../../context/VideoSDKContext";
import socketService from "../../utils/socket";
import styles from "./Home.module.scss";

const Home = () => {
  const navigate = useNavigate();

  // Використовуємо централізований VideoSDK контекст
  const {
    // States
    currentUser,
    selectedUser,
    callState,
    onlineUsers,
    isSocketConnected,

    // Actions
    handleMakeCall,
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

  const onMakeCall = async (type) => {
    try {
      await handleMakeCall(type, selectedUser);
    } catch (error) {
      alert("Помилка при створенні дзвінка");
    }
  };

  if (!currentUser) {
    return <div className={styles.loading}>Завантаження...</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>
            <img src={currentUser.avatar} alt={currentUser.name} />
            <span className={styles.statusIndicator}></span>
          </div>
          <div className={styles.userDetails}>
            <h2>{currentUser.name}</h2>
            <p className={styles.status}>
              {isSocketConnected ? "🟢 Онлайн" : "🔴 Офлайн"}
            </p>
          </div>
        </div>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Вийти
        </button>
      </header>

      <main className={styles.main}>
        {callState === "idle" && (
          <div className={styles.callSection}>
            <h3>Користувачі онлайн ({onlineUsers.length})</h3>

            {availableUsers.length > 0 ? (
              <>
                <div className={styles.userSelector}>
                  <label htmlFor="user-select">Дзвонити до:</label>
                  <select
                    id="user-select"
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className={styles.selectUser}
                  >
                    {availableUsers.map((user) => (
                      <option key={user.socketId} value={user.key}>
                        {user.name} ({user.status})
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.callButtons}>
                  <button
                    onClick={() => onMakeCall("audio")}
                    className={`${styles.callBtn} ${styles.audioCall}`}
                  >
                    📞 Аудіо дзвінок
                  </button>
                  <button
                    onClick={() => onMakeCall("video")}
                    className={`${styles.callBtn} ${styles.videoCall}`}
                  >
                    📹 Відео дзвінок
                  </button>
                </div>
              </>
            ) : (
              <p className={styles.noUsers}>Немає доступних користувачів</p>
            )}

            <div className={styles.onlineUsers}>
              <h4>Онлайн користувачі:</h4>
              <ul>
                {onlineUsers.map((user) => (
                  <li
                    key={user.socketId || user.key}
                    className={styles.onlineUser}
                  >
                    <span className={styles.userIndicator}>🟢</span>
                    {user.name}
                    {user.key === currentUser.key && " (ви)"}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
