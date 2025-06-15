import React from "react";
import styles from "./Header.module.scss";

const Header = ({ currentUser, isSocketConnected, handleLogout }) => {
  return (
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
  );
};

export default Header;
