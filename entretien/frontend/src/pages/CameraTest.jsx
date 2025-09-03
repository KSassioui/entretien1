
// // frontend/src/pages/CameraTest.jsx
// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom"; // 🔹 Import pour navigation
// import Header from "../components/MinimalHeader";

// function CameraTest() {
//   const [devices, setDevices] = useState({
//     cameras: [],
//     microphones: [],
//     headsets: [],
//   });

//   const [selectedCamera, setSelectedCamera] = useState("");
//   const [selectedMicrophone, setSelectedMicrophone] = useState("");
//   const [selectedHeadset, setSelectedHeadset] = useState("");
//   const [error, setError] = useState("");
//   const [audioLevel, setAudioLevel] = useState(0);

//   const videoRef = useRef(null); // ✅ ref pour la caméra
//   const navigate = useNavigate(); // 🔹 initialiser la navigation

//   // 🔍 Récupérer les appareils disponibles
//   useEffect(() => {
//     const getDevices = async () => {
//       try {
//         const mediaDevices = await navigator.mediaDevices.enumerateDevices();
//         const cameras = mediaDevices.filter((d) => d.kind === "videoinput");
//         const microphones = mediaDevices.filter((d) => d.kind === "audioinput");
//         const headsets = mediaDevices.filter((d) => d.kind === "audiooutput");

//         setDevices({ cameras, microphones, headsets });

//         if (cameras.length > 0) setSelectedCamera(cameras[0].deviceId);
//         if (microphones.length > 0) setSelectedMicrophone(microphones[0].deviceId);
//         if (headsets.length > 0) setSelectedHeadset(headsets[0].deviceId);
//       } catch (err) {
//         setError("Impossible de détecter les périphériques : " + err.message);
//       }
//     };

//     getDevices();
//   }, []);

//   // 🎥 Lancer la caméra et mesurer le son
//   useEffect(() => {
//     let stream = null;
//     let audioContext = null;

//     const startVideo = async () => {
//       setError(""); 
//       if (!selectedCamera || !selectedMicrophone) {
//         setError("Veuillez sélectionner une caméra et un microphone.");
//         return;
//       }

//       try {
//         stream = await navigator.mediaDevices.getUserMedia({
//           video: { deviceId: selectedCamera },
//           audio: { deviceId: selectedMicrophone },
//         });

//         // ✅ Attacher le flux à la balise vidéo
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//         }

//         // 🔊 Analyser le niveau du micro
//         audioContext = new (window.AudioContext || window.webkitAudioContext)();
//         const analyser = audioContext.createAnalyser();
//         const source = audioContext.createMediaStreamSource(stream);
//         source.connect(analyser);

//         const bufferLength = analyser.frequencyBinCount;
//         const dataArray = new Uint8Array(bufferLength);

//         const updateAudioLevel = () => {
//           analyser.getByteFrequencyData(dataArray);
//           const average = dataArray.reduce((a, b) => a + b, 0) / bufferLength;
//           setAudioLevel(average);
//           requestAnimationFrame(updateAudioLevel);
//         };

//         updateAudioLevel();
//       } catch (err) {
//         console.error("Erreur caméra/micro :", err);
//         if (err.name === "NotAllowedError") {
//           setError("Accès refusé : autorise la caméra et le micro.");
//         } else if (err.name === "NotFoundError") {
//           setError("Aucune caméra ou micro trouvée.");
//         } else if (err.name === "NotReadableError") {
//           setError("La caméra est utilisée par une autre app (ex: Zoom).");
//         } else {
//           setError("Erreur : " + err.message);
//         }
//       }
//     };

//     startVideo();

//     return () => {
//       if (stream) stream.getTracks().forEach((t) => t.stop());
//       if (audioContext) audioContext.close();
//     };
//   }, [selectedCamera, selectedMicrophone]);

//   const isReady = audioLevel > 10;

