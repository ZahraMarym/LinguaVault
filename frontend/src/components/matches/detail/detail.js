import React from 'react';
import './detail.css'; // Assuming you have a separate CSS file for styling

function PersonDetail({ person = {} }) {
  return (
    <div className="person-detail">
      <div className="header-image">
        <img src="/images/img_header.png" alt="Header Background" />
      </div>
      <div className="person-info">
        <img
          src={person.image || '/images/IMG-20240729-WA0003.jpg'} // Fallback image
          alt={person.name || 'Unknown'}
          className="profile-image"
        />
        <h2>{person.name || 'Unknown Name'}</h2>
        <p>CNIC: {person.cnic || 'N/A'}</p>
        <p>Address: {person.address || 'N/A'}</p>
      </div>
      <table className="voice-links-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Links</th>
          </tr>
        </thead>
        <tbody>
          {person.voiceLinks?.map((link, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td><a href={link} target="_blank" rel="noopener noreferrer">Link for Audio</a></td>
            </tr>
          )) || (
            <tr>
              <td colSpan="2">No voice links available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PersonDetail;
