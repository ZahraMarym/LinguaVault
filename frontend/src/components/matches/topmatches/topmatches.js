// import React from 'react';
// import './topmatches.css'; // Assuming you have a separate CSS file for styling

// function MatchingAudios({ audios = [], clickHandler }) {
//   return (
//     <div className="matching-audios">
//       <h2>Top 5 Matching Audios</h2>
//       <div className="audio-list">
//         {audios.slice(0, 5).map((audio, index) => (
//           <div className="audio-card" key={index}>
//             <img
//               src={audio.image || '/images/default_profile.png'} // Fallback image
//               alt={audio.name || 'Audio'}
//               className="audio-image"
//             />
//             <div className="audio-info">
//               <h3>{audio.name || 'File Name'}</h3>
//               <p>Voice Note</p>
//             </div>
//             <button className="view-more-button" onClick={clickHandler} >View more</button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default MatchingAudios;