//   // 🔹 Démarrer l'entretien avec redirection
//   const handleStartInterview = () => {
//     if (!isReady) {
//       alert("Vérifie que ta caméra et ton micro fonctionnent avant de commencer.");
//       return;
//     }

//     // 🔹 Redirection vers la page d'entretien avec un lien unique fictif
//     const fakeLink = "123e4567-e89b-12d3-a456-426614174000";
//     navigate(`/interview/${fakeLink}`);
//   };

//   return (
//     <div className="camera-test-page">
//       <Header />
//       <div className="test-container">
//         {/* === Prévisualisation vidéo === */}
//         <div className="video-preview">
//           <div className="video-frame">
//             <video
//               ref={videoRef}
//               autoPlay
//               muted
//               playsInline
//               width="100%"
//               height="100%"
//               style={{ objectFit: "cover" }}
//             />
//             <div className="rec-dot">🔴</div>
//             <div className="audio-level-meter">
//               <div
//                 className="audio-level-bar"
//                 style={{ width: `${(audioLevel / 255) * 100}%` }}
//               ></div>
//             </div>
//             {error && <div className="error-message">{error}</div>}
//           </div>
//         </div>

//         {/* === Contrôles === */}
//         <div className="controls">
//           <h2>Test Audio & Vidéo</h2>

//           <div className="dropdown-group">
//             <label htmlFor="camera">Caméra</label>
//             <select
//               id="camera"
//               value={selectedCamera}
//               onChange={(e) => setSelectedCamera(e.target.value)}
//             >
//               {devices.cameras.map((cam, idx) => (
//                 <option key={cam.deviceId} value={cam.deviceId}>
//                   {cam.label || `Caméra ${idx + 1}`}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="dropdown-group">
//             <label htmlFor="microphone">Microphone</label>
//             <select
//               id="microphone"
//               value={selectedMicrophone}
//               onChange={(e) => setSelectedMicrophone(e.target.value)}
//             >
//               {devices.microphones.map((mic, idx) => (
//                 <option key={mic.deviceId} value={mic.deviceId}>
//                   {mic.label || `Micro ${idx + 1}`}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="dropdown-group">
//             <label htmlFor="headset">Casque (optionnel)</label>
//             <select
//               id="headset"
//               value={selectedHeadset}
//               onChange={(e) => setSelectedHeadset(e.target.value)}
//             >
//               {devices.headsets.length > 0 ? (
//                 devices.headsets.map((hs, idx) => (
//                   <option key={hs.deviceId} value={hs.deviceId}>
//                     {hs.label || `Casque ${idx + 1}`}
//                   </option>
//                 ))
//               ) : (
//                 <option value="">Aucun casque détecté</option>
//               )}
//             </select>
//           </div>

//           <div className="dropdown-group">
//             <label>Tester le casque</label>
//             <button
//               className="test-headset-btn"
//               onClick={() => {
//                 const audio = new Audio(
//                   "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3"
//                 );
//                 audio.play().catch(() => alert("Impossible de jouer le son."));
//               }}
//             >
//               🔊 Écouter un test son
//             </button>
//           </div>

//           {isReady && (
//             <div className="success-message">
//               ✅ Caméra et micro OK ! Tu es prêt(e) pour l’interview.
//             </div>
//           )}

//           <button
//             className="start-interview-btn"
//             onClick={handleStartInterview}
//             disabled={!isReady}
//           >
//             Commencer l’Interview
//           </button>
//         </div>
//       </div>

