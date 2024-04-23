// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import LoginPage from './components/LoginPage';
import QueryPage from './components/QueryPage';
import QueryChatPage from './components/QueryChatPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<p>Welcome to Fact Flow! This is our landing page.</p>}>
              {/* Your main page content */}
            </Route>
            <Route path="/login" element={<LoginPage/>} />
            <Route path="/query" element={<QueryPage/>} />
            <Route path="/chat" element={<QueryChatPage/>} />
          </Routes>
          
        </main>
      </div>
    </Router>
    // <main>
    //   <QueryPage />
    // </main>
    // <main>
    //   <LoginPage />
    // </main>
  );
}

export default App;

