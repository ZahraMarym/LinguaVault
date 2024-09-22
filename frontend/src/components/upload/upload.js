import React, { useState } from 'react';
import './upload.css';

function DragAndDrop({ onFileUpload }) { // Ensure the prop is destructured correctly
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    setLoading(true);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setFileName(files[0].name);
      if (typeof onFileUpload === 'function') {
        onFileUpload(files[0]); // Ensure onFileUpload is a function
      } else {
        console.error('onFileUpload is not a function');
      }
    }
    setLoading(false);
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      setFileName(files[0].name);
      if (typeof onFileUpload === 'function') {
        onFileUpload(files[0]); // Ensure onFileUpload is a function
      } else {
        console.error('onFileUpload is not a function');
      }
    }
    setLoading(true);
    setLoading(false);
  };

  return (
    <div className="drag-and-drop">
      <div
        className={`drop-area ${dragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <p>{fileName || 'Drag & drop files here'}</p>
        <input type="file" id="fileUpload" onChange={handleFileChange} hidden />
        <label htmlFor="fileUpload" className="upload-button">
          Upload
        </label>
      </div>
      {loading && <div className="loading-bar"></div>}
    </div>
  );
}

export default DragAndDrop;
