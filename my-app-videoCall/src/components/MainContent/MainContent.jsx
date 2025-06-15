import React from "react";
import styles from "./MainContent.module.scss";
import CallButtons from "../CallButtons/CallButtons";

export default function MainContent({
  onlineUsers,
  availableUsers,
  selectedUser,
  setSelectedUser,
  currentUser,
}) {
  return (
    <main className={styles.main}>
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

            <CallButtons selectedUser={selectedUser} />
          </>
        ) : (
          <p className={styles.noUsers}>Немає доступних користувачів</p>
        )}

        <div className={styles.onlineUsers}>
          <h4>Онлайн користувачі:</h4>
          <ul>
            {onlineUsers.map((user) => (
              <li key={user.socketId || user.key} className={styles.onlineUser}>
                <span className={styles.userIndicator}>🟢</span>
                {user.name}
                {user.key === currentUser.key && " (ви)"}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
