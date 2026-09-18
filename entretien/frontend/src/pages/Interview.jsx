
// import React, { useRef, useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import Header from "../components/MinimalHeader";
// import "./Interview.css";

// const API = process.env.REACT_APP_API_URL; // ex: http://localhost:8000/api

// function Interview() {
//   const { uuid } = useParams();
//   const videoRef = useRef(null);
//   const mediaRecorderRef = useRef(null);

//   const [stream, setStream] = useState(null);
//   const [questions, setQuestions] = useState([]);
//   const [current, setCurrent] = useState(0);
//   const [loading, setLoading] = useState(true);

//   const [phase, setPhase] = useState("prep"); // "prep" | "rec" | "done"
//   const [timeLeft, setTimeLeft] = useState(30);

//   // Charge les questions
//   useEffect(() => {
//     const fetchInterview = async () => {
//       try {
//         const res = await fetch(`${API}/entretiens/${uuid}/`);
//         if (!res.ok) throw new Error("Entretien introuvable ou expiré");
//         const data = await res.json();

//         if (!data.questions || data.questions.length === 0) {
//           throw new Error("Aucune question disponible");
//         }

//         setQuestions(data.questions);
//         setTimeLeft(data.questions[0].preparation_time || 30);
//         setLoading(false);
//       } catch (err) {
//         console.error("Impossible de charger l'entretien :", err.message);
//         alert(`Impossible de charger l'entretien : ${err.message}`);
//         setLoading(false);
//       }
//     };
//     fetchInterview();
//   }, [uuid]);

//   // Démarre caméra dès qu'on a des questions
//   useEffect(() => {
//     const startCam = async () => {
//       try {
//         const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//         setStream(s);
//         if (videoRef.current) videoRef.current.srcObject = s;
//       } catch (err) {
//         console.error("Accès caméra/micro refusé :", err);
//         alert("Autorisez la caméra et le micro pour continuer.");
//       }
//     };
//     if (!loading && questions.length > 0) startCam();
//     return () => {
//       if (stream) stream.getTracks().forEach(t => t.stop());
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [loading]);

//   // Gestion du chrono + bascule prep → rec → upload → suivante
//   useEffect(() => {
//     if (loading || questions.length === 0 || phase === "done") return;

//     const q = questions[current];

//     if (phase === "prep") {
//       if (timeLeft <= 0) {
//         startRecording(q);
//         return;
//       }
//     }

//     if (phase === "rec") {
//       if (timeLeft <= 0) {
//         stopRecording(); // onstop déclenchera l’upload
//         return;
//       }
//     }

//     const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
//     return () => clearTimeout(timer);
//   }, [phase, timeLeft, current, questions, loading]);

//   const startRecording = (q) => {
//     if (!stream) return;
//     const mimeType = "video/webm;codecs=vp8,opus";
//     const recorder = new MediaRecorder(stream, { mimeType });
//     mediaRecorderRef.current = recorder;

//     const chunks = [];
//     recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };

//     recorder.onstop = async () => {
//       const blob = new Blob(chunks, { type: "video/webm" });
//       try {
//         await uploadAnswer(blob, q);
//       } catch (e) {
//         console.error("Erreur upload vidéo :", e);
//         alert("Erreur lors de l'envoi de la vidéo.");
//       } finally {
//         goNext();
//       }
//     };

//     recorder.start();
//     setPhase("rec");
//     setTimeLeft(q.recording_duration || 120);
//   };

//   const stopRecording = () => {
//     if (mediaRecorderRef.current && phase === "rec") {
//       mediaRecorderRef.current.stop();
//     }
//   };

//   const uploadAnswer = async (blob, q) => {
//     const formData = new FormData();
//     formData.append("video", blob, `question_${current + 1}.webm`);
//     formData.append("question", q.text);
//     formData.append("duration_seconds", (q.recording_duration || 120).toString());
//     formData.append("mime_type", "video/webm");

