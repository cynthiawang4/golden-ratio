import { Route, Routes } from "react-router-dom";
import MainPage from "./pages/main/MainPage";
import ThemeWrapper from "./components/Theme";
import HostPage from "./pages/host/HostPage";
import LoginPage from "./pages/login/LoginPage";
import SignupPage from "./pages/signup/SignupPage";
import ProfilePage from "./pages/profile/ProfilePage";
import RoomPage from "./pages/room/RoomPage";
import DashboardPage from "./pages/dashboard/DashboardPage";

export default function App() {
  return (
    <ThemeWrapper>
      <Routes>
        {/* Basic Pages */}
        <Route path="/" element={<MainPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/host" element={<HostPage />} />
        <Route
          path="/room/:roomId"
          element={<RoomPage />}
        />
      </Routes>
    </ThemeWrapper>
  );
}