//       {/* === Styles (inchangés) === */}
//       <style jsx>{`
//         .camera-test-page {
//           min-height: 100vh;
//           background-color: #f9fafb;
//           font-family: 'Inter', sans-serif;
//           color: #1f2937;
//           padding: 20px;
//         }
//         .test-container {
//           max-width: 1000px;
//           margin: 40px auto;
//           display: flex;
//           gap: 40px;
//           align-items: flex-start;
//         }
//         .video-preview {
//           flex: 1;
//           position: relative;
//         }
//         .video-frame {
//           width: 100%;
//           height: 300px;
//           background-color: #111;
//           border-radius: 12px;
//           overflow: hidden;
//           position: relative;
//           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
//         }
//         .rec-dot {
//           position: absolute;
//           top: 10px;
//           left: 10px;
//           width: 16px;
//           height: 16px;
//           background-color: red;
//           border-radius: 50%;
//           z-index: 10;
//         }
//         .audio-level-meter {
//           position: absolute;
//           bottom: 10px;
//           left: 10px;
//           width: calc(100% - 20px);
//           height: 6px;
//           background-color: #374151;
//           border-radius: 3px;
//           overflow: hidden;
//         }
//         .audio-level-bar {
//           height: 100%;
//           background-color: #10b981;
//           width: 0%;
//           transition: width 0.1s ease;
//         }
//         .error-message {
//           position: absolute;
//           bottom: 50px;
//           left: 10px;
//           right: 10px;
//           padding: 10px;
//           background-color: #fee2e2;
//           color: #b91c1c;
//           font-size: 13px;
//           border-radius: 6px;
//           text-align: center;
//         }
//         .controls {
//           flex: 1;
//           background-color: white;
//           padding: 30px;
//           border-radius: 16px;
//           box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
//           border: 1px solid #e5e7eb;
//         }
//         h2 {
//           font-size: 20px;
//           margin-bottom: 20px;
//           color: #374151;
//         }
//         .dropdown-group {
//           margin-bottom: 20px;
//         }
//         .dropdown-group label {
//           display: block;
//           margin-bottom: 8px;
//           font-size: 14px;
//           color: #6b7280;
//           font-weight: 500;
//         }
//         .dropdown-group select, .test-headset-btn {
//           width: 100%;
//           padding: 12px;
//           border: 1px solid #d1d5db;
//           border-radius: 8px;
//           font-size: 15px;
//           color: #374151;
//           background-color: white;
//           cursor: pointer;
//         }
//         .test-headset-btn {
//           background-color: #10b981;
//           color: white;
//           border: none;
//         }
//         .test-headset-btn:hover {
//           background-color: #059669;
//         }
//         .success-message {
//           margin: 20px 0;
//           padding: 14px;
//           background-color: #d1fae5;
//           color: #065f46;
//           font-size: 15px;
//           border-radius: 8px;
//           border: 1px solid #a7f3d0;
//           font-weight: 500;
//         }
//         .start-interview-btn {
//           width: 100%;
//           padding: 12px;
//           font-size: 16px;
//           font-weight: 600;
//           color: white;
//           background-color: #3b82f6;
//           border: none;
//           border-radius: 8px;
//           cursor: pointer;
//           transition: background-color 0.3s ease;
//           margin-top: 20px;
//         }
//         .start-interview-btn:hover:not(:disabled) {
//           background-color: #2563eb;
//         }
//         .start-interview-btn:disabled {
//           background-color: #d1d5db;
//           cursor: not-allowed;
//         }
//       `}</style>
//     </div>
//   );
// }

// export default CameraTest;





// frontend/src/pages/CameraTest.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/MinimalHeader";