//     const res = await fetch(`${API}/entretiens/${uuid}/reponse/`, {
//       method: "POST",
//       body: formData,
//     });
//     if (!res.ok) {
//       const txt = await res.text();
//       throw new Error(txt || "Upload failed");
//     }
//   };

//   const goNext = () => {
//     // Prochaine question ou fin
//     if (current + 1 < questions.length) {
//       setCurrent((c) => c + 1);
//       setPhase("prep");
//       setTimeLeft(questions[current + 1].preparation_time || 30);
//     } else {
//       setPhase("done");
//     }
//   };

//   if (loading) return <div className="interview-page"><Header /><div className="container">Chargement de l'entretien…</div></div>;
//   if (questions.length === 0) return <div className="interview-page"><Header /><div className="container">Aucune question disponible.</div></div>;

//   const q = questions[current];

//   return (
//     <div className="interview-page">
//       <Header />
//       <div className="container">
//         <h2>Entretien vidéo</h2>
//         <p className="uuid">Lien : {uuid}</p>

//         {phase !== "done" && (
//           <>
//             <div className="question-box">
//               <h3>Question {current + 1} / {questions.length}</h3>
//               <p>{q.text}</p>
//             </div>

//             <div className={`status ${phase}`}>
//               {phase === "prep" && <span>⏳ Préparation : {timeLeft}s</span>}
//               {phase === "rec"  && <span>🔴 Enregistrement : {timeLeft}s</span>}
//             </div>

//             <div className="video-frame">
//               <video ref={videoRef} autoPlay playsInline muted width="640" height="480" />
//             </div>
//           </>
//         )}

//         {phase === "done" && (
//           <div className="final-message">
//             <h3>🎉 Entretien terminé</h3>
//             <p>Votre entretien a bien été <strong>envoyé au recruteur</strong>. Vous recevrez une réponse prochainement.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Interview;






// import React, { useRef, useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import Header from "../components/MinimalHeader";
// import "./Interview.css";

// const API = process.env.REACT_APP_API_URL;

// function Interview() {
//   const { uuid } = useParams();
//   const videoRef = useRef(null);
//   const mediaRecorderRef = useRef(null);

//   const [stream, setStream] = useState(null);
//   const [questions, setQuestions] = useState([]);
//   const [current, setCurrent] = useState(0);
//   const [loading, setLoading] = useState(true);

//   const [phase, setPhase] = useState("prep"); // "prep" | "rec" | "done"
//   const [timeLeft, setTimeLeft] = useState(30);
//   const [isRecording, setIsRecording] = useState(false);

//   // Charger les questions
//   useEffect(() => {
//     const fetchInterview = async () => {
//       try {
//         const res = await fetch(`${API}/entretiens/${uuid}/`);
//         if (!res.ok) throw new Error("Entretien introuvable ou expiré");
//         const data = await res.json();

//         if (!data.questions || data.questions.length === 0) {
//           throw new Error("Aucune question disponible");
//         }

//         setQuestions(data.questions);
//         setTimeLeft(data.questions[0].preparation_time || 30);
//         setLoading(false);
//       } catch (err) {
//         console.error("Impossible de charger l'entretien :", err.message);
//         alert(`Impossible de charger l'entretien : ${err.message}`);
//         setLoading(false);
//       }
//     };
//     fetchInterview();
//   }, [uuid]);

//   // Démarrer caméra
//   useEffect(() => {
//     const startCam = async () => {
//       try {
//         const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//         setStream(s);
//         if (videoRef.current) videoRef.current.srcObject = s;
//       } catch (err) {
//         console.error("Accès caméra/micro refusé :", err);
//         alert("Autorisez la caméra et le micro pour continuer.");
//       }
//     };

//     if (!loading && questions.length > 0) startCam();

//     return () => {
//       if (stream) stream.getTracks().forEach(t => t.stop());
//     };
//   }, [loading, questions]);

//   // Gestion du chrono
//   useEffect(() => {
//     if (loading || questions.length === 0 || phase === "done") return;

