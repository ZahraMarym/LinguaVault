import React from 'react';
import './DIsplayRecordModal.css';
import userIcon from "../../icons/userIcon.png";

const DisplayRecordModal = ({ isOpen, onClose, record }) => {
    if (!isOpen || !record) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-button" onClick={onClose}>X</button>
                <h2>{record.name || "File Name"}</h2>
                <h2>CNIC : {record.cnic || "File Name"}</h2>
                <h2>Address : {record.address || "File Name"}</h2>

                <img
                    src={record.image || userIcon}
                    alt={record.name || "Audio"}
                    className="modal-image"
                />
                <h3>All Audios</h3>


                {/* Display Other Audios */}
                {record.audios && record.audios.length > 0 && (
                    <div className="modal-other-audios">
                        <h3>Other Audios</h3>
                        {record.audios.map((audio, index) => (
                            <audio key={index} controls className="modal-other-audio-player">
                                <p>{audio}</p>
                                <source
                                    src={`http://localhost:5000/${audio}`}
                                    type="audio/wav"
                                />
                                Your browser does not support the audio element.
                            </audio>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DisplayRecordModal;
