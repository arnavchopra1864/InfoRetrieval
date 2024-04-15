// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import LoginPage from './components/LoginPage';
import QueryPage from './components/QueryPage';
import './App.css';

function App() {
  return (
    // <Router>
    //   <div className="App">
    //     <Header />
    //     <main>
    //       <Routes>
    //         <Route path="/" exact>
    //           {/* Your main page content */}
    //         </Route>
    //         <Route path="/login" exact component={LoginPage} />
    //         {/* Define other routes here */}
    //       </Routes>
    //       <p>Welcome to Fact Flow! This is our landing page.</p>
    //     </main>
    //   </div>
    // </Router>
    <main>
      <QueryPage />
    </main>
  );
}

export default App;