//     const q = questions[current];

//     if (phase === "prep") {
//       if (timeLeft <= 0) {
//         startRecording(q);
//         return;
//       }
//     }

//     if (phase === "rec") {
//       if (timeLeft <= 0) {
//         stopRecording();
//         return;
//       }
//     }

//     const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
//     return () => clearTimeout(timer);
//   }, [phase, timeLeft, current, questions, loading]);

//   // Démarrer l'enregistrement
//   const startRecording = (q) => {
//     if (!stream) return;

//     const mimeType = "video/webm;codecs=vp8,opus";
//     const recorder = new MediaRecorder(stream, { mimeType });
//     mediaRecorderRef.current = recorder;

//     const chunks = [];
//     recorder.ondataavailable = (e) => {
//       if (e.data.size > 0) chunks.push(e.data);
//     };

//     recorder.onstop = async () => {
//       const blob = new Blob(chunks, { type: "video/webm" });
//       try {
//         await uploadAnswer(blob, q);
//       } catch (e) {
//         console.error("Erreur upload vidéo :", e);
//         alert("Erreur lors de l'envoi de la vidéo.");
//       } finally {
//         goNext();
//       }
//     };

//     recorder.start();
//     setIsRecording(true);
//     setPhase("rec");
//     setTimeLeft(q.recording_duration || 120);
//   };

//   // Arrêter manuellement
//   const stopRecording = () => {
//     if (mediaRecorderRef.current && isRecording) {
//       mediaRecorderRef.current.stop();
//       setIsRecording(false);
//     }
//   };

//   // Upload
//   const uploadAnswer = async (blob, q) => {
//     const formData = new FormData();
//     formData.append("video", blob, `question_${current + 1}.webm`);
//     formData.append("question", q.text);
//     formData.append("duration_seconds", (q.recording_duration || 120).toString());
//     formData.append("mime_type", "video/webm");

//     const res = await fetch(`${API}/entretiens/${uuid}/reponse/`, {
//       method: "POST",
//       body: formData,
//     });

//     if (!res.ok) {
//       const txt = await res.text();
//       throw new Error(txt || "Upload failed");
//     }
//   };

//   // Passer à la suite
//   const goNext = () => {
//     if (current + 1 < questions.length) {
//       setCurrent((c) => c + 1);
//       setPhase("prep");
//       setTimeLeft(questions[current + 1].preparation_time || 30);
//     } else {
//       setPhase("done");
//     }
//   };

//   // Skip
//   const handleSkip = () => {
//     if (phase === "rec" && isRecording) {
//       stopRecording();
//     }
//   };

//   if (loading) return (
//     <div className="interview-page">
//       <Header />
//       <div className="container">
//         <div className="loader">Chargement...</div>
//       </div>
//     </div>
//   );

//   if (questions.length === 0) return (
//     <div className="interview-page">
//       <Header />
//       <div className="container">
//         <p>Aucune question disponible.</p>
//       </div>
//     </div>
//   );

//   const q = questions[current];
//   const progress = ((current + 1) / questions.length) * 100;

//   return (
//     <div className="interview-page">
//       <Header />
//       <div className="container">
//         {/* Title */}
//         <h1 className="title">Entretien vidéo</h1>
//         <p className="uuid">Lien : {uuid}</p>

//         {/* Progress Bar */}
//         <div className="progress-bar">
//           <div className="progress" style={{ width: `${progress}%` }}></div>
//         </div>

//         {/* Question Card */}
//         <div className="question-card">
//           <div className="question-header">
//             <span className="question-number">Question {current + 1} / {questions.length}</span>
//           </div>
//           <p className="question-text">{q.text}</p>
//         </div>

//         {/* Status */}
//         <div className={`status ${phase}`}>
//           {phase === "prep" && (
//             <span>
//               <span className="timer-icon">⏳</span> Préparation : {timeLeft}s
//             </span>
//           )}
//           {phase === "rec" && (
//             <span>
//               <span className="rec-dot"></span>
//               Enregistrement : {timeLeft}s
//             </span>
//           )}
//         </div>

//         {/* Video Frame */}
//         <div className="video-frame">
//           <video ref={videoRef} autoPlay playsInline muted width="640" height="480" />
//         </div>

//         {/* Controls */}
//         {phase === "prep" && (
//           <button onClick={() => startRecording(q)} className="btn-start">
//             Commencer l’enregistrement
//           </button>
//         )}

//         {phase === "rec" && (
//           <>
//             <button onClick={handleSkip} className="btn-skip">
//               Passer à la suite
//             </button>
//             <button onClick={stopRecording} className="btn-stop">
//               Arrêter
//             </button>
//           </>
//         )}

//         {/* Final Message */}
//         {phase === "done" && (
//           <div className="final-message">
//             <h3>🎉 Entretien terminé</h3>
//             <p>Votre entretien a été envoyé au recruteur. Vous recevrez une réponse prochainement.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Interview;
































// import React, { useRef, useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import Header from "../components/MinimalHeader";
// import "./Interview.css";

// const API = process.env.REACT_APP_API_URL;

// function Interview() {
//   const { uuid } = useParams();
//   const videoRef = useRef(null);
//   const mediaRecorderRef = useRef(null);

//   const [stream, setStream] = useState(null);
//   const [questions, setQuestions] = useState([]);
//   const [current, setCurrent] = useState(0);
//   const [loading, setLoading] = useState(true);

//   const [phase, setPhase] = useState("prep"); // "prep" | "rec" | "done"
//   const [timeLeft, setTimeLeft] = useState(30);
//   const [isRecording, setIsRecording] = useState(false);

//   // Charger les questions
//   useEffect(() => {
//     const fetchInterview = async () => {
//       try {
//         const res = await fetch(`${API}/entretiens/${uuid}/`);
//         if (!res.ok) throw new Error("Entretien introuvable ou expiré");
//         const data = await res.json();

//         if (!data.questions || data.questions.length === 0) {
//           throw new Error("Aucune question disponible");
//         }

//         setQuestions(data.questions);
//         setTimeLeft(data.questions[0].preparation_time || 30);
//         setLoading(false);
//       } catch (err) {
//         console.error("Impossible de charger l'entretien :", err.message);
//         alert(`Impossible de charger l'entretien : ${err.message}`);
//         setLoading(false);
//       }
//     };
//     fetchInterview();
//   }, [uuid]);

//   // Démarrer caméra
//   useEffect(() => {
//     const startCam = async () => {
//       try {
//         const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//         setStream(s);
//         if (videoRef.current) videoRef.current.srcObject = s;
//       } catch (err) {
//         console.error("Accès caméra/micro refusé :", err);
//         alert("Autorisez la caméra et le micro pour continuer.");
//       }
//     };

//     if (!loading && questions.length > 0) startCam();

//     return () => {
//       if (stream) stream.getTracks().forEach(t => t.stop());
//     };
//   }, [loading, questions]);

//   // Gestion du chrono
//   useEffect(() => {
//     if (loading || questions.length === 0 || phase === "done") return;

//     const q = questions[current];

//     if (phase === "prep") {
//       if (timeLeft <= 0) {
//         startRecording(q);
//         return;
//       }
//     }

//     if (phase === "rec") {
//       if (timeLeft <= 0) {
//         handleSkip(); // Auto-passe à la suite
//         return;
//       }
//     }

//     const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
//     return () => clearTimeout(timer);
//   }, [phase, timeLeft, current, questions, loading]);

//   // Démarrer l'enregistrement
//   const startRecording = (q) => {
//     if (!stream) return;

//     const mimeType = "video/webm;codecs=vp8,opus";
//     const recorder = new MediaRecorder(stream, { mimeType });
//     mediaRecorderRef.current = recorder;

//     const chunks = [];
//     recorder.ondataavailable = (e) => {
//       if (e.data.size > 0) chunks.push(e.data);
//     };