function CameraTest() {
  const [devices, setDevices] = useState({
    cameras: [],
    microphones: [],
    headsets: [],
  });

  const [selectedCamera, setSelectedCamera] = useState("");
  const [selectedMicrophone, setSelectedMicrophone] = useState("");
  const [selectedHeadset, setSelectedHeadset] = useState("");
  const [error, setError] = useState("");
  const [audioLevel, setAudioLevel] = useState(0);

  const videoRef = useRef(null);
  const navigate = useNavigate();

  // 🔍 Récupère le uuid dès le début
  const urlParams = new URLSearchParams(window.location.search);
  const uuid = urlParams.get('uuid');

  // ✅ Hook 1 : Récupérer les appareils
  useEffect(() => {
    const getDevices = async () => {
      try {
        const mediaDevices = await navigator.mediaDevices.enumerateDevices();
        const cameras = mediaDevices.filter((d) => d.kind === "videoinput");
        const microphones = mediaDevices.filter((d) => d.kind === "audioinput");
        const headsets = mediaDevices.filter((d) => d.kind === "audiooutput");

        setDevices({ cameras, microphones, headsets });

        if (cameras.length > 0) setSelectedCamera(cameras[0].deviceId);
        if (microphones.length > 0) setSelectedMicrophone(microphones[0].deviceId);
        if (headsets.length > 0) setSelectedHeadset(headsets[0].deviceId);
      } catch (err) {
        setError("Impossible de détecter les périphériques : " + err.message);
      }
    };

    getDevices();
  }, []);

  // ✅ Hook 2 : Lancer la caméra et mesurer le son
  useEffect(() => {
    let stream = null;
    let audioContext = null;

    const startVideo = async () => {
      setError("");
      if (!selectedCamera || !selectedMicrophone) {
        setError("Veuillez sélectionner une caméra et un microphone.");
        return;
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: selectedCamera },
          audio: { deviceId: selectedMicrophone },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const updateAudioLevel = () => {
          analyser.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b, 0) / bufferLength;
          setAudioLevel(average);
          requestAnimationFrame(updateAudioLevel);
        };

        updateAudioLevel();
      } catch (err) {
        console.error("Erreur caméra/micro :", err);
        if (err.name === "NotAllowedError") {
          setError("Accès refusé : autorise la caméra et le micro.");
        } else if (err.name === "NotFoundError") {
          setError("Aucune caméra ou micro trouvée.");
        } else if (err.name === "NotReadableError") {
          setError("La caméra est utilisée par une autre app (ex: Zoom).");
        } else {
          setError("Erreur : " + err.message);
        }
      }
    };

    startVideo();

    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
      if (audioContext) audioContext.close();
    };
  }, [selectedCamera, selectedMicrophone]);

  // ✅ SEULEMENT MAINTENANT on vérifie le uuid
  if (!uuid) {
    return (
      <div className="camera-test-page">
        <Header />
        <div className="test-container">
          <h1>Erreur</h1>
          <p>UUID manquant. Impossible de commencer l'entretien.</p>
        </div>
      </div>
    );
  }

  const isReady = audioLevel > 10;

  const handleStartInterview = () => {
    if (!isReady) {
      alert("Vérifie que ta caméra et ton micro fonctionnent avant de commencer.");
      return;
    }

    navigate(`/interview/${uuid}`);
  };

  return (
    <div className="camera-test-page">
      <Header />
      <div className="test-container">
        {/* === Prévisualisation vidéo === */}
        <div className="video-preview">
          <div className="video-frame">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              width="100%"
              height="100%"
              style={{ objectFit: "cover" }}
            />
            <div className="rec-dot">🔴</div>
            <div className="audio-level-meter">
              <div
                className="audio-level-bar"
                style={{ width: `${(audioLevel / 255) * 100}%` }}
              ></div>
            </div>
            {error && <div className="error-message">{error}</div>}
          </div>
        </div>

        {/* === Contrôles === */}
        <div className="controls">
          <h2>Test Audio & Vidéo</h2>

          <div className="dropdown-group">
            <label htmlFor="camera">Caméra</label>
            <select
              id="camera"
              value={selectedCamera}
              onChange={(e) => setSelectedCamera(e.target.value)}
            >
              {devices.cameras.map((cam, idx) => (
                <option key={cam.deviceId} value={cam.deviceId}>
                  {cam.label || `Caméra ${idx + 1}`}
                </option>
              ))}
            </select>
          </div>

          <div className="dropdown-group">
            <label htmlFor="microphone">Microphone</label>
            <select
              id="microphone"
              value={selectedMicrophone}
              onChange={(e) => setSelectedMicrophone(e.target.value)}
            >
              {devices.microphones.map((mic, idx) => (
                <option key={mic.deviceId} value={mic.deviceId}>
                  {mic.label || `Micro ${idx + 1}`}
                </option>
              ))}
            </select>
          </div>

          <div className="dropdown-group">
            <label htmlFor="headset">Casque (optionnel)</label>
            <select
              id="headset"
              value={selectedHeadset}
              onChange={(e) => setSelectedHeadset(e.target.value)}
            >
              {devices.headsets.length > 0 ? (
                devices.headsets.map((hs, idx) => (
                  <option key={hs.deviceId} value={hs.deviceId}>
                    {hs.label || `Casque ${idx + 1}`}
                  </option>
                ))
              ) : (
                <option value="">Aucun casque détecté</option>
              )}
            </select>
          </div>

          <div className="dropdown-group">
            <label>Tester le casque</label>
            <button
              className="test-headset-btn"
              onClick={() => {
                const audio = new Audio(
                  "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3"
                );
                audio.play().catch(() => alert("Impossible de jouer le son."));
              }}
            >
              🔊 Écouter un test son
            </button>
          </div>

          {isReady && (
            <div className="success-message">
              ✅ Caméra et micro OK ! Tu es prêt(e) pour l’interview.
            </div>
          )}

          <button
            className="start-interview-btn"
            onClick={handleStartInterview}
            disabled={!isReady}
          >
            Commencer l’Interview
          </button>
        </div>
      </div>

      <style jsx>{`
        .camera-test-page {
          min-height: 100vh;
          background-color: #f9fafb;
          font-family: 'Inter', sans-serif;
          color: #1f2937;
          padding: 20px;
        }
        .test-container {
          max-width: 1000px;
          margin: 40px auto;
          display: flex;
          gap: 40px;
          align-items: flex-start;
        }
        .video-preview {
          flex: 1;
          position: relative;
        }
        .video-frame {
          width: 100%;
          height: 300px;
          background-color: #111;
          border-radius: 12px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .rec-dot {
          position: absolute;
          top: 10px;
          left: 10px;
          width: 16px;
          height: 16px;
          background-color: red;
          border-radius: 50%;
          z-index: 10;
        }
        .audio-level-meter {
          position: absolute;
          bottom: 10px;
          left: 10px;
          width: calc(100% - 20px);
          height: 6px;
          background-color: #374151;
          border-radius: 3px;
          overflow: hidden;
        }
        .audio-level-bar {
          height: 100%;
          background-color: #10b981;
          width: 0%;
          transition: width 0.1s ease;
        }
        .error-message {
          position: absolute;
          bottom: 50px;
          left: 10px;
          right: 10px;
          padding: 10px;
          background-color: #fee2e2;
          color: #b91c1c;
          font-size: 13px;
          border-radius: 6px;
          text-align: center;
        }
        .controls {
          flex: 1;
          background-color: white;
          padding: 30px;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
          border: 1px solid #e5e7eb;
        }
        h2 {
          font-size: 20px;
          margin-bottom: 20px;
          color: #374151;
        }
        .dropdown-group {
          margin-bottom: 20px;
        }
        .dropdown-group label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
        }
        .dropdown-group select, .test-headset-btn {
          width: 100%;
          padding: 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 15px;
          color: #374151;
          background-color: white;
          cursor: pointer;
        }
        .test-headset-btn {
          background-color: #10b981;
          color: white;
          border: none;
        }
        .test-headset-btn:hover {
          background-color: #059669;
        }
        .success-message {
          margin: 20px 0;
          padding: 14px;
          background-color: #d1fae5;
          color: #065f46;
          font-size: 15px;
          border-radius: 8px;
          border: 1px solid #a7f3d0;
          font-weight: 500;
        }
        .start-interview-btn {
          width: 100%;
          padding: 12px;
          font-size: 16px;
          font-weight: 600;
          color: white;
          background-color: #3b82f6;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s ease;
          margin-top: 20px;
        }
        .start-interview-btn:hover:not(:disabled) {
          background-color: #2563eb;
        }
        .start-interview-btn:disabled {
          background-color: #d1d5db;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

export default CameraTest;