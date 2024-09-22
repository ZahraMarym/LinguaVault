import React, { useState } from 'react';
import './AddRecord.css';

const AddRecordModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [cnic, setCnic] = useState('');
  const [address, setAddress] = useState('');
  const [audios, setAudios] = useState([]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create form data to send to the backend
    const formData = new FormData();
    formData.append('name', name);
    formData.append('cnic', cnic);
    formData.append('address', address);
    for (let i = 0; i < audios.length; i++) {
      formData.append('audios', audios[i]);
    }

    try {
      const response = await fetch('http://localhost:5000/records/addRecord', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Clear the form after successful submission
        clearForm();
        onClose();
        alert('Record Added Successfully!!');

      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to add record!');
      }
    } catch (error) {
      alert('An error occurred while adding the record.');
    }
  };

  const handleFileChange = (e) => {
    setAudios(Array.from(e.target.files));
  };

  const clearForm = () => {
    setName('');
    setCnic('');
    setAddress('');
    setAudios([]);
  };

  const handleClose = () => {
    clearForm();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Add New Record</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>CNIC</label>
            <input
              type="text"
              value={cnic}
              onChange={(e) => setCnic(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Audios</label>
            <input
              type="file"
              onChange={handleFileChange}
              multiple
              accept="audio/*"
            />
            <div className="audio-preview-container">
              {audios.map((audio, index) => (
                <div key={index} className="audio-preview">
                  {audio.name}
                </div>
              ))}
            </div>
          </div>
          <button type="submit" className="submit-button">Add Record</button>
        </form>
        <button className="close-button" onClick={handleClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default AddRecordModal;