//     recorder.onstop = async () => {
//       const blob = new Blob(chunks, { type: "video/webm" });
//       try {
//         await uploadAnswer(blob, q);
//       } catch (e) {
//         console.error("Erreur upload vidéo :", e);
//         alert("Erreur lors de l'envoi de la vidéo.");
//       } finally {
//         goNext();
//       }
//     };

//     recorder.start();
//     setIsRecording(true);
//     setPhase("rec");
//     setTimeLeft(q.recording_duration || 120);
//   };

//   // Passer à la suite (manuel ou auto)
//   const handleSkip = () => {
//     if (phase === "rec" && mediaRecorderRef.current && isRecording) {
//       mediaRecorderRef.current.stop(); // Arrête proprement l’enregistrement
//     }
//     // Même si on n’enregistre pas, on passe à la suite
//     goNext();
//   };

//   // Upload
//   const uploadAnswer = async (blob, q) => {
//     const formData = new FormData();
//     formData.append("video", blob, `question_${current + 1}.webm`);
//     formData.append("question", q.text);
//     formData.append("duration_seconds", (q.recording_duration || 120).toString());
//     formData.append("mime_type", "video/webm");

//     const res = await fetch(`${API}/entretiens/${uuid}/reponse/`, {
//       method: "POST",
//       body: formData,
//     });

//     if (!res.ok) {
//       const txt = await res.text();
//       throw new Error(txt || "Upload failed");
//     }
//   };

//   // Passer à la suite
//   const goNext = () => {
//     if (current + 1 < questions.length) {
//       setCurrent((c) => c + 1);
//       setPhase("prep");
//       setTimeLeft(questions[current + 1].preparation_time || 30);
//     } else {
//       setPhase("done");
//     }
//   };

//   if (loading) return (
//     <div className="interview-page">
//       <Header />
//       <div className="container">
//         <div className="loader">Chargement de votre entretien…</div>
//       </div>
//     </div>
//   );

//   if (questions.length === 0) return (
//     <div className="interview-page">
//       <Header />
//       <div className="container">
//         <p>Aucune question disponible.</p>
//       </div>
//     </div>
//   );

//   const q = questions[current];
//   const progress = ((current + 1) / questions.length) * 100;

//   return (
//     <div className="interview-page">
//       <Header />
//       <div className="container">
//         <h1 className="title">Entretien vidéo</h1>
//         <p className="uuid">Lien : {uuid}</p>

//         {/* Barre de progression */}
//         <div className="progress-bar">
//           <div className="progress" style={{ width: `${progress}%` }}></div>
//         </div>

//         {/* Question */}
//         <div className="question-card">
//           <div className="question-header">
//             <span className="question-number">Question {current + 1} / {questions.length}</span>
//           </div>
//           <p className="question-text">{q.text}</p>
//         </div>

//         {/* Statut */}
//         <div className={`status ${phase}`}>
//           {phase === "prep" && (
//             <span>
//               <span className="timer-icon">⏳</span> Préparation : {timeLeft}s
//             </span>
//           )}
//           {phase === "rec" && (
//             <span>
//               <span className="rec-dot"></span>
//               Enregistrement : {timeLeft}s
//             </span>
//           )}
//         </div>

//         {/* Caméra */}
//         <div className="video-frame">
//           <video ref={videoRef} autoPlay playsInline muted width="640" height="480" />
//         </div>

//         {/* Boutons */}
//         {phase === "prep" && (
//           <button onClick={() => startRecording(q)} className="btn-start">
//             Commencer l’enregistrement
//           </button>
//         )}

//         {phase === "rec" && (
//           <>
//             <button onClick={handleSkip} className="btn-skip">
//               Passer à la suite
//             </button>
//             <p className="info">Cliquez ici quand vous avez terminé votre réponse.</p>
//           </>
//         )}

