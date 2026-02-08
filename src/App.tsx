import { Route, Routes } from "react-router-dom";
import MainPage from "./pages/main/MainPage";
import ThemeWrapper from "./components/Theme";
import HostPage from "./pages/host/HostPage";
import LoginPage from "./pages/login/LoginPage";
import SignupPage from "./pages/signup/SignupPage";
import ProfilePage from "./pages/profile/ProfilePage";
import SharePage from "./pages/share/SharePage";
import CreateChoicePage from "./pages/choice/CreateChoicePage";
import RoomPage from "./pages/room/RoomPage";
import RankingPage from "./pages/ranking/Ranking";
import ResultsPage from "./pages/results/ResultsPage";
import ThanksVotePage from "./pages/thanks-vote/ThanksVote";

export default function App() {
  return (
    <ThemeWrapper>
      <Routes>
        <Route path="" element={<MainPage />} />
        <Route path="/host" element={<HostPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/room/:roomId" element={<RoomPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/share/:roomId" element={<SharePage />} />
        <Route path="/choice/:roomId" element={<CreateChoicePage />} />
        <Route path="/voted/:roomId" element={<ThanksVotePage />} />

        <Route path="/ranking/:roomId" element={<RankingPage />} />
        <Route path="/results/:roomId" element={<ResultsPage />} />
      </Routes>
    </ThemeWrapper>
  );
}
