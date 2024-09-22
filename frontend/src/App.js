import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/header/header";
import DragAndDrop from "./components/upload/upload";
import "./App.css"; // Import the CSS for the App component
import PersonDetail from "./components/matches/detail/detail";
import MatchingAudios from "./components/matches/topmatches/topmatches";
import TranscriptionAndTranslation from "./components/matches/transcription/transcription.js";
import SignUp from "./components/signup/signin.js";
import SignIn from "./components/signup/login.js";
import AddRecordModal from "./components/addRecord/AddRecord.js"; // Import the modal

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // For authentication state
  const [isModalOpen, setIsModalOpen] = useState(false); // For modal state

  const handleLogin = (token) => {
    setIsAuthenticated(true);
    // Store the token in local storage
    localStorage.setItem("token", token);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    // Clear the token from local storage
    localStorage.removeItem("token");
  };

  const handleAddRecord = () => {
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  const person = {
    image: "/images/IMG-20240729-WA0003.jpg", // Path to the person's image
    name: "John Doe",
    cnic: "12345-6789012-3",
    address: "1234 Elm Street, Springfield, IL",
    voiceLinks: [
      "https://example.com/audio1.mp3",
      "https://example.com/audio2.mp3",
      "https://example.com/audio3.mp3",
    ],
  };

  const audios = [
    { image: "IMG-20240729-WA0003.jpg", name: "File Name 1" },
    { image: "IMG-20240729-WA0003.jpg", name: "File Name 2" },
    { image: "IMG-20240729-WA0003.jpg", name: "File Name 3" },
    { image: "IMG-20240729-WA0003.jpg", name: "File Name 4" },
    { image: "IMG-20240729-WA0003.jpg", name: "File Name 5" },
  ];

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Default route */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Route for login */}
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <SignIn onLogin={handleLogin} />
              )
            }
          />

          {/* Route for signup */}
          <Route
            path="/signup"
            element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <SignUp />
            }
          />

          {/* Route for dashboard */}
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <div>
                  <div className="Nav">
                    <Header />
                    <div className="buttons-container">
                      {isAuthenticated && (
                        <>
                          <button
                            onClick={handleAddRecord}
                            className="add-record-button"
                          >
                            Add Record
                          </button>

                          <button
                            onClick={handleLogout}
                            className="logout-button"
                          >
                            Logout
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="main-container">
                    <div className="transcription-and-translation">
                      <TranscriptionAndTranslation />
                    </div>
                  </div>
                  {/* Add the modal component here */}
                  <AddRecordModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                  />
                </div>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Route for person detail view */}
          <Route
            path="/person-detail"
            element={
              isAuthenticated ? (
                <PersonDetail person={person} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