//         {/* Fin */}
//         {phase === "done" && (
//           <div className="final-message">
//             <h3>🎉 Entretien terminé</h3>
//             <p>Votre entretien a été envoyé au recruteur. Vous recevrez une réponse prochainement.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Interview;














// import React, { useRef, useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import Header from "../components/MinimalHeader";
// import "./Interview.css";

// const API = process.env.REACT_APP_API_URL;

// function Interview() {
//   const { uuid } = useParams();
//   const videoRef = useRef(null);
//   const mediaRecorderRef = useRef(null);

//   const [stream, setStream] = useState(null);
//   const [questions, setQuestions] = useState([]);
//   const [current, setCurrent] = useState(0);
//   const [loading, setLoading] = useState(true);

//   const [phase, setPhase] = useState("prep"); // "prep" | "rec" | "done"
//   const [timeLeft, setTimeLeft] = useState(30);
//   const [isRecording, setIsRecording] = useState(false);

//   // Charger les questions
//   useEffect(() => {
//     const fetchInterview = async () => {
//       try {
//         const res = await fetch(`${API}/entretiens/${uuid}/`);
//         if (!res.ok) throw new Error("Entretien introuvable ou expiré");
//         const data = await res.json();

//         if (!data.questions || data.questions.length === 0) {
//           throw new Error("Aucune question disponible");
//         }

//         setQuestions(data.questions);
//         setTimeLeft(data.questions[0].preparation_time || 30);
//         setLoading(false);
//       } catch (err) {
//         console.error("Impossible de charger l'entretien :", err.message);
//         alert(`Impossible de charger l'entretien : ${err.message}`);
//         setLoading(false);
//       }
//     };
//     fetchInterview();
//   }, [uuid]);

//   // Démarrer caméra
//   useEffect(() => {
//     const startCam = async () => {
//       try {
//         const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//         setStream(s);
//         if (videoRef.current) videoRef.current.srcObject = s;
//       } catch (err) {
//         console.error("Accès caméra/micro refusé :", err);
//         alert("Autorisez la caméra et le micro pour continuer.");
//       }
//     };

//     if (!loading && questions.length > 0) startCam();

//     return () => {
//       if (stream) stream.getTracks().forEach(t => t.stop());
//     };
//   }, [loading, questions]);

//   // Gestion du chrono
//   useEffect(() => {
//     if (loading || questions.length === 0 || phase === "done") return;

//     const q = questions[current];

//     if (phase === "prep") {
//       if (timeLeft <= 0) {
//         startRecording(q);
//         return;
//       }
//     }

//     if (phase === "rec") {
//       if (timeLeft <= 0) {
//         handleSkip();
//         return;
//       }
//     }

//     const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
//     return () => clearTimeout(timer);
//   }, [phase, timeLeft, current, questions, loading]);

//   // Démarrer l'enregistrement
//   const startRecording = (q) => {
//     if (!stream) return;

//     const mimeType = "video/webm;codecs=vp8,opus";
//     const recorder = new MediaRecorder(stream, { mimeType });
//     mediaRecorderRef.current = recorder;

//     const chunks = [];
//     recorder.ondataavailable = (e) => {
//       if (e.data.size > 0) chunks.push(e.data);
//     };

//     recorder.onstop = async () => {
//       const blob = new Blob(chunks, { type: "video/webm" });
//       try {
//         await uploadAnswer(blob, q);
//       } catch (e) {
//         console.error("Erreur upload vidéo :", e);
//         alert("Erreur lors de l'envoi de la vidéo.");
//       } finally {
//         goNext();
//       }
//     };

//     recorder.start();
//     setIsRecording(true);
//     setPhase("rec");
//     setTimeLeft(q.recording_duration || 120);
//   };

//   // Passer à la suite
//   const handleSkip = () => {
//     if (phase === "rec" && mediaRecorderRef.current) {
//       mediaRecorderRef.current.stop();
//     }
//     goNext();
//   };

