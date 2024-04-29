import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import LoginPage from './components/LoginPage';
import QueryPage from './components/QueryPage';
import QueryChatPage from './components/QueryChatPage';
import SignUpPage from "./components/SignUpPage";
import LandingPage from "./components/LandingPage";
import './App.css';

function App() {
  // comment
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/query" />} />
            {/* <Route path="/" element={<LandingPage />} /> */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/query" element={<QueryPage />} />
            <Route path="/chat" element={<QueryChatPage />} />
            <Route path="/signup" element={<SignUpPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
