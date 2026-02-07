import { Route, Routes } from "react-router-dom";
import MainPage from "./pages/main/MainPage";
import ThemeWrapper from "./components/Theme";
import HostPage from "./pages/host/HostPage";
import JoinPage from "./pages/join/JoinPage";
import LoginPage from "./components/LoginPage";
import CreateChoicePage from "./pages/choice/CreateChoicePage";

export default function App() {
  return (
    <ThemeWrapper>
      <Routes>
        <Route path="" element={<MainPage />} />
        <Route path="/host" element={<HostPage />} />
        <Route path="/join" element={<JoinPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/choice/:roomId" element={<CreateChoicePage />} />
      </Routes>
    </ThemeWrapper>
  );
}