//   // Upload
//   const uploadAnswer = async (blob, q) => {
//     const formData = new FormData();
//     formData.append("video", blob, `question_${current + 1}.webm`);
//     formData.append("question", q.text);
//     formData.append("duration_seconds", (q.recording_duration || 120).toString());
//     formData.append("mime_type", "video/webm");

//     const res = await fetch(`${API}/entretiens/${uuid}/reponse/`, {
//       method: "POST",
//       body: formData,
//     });

//     if (!res.ok) {
//       const txt = await res.text();
//       throw new Error(txt || "Upload failed");
//     }
//   };

//   // Passer à la suite
//   const goNext = () => {
//     if (current + 1 < questions.length) {
//       setCurrent((c) => c + 1);
//       setPhase("prep");
//       setTimeLeft(questions[current + 1].preparation_time || 30);
//     } else {
//       setPhase("done");
//     }
//   };

//   if (loading) return (
//     <div className="interview-page">
//       <Header />
//       <div className="container">
//         <div className="loader">Chargement…</div>
//       </div>
//     </div>
//   );

//   if (questions.length === 0) return (
//     <div className="interview-page">
//       <Header />
//       <div className="container">
//         <p>Aucune question disponible.</p>
//       </div>
//     </div>
//   );

//   const q = questions[current];
//   const progress = ((current + 1) / questions.length) * 100;

//   return (
//     <div className="interview-page">
//       <Header />
//       <div className="container">
//         {/* Titre */}
//         <h1 className="title">Entretien vidéo</h1>
//         <p className="uuid">Lien : {uuid}</p>

//         {/* Barre de progression */}
//         <div className="progress-bar">
//           <div className="progress" style={{ width: `${progress}%` }}></div>
//         </div>

//         {/* Question */}
//         <div className="question-box">
//           <h3>Question {current + 1} / {questions.length}</h3>
//           <p>{q.text}</p>
//         </div>

//         {/* Status */}
//         <div className={`status ${phase}`}>
//           {phase === "prep" && <span>⏳ Préparation : {timeLeft}s</span>}
//           {phase === "rec" && <span>🔴 Enregistrement : {timeLeft}s</span>}
//         </div>

//         {/* Vidéo */}
//         <div className="video-frame">
//           <video ref={videoRef} autoPlay playsInline muted width="640" height="480" />
//         </div>

//         {/* Boutons */}
//         {phase === "prep" && (
//           <button onClick={() => startRecording(q)} className="btn-start">
//             Commencer l’enregistrement
//           </button>
//         )}

//         {phase === "rec" && (
//           <button onClick={handleSkip} className="btn-skip">
//             Passer à la suite
//           </button>
//         )}

//         {/* Fin */}
//         {phase === "done" && (
//           <div className="final-message">
//             <h3>🎉 Entretien terminé</h3>
//             <p>Votre entretien a été envoyé au recruteur. Vous recevrez une réponse prochainement.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Interview;





import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/MinimalHeader";
import "./Interview.css";

const API = process.env.REACT_APP_API_URL;

