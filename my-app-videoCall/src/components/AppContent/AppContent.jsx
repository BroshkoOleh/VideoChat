import React from "react";
import AppRoutes from "../../AppRouters";
import GlobalModalContainer from "../GlobalModalContainer/GlobalModalContainer";

function AppContent() {
  // Перевіряємо чи користувач авторизований
  const isAuthenticated = !!localStorage.getItem("videocall-auth");

  return (
    <>
      {/* Основні маршрути */}
      <AppRoutes />

      {/* Глобальне модальне вікно дзвінків - працює на всіх сторінках */}
      {isAuthenticated && <GlobalModalContainer />}
    </>
  );
}

export default AppContent;
