import { Routes, Route } from 'react-router-dom'

import ChoiceList from "./components/ChoiceList";
import VoteForm from "./components/VoteForm";
import Header from './components/Header';
import PollList from './components/PollList';
import LoginPage from './components/LoginPage';

export default function App() {
  return (
    <div className="container">
      <Header />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <h1>Golden Ratio</h1>
              <p>
                Create choices, cast numeric votes (0-10), and the highest average wins.
              </p>
              <PollList />
              <ChoiceList />
              <VoteForm />
            </>
          }
        />
      
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  );
}