function Interview() {
  const { uuid } = useParams();
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  const [phase, setPhase] = useState("prep"); // "prep" | "rec" | "done"
  const [timeLeft, setTimeLeft] = useState(30);
  const [isRecording, setIsRecording] = useState(false);

  // Charger les questions
  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const res = await fetch(`${API}/entretiens/${uuid}/`);
        if (!res.ok) throw new Error("Entretien introuvable ou expiré");
        const data = await res.json();

        if (!data.questions || data.questions.length === 0) {
          throw new Error("Aucune question disponible");
        }

        setQuestions(data.questions);
        setTimeLeft(data.questions[0].preparation_time || 30);
        setLoading(false);
      } catch (err) {
        console.error("Impossible de charger l'entretien :", err.message);
        alert(`Impossible de charger l'entretien : ${err.message}`);
        setLoading(false);
      }
    };
    fetchInterview();
  }, [uuid]);

  // Démarrer caméra
  useEffect(() => {
    const startCam = async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(s);
        if (videoRef.current) videoRef.current.srcObject = s;
      } catch (err) {
        console.error("Accès caméra/micro refusé :", err);
        alert("Autorisez la caméra et le micro pour continuer.");
      }
    };

    if (!loading && questions.length > 0) startCam();

    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, [loading, questions]);

  // Gestion du chrono
  useEffect(() => {
    if (loading || questions.length === 0 || phase === "done") return;

    const q = questions[current];

    if (phase === "prep") {
      if (timeLeft <= 0) {
        startRecording(q);
        return;
      }
    }

    if (phase === "rec") {
      if (timeLeft <= 0) {
        handleSkip();
        return;
      }
    }

    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [phase, timeLeft, current, questions, loading]);

  // Démarrer l'enregistrement
  const startRecording = (q) => {
    if (!stream) return;

    const mimeType = "video/webm;codecs=vp8,opus";
    const recorder = new MediaRecorder(stream, { mimeType });
    mediaRecorderRef.current = recorder;

    const chunks = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = async () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      try {
        await uploadAnswer(blob, q);
      } catch (e) {
        console.error("Erreur upload vidéo :", e);
        alert("Erreur lors de l'envoi de la vidéo.");
      } finally {
        goNext();
      }
    };

    recorder.start();
    setIsRecording(true);
    setPhase("rec");
    setTimeLeft(q.recording_duration || 120);
  };

  // Passer à la suite
  const handleSkip = () => {
    if (phase === "rec" && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    goNext();
  };

  // Upload
  const uploadAnswer = async (blob, q) => {
    const formData = new FormData();
    formData.append("video", blob, `question_${current + 1}.webm`);
    formData.append("question", q.text);
    formData.append("duration_seconds", (q.recording_duration || 120).toString());
    formData.append("mime_type", "video/webm");

    const res = await fetch(`${API}/entretiens/${uuid}/reponse/`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(txt || "Upload failed");
    }
  };

  // Passer à la suite
  const goNext = () => {
    if (current + 1 < questions.length) {
      setCurrent((c) => c + 1);
      setPhase("prep");
      setTimeLeft(questions[current + 1].preparation_time || 30);
    } else {
      setPhase("done");
    }
  };

  if (loading) return (
    <div className="interview-page">
      <Header />
      <div className="container">
        <div className="loader">Chargement…</div>
      </div>
    </div>
  );

  if (questions.length === 0) return (
    <div className="interview-page">
      <Header />
      <div className="container">
        <p>Aucune question disponible.</p>
      </div>
    </div>
  );

  const q = questions[current];
  const progress = ((current + 1) / questions.length) * 100;

  return (
    <div className="interview-page">
      <Header />
      <div className="container">
        {/* Titre */}
        <h1 className="title">Entretien vidéo</h1>

        {/* Barre de progression */}
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Question */}
        <div className="question-box">
          <h3>Question {current + 1} / {questions.length}</h3>
          <p>{q.text}</p>
        </div>

        {/* Status */}
        <div className={`status ${phase}`}>
          {phase === "prep" && <span>⏳ Préparation : {timeLeft}s</span>}
          {phase === "rec" && <span>🔴 Enregistrement : {timeLeft}s</span>}
        </div>

        {/* Vidéo */}
        {phase !== "done" && (
          <div className="video-frame">
            <video ref={videoRef} autoPlay playsInline muted width="640" height="480" />
          </div>
        )}

        {/* Boutons */}
        {phase === "prep" && (
          <button onClick={() => startRecording(q)} className="btn-start">
            Commencer l’enregistrement
          </button>
        )}

        {phase === "rec" && (
          <button onClick={handleSkip} className="btn-skip">
            Passer à la suite
          </button>
        )}

        {/* Fin */}
        {phase === "done" && (
          <div className="final-message">
            <h3>🎉 Entretien terminé</h3>
            <p>Votre entretien a été envoyé au recruteur. Vous recevrez une réponse prochainement.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Interview;