import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Screens/LandingPage';
import LoginPage from './Screens/LoginPage';
import SignupPage from './Screens/SignupPage';
import Chats from './Screens/Chats';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/chats" element={<Chats />} />
          {/* Add a catch-all route for 404 pages */}
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
