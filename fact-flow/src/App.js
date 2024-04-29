import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import LoginPage from "./components/LoginPage";
import QueryPage from "./components/QueryPage";
import QueryChatPage from "./components/QueryChatPage";
import SignUpPage from "./components/SignUpPage";
import { ChakraProvider } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import theme from "./theme";
import NavBar from "./components/NavBar";
// import "./App.css";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Box background={"gray.100"} minH={"100vh"}>
          <Routes>
            <Route path="/" element={<Navigate to="/query" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/query" element={<QueryPage />} />
            <Route path="/chat" element={<QueryChatPage />} />
            <Route path="/signup" element={<SignUpPage />} />
          </Routes>
        </Box>
      </Router>
    </ChakraProvider>
  );
}

export default App;
