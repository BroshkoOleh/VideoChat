import React from "react";
import styles from "./CallButtons.module.scss";
import { useVideoSDK } from "../../context/VideoSDKContext";

export default function CallButtons({ selectedUser }) {
  const { handleMakeCall } = useVideoSDK();

  const onMakeCall = async (type) => {
    try {
      await handleMakeCall(type, selectedUser);
    } catch (error) {
      alert("Помилка при створенні дзвінка");
    }
  };

  return (
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
  );
}
