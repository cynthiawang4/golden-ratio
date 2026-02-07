import { Route, Routes } from "react-router-dom";
import MainPage from "./pages/main/MainPage";

export default function App() {
  return (
    <Routes>
      <Route path="" element={<MainPage />} />
    </Routes>
  );
}
