import React, { useState } from "react";
import axios from "axios";
import "./transcription.css";
import "./topmatches.css";
import userIcon from "../../../icons/userIcon.png";
import DisplayRecordModal from "../../displayRecord/DisplayRecordModal";

const TranscriptionAndTranslation = () => {
  const [transcription, setTranscription] = useState("");
  const [translation, setTranslation] = useState("");
  const [loadingTranscription, setLoadingTranscription] = useState(false);
  const [loadingTranslation, setLoadingTranslation] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [topMatches, setTopMatches] = useState([]);
  const [recordsMatches, setRecordMatches] = useState([]);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingMatch, setLoadingMatch] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Handle file selection
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setSelectedFile(file);
      setLoadingUpload(true);

      try {
        // Simulate file upload
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // After upload is complete
        setLoadingUpload(false);
      } catch (error) {
        console.error("Error uploading file:", error);
        setLoadingUpload(false);
      }
    }
    setLoadingUpload(false);

  };

  // Function to handle transcription
  const handleTranscribe = async () => {
    if (!selectedFile) {
      console.error("No file selected");
      return;
    }

    setLoadingTranslation(true);
    try {
      const formData = new FormData();
      formData.append("audio", selectedFile);

      // Call the transcription API
      const response = await axios.post(
        "http://localhost:5000/transcribe",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setTranscription(response.data.transcription);
    } catch (error) {
      console.error("Error during transcription:", error);
      alert(
        "Transcription failed. Please check the server logs for more details."
      );
    } finally {
      setLoadingTranslation(false);
    }
  };

  // Function to handle translation
  const handleTranslate = async () => {
    if (!transcription) {
      console.error("No transcription available");
      return;
    }

    setLoadingTranslation(true);
    try {
      const response = await axios.post("http://localhost:5000/translate", {
        text: transcription,
      });

      setTranslation(response.data.translation);
    } catch (error) {
      console.error("Error translating text:", error);
      alert(
        "Translation failed. Please check the server logs for more details."
      );
    } finally {
      setLoadingTranslation(false);
    }
  };

  // Function to handle matching audio
  const handleMatchAudio = async () => {
    if (!selectedFile) {
      console.error("No file selected");
      return;
    }

    setLoadingMatch(true);
    try {
      const formData = new FormData();
      formData.append("audio", selectedFile);

      // Call the audio matching API
      const matchResponse = await axios.post(
        "http://localhost:5000/user/match",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const topMatches = matchResponse.data; // Assuming the response contains an array of top matches
      setTopMatches(topMatches);
      console.log(topMatches[0].file);

      // Fetch the records for the matched audios
      const recordsPromises = topMatches.map((match) =>
        axios.get(
          `http://localhost:5000/records/getRecordByAudio/${match.file}`
        )
      );

      const recordsResponses = await Promise.all(recordsPromises);
      console.log(recordsResponses);
      const records = recordsResponses.map((response) => response.data);

      // Update the state with the fetched records
      console.log(records);
      setRecordMatches(records);
    } catch (error) {
      console.error("Error during audio matching:", error);
      alert(
        "Audio matching failed. Please check the server logs for more details."
      );
    } finally {
      setLoadingMatch(false);
    }
  };

  const openModal = (record) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
  };


  return (
    <div className="MainComponent">
      <div className="drag-and-drop">
        <p>{fileName || "Upload File Here!"}</p>
        <input type="file" id="fileUpload" onChange={handleFileChange} hidden />
        <label htmlFor="fileUpload" className="upload-button">
          Upload
        </label>
        {(loadingUpload || loadingTranscription) && (
        <div className="loading-bar"></div>
      )}      </div>
      <div className="matchAndTrans">
        <div className="matching-audios">
          <h2>Top 5 Matching Audios</h2>
          <div className="audio-list">
            {recordsMatches && recordsMatches.length > 0 ? (
              recordsMatches.map((record, index) => (
                <div className="audio-card" key={index}>
                  <img
                    src={record.image || userIcon} // Fallback image
                    alt={record.name || "Audio"}
                    className="audio-image"
                  />
                  <div className="audio-info">
                    <h3>{record.name || "File Name"}</h3>
                    <p>
                      {topMatches[index]
                        ? topMatches[index].file
                        : "No file available"}
                    </p>
                  </div>
                  <audio controls className="audio-player">
                    <source
                      src={
                        topMatches[index]
                          ? `http://localhost:5000/${record.audios[0]}`
                          : ""
                      }
                      type="audio/wav"
                    />
                    Your browser does not support the audio element.
                  </audio>
                  <button
                    className="view-more-button"
                    onClick={() => openModal(record)}
                  >
                    View more
                  </button>{" "}
                </div>
              ))
            ) : (
              <div className="no-matches">
                <p>No matches found.</p>
              </div>
            )}
          </div>
          <button
            onClick={handleMatchAudio}
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#4b56b9",
              borderRadius: "5px",
              cursor: "pointer",
              position: "relative",
            }}
            disabled={loadingMatch || !selectedFile}
          >
            {loadingMatch ? "Matching..." : "Match Audio"}
          </button>
        </div>
        <div className="transcription-main">
          <div>
            <h2 className="texttran" style={{ color: "#ffff" }}>
              Transcription
            </h2>
            <textarea
              value={transcription}
              onChange={(e) => setTranscription(e.target.value)}
              rows="10"
              cols="50"
              style={{
                width: "100%",
                fontSize: "15px",
                padding: "10px",
                boxSizing: "border-box",
              }}
              readOnly
            />

            <button
              style={{
                marginTop: "10px",
                padding: "10px 20px",
                fontSize: "16px",
                backgroundColor: "#4b56b9",
                borderRadius: "5px",
                cursor: "pointer",
                position: "relative",
              }}
              onClick={handleTranscribe}
              disabled={loadingTranscription || !selectedFile}
            >
              {loadingTranscription ? "Transcribing..." : "Transcribe"}
            </button>

            <h2 style={{ color: "#ffff" }}>Translation</h2>
            <textarea
              value={translation}
              readOnly
              rows="10"
              cols="50"
              style={{
                width: "100%",
                fontSize: "20px",
                fontWeight: 500,
                padding: "10px",
                boxSizing: "border-box",
              }}
            />

            <button
              onClick={handleTranslate}
              style={{
                marginTop: "10px",
                padding: "10px 20px",
                fontSize: "16px",
                backgroundColor: "#4b56b9",
                borderRadius: "5px",
                cursor: "pointer",
                position: "relative",
              }}
              disabled={loadingTranslation || !transcription}
            >
              {loadingTranslation ? "Translating..." : "Translate"}
            </button>

            {(loadingTranscription || loadingTranslation || loadingMatch) && (
              <div className="progress-bar" style={{ marginTop: "20px" }}>
                <div
                  className="progress"
                  style={{
                    width: "100%",
                    height: "8px",
                    backgroundColor: "#f3f3f3",
                  }}
                >
                  <div
                    className="progress-fill"
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "#4b56b9",
                      animation: "progressAnimation 2s infinite",
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <DisplayRecordModal isOpen={isModalOpen} onClose={closeModal} record={selectedRecord} />
      </div>
    </div>
  );
};

export default TranscriptionAndTranslation;
