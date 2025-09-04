// // src/pages/ManageInterviews.js
// import { useState, useEffect } from "react";
// import {
//   getJobOffers,
//   getInterviewForms,
//   createInterviewForm,
// } from "../services/hrService";

// const mockCandidates = [
//   { id: 1, name: "Aya Kathiri", interviewStatus: "Enregistré", requestStatus: "Lien envoyé" },
//   { id: 2, name: "Mohamed Benali", interviewStatus: "Non Enregistré", requestStatus: "Pas de demande" },
//   { id: 3, name: "Sara Choukri", interviewStatus: "Non Enregistré", requestStatus: "Pas de demande" },
//   { id: 4, name: "Youssef El Amrani", interviewStatus: "Enregistré", requestStatus: "Pas de demande" },
//   { id: 5, name: "Hanae Zeroual", interviewStatus: "Non Enregistré", requestStatus: "Pas de demande" },
// ];

// export default function ManageInterviews() {
//   const [offers, setOffers] = useState([]);
//   const [selectedOffer, setSelectedOffer] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [step, setStep] = useState("facile");
//   const [questions, setQuestions] = useState({
//     facile: Array(5).fill(""),
//     moyen: Array(5).fill(""),
//     difficile: Array(5).fill(""),
//   });

//   const [searchTerm, setSearchTerm] = useState("");
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
//   const token = localStorage.getItem("access");

//   // Charger les offres
//   useEffect(() => {
//     const fetchOffers = async () => {
//       try {
//         const data = await getJobOffers(token);
//         setOffers(data);
//       } catch (err) {
//         console.error("Erreur lors de la récupération des offres :", err);
//       }
//     };

//     if (token) fetchOffers();
//   }, [token]);

//   // Charger les formulaires existants
//   useEffect(() => {
//     const loadForms = async () => {
//       if (!selectedOffer || showForm) return;

//       try {
//         const forms = await getInterviewForms(token, selectedOffer.id);
//         if (forms && forms.length > 0) {
//           const latest = forms[forms.length - 1];

//           const parseField = (data) => {
//             try {
//               return Array.isArray(data) ? data : JSON.parse(data);
//             } catch (e) {
//               return Array(5).fill("");
//             }
//           };

//           const loaded = {
//             facile: parseField(latest.questions_facile),
//             moyen: parseField(latest.questions_moyen),
//             difficile: parseField(latest.questions_difficile),
//           };

//           setQuestions(loaded);
//         }
//       } catch (err) {
//         console.error("Erreur lors du chargement des formulaires :", err);
//       }
//     };

//     loadForms();
//   }, [selectedOffer, showForm, token]);

//   const handleChange = (level, index, value) => {
//     setQuestions((prev) => {
//       const updated = { ...prev };
//       updated[level][index] = value;
//       return updated;
//     });
//   };

//   const nextStep = () => {
//     if (step === "facile") setStep("moyen");
//     else if (step === "moyen") setStep("difficile");
//   };

//   const handleValidate = async () => {
//     if (!selectedOffer) return;

//     try {
//       await createInterviewForm(token, selectedOffer.id, {
//         questions_facile: questions.facile,
//         questions_moyen: questions.moyen,
//         questions_difficile: questions.difficile,
//       });

//       alert(`✅ Formulaire d'entretien enregistré pour l'offre "${selectedOffer.title}"`);
//       setShowForm(false);
//       setSelectedOffer(null);
//       setStep("facile");
//     } catch (err) {
//       const errorMsg = err.response?.data || err.message;
//       console.error("Erreur API :", errorMsg);
//       alert(`❌ Échec de création : ${JSON.stringify(errorMsg)}`);
//     }
//   };

//   const getStepInfo = () => {
//     if (step === "facile") return { label: "Facile", color: "#A7F3D0" };
//     if (step === "moyen") return { label: "Moyen", color: "#FCD34D" };
//     return { label: "Difficile", color: "#FCA5A5" };
//   };

//   const { label, color } = getStepInfo();

//   const filteredCandidates = mockCandidates.filter((candidate) =>
//     candidate.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleDelete = (id) => {
//     setShowDeleteConfirm(id);
//   };

//   const confirmDelete = () => {
//     if (showDeleteConfirm) {
//       alert(`🗑 Candidat ${showDeleteConfirm} supprimé`);
//       setShowDeleteConfirm(null);
//     }
//   };

//   const cancelDelete = () => {
//     setShowDeleteConfirm(null);
//   };

//   return (
//     <div style={{ fontFamily: "Inter, sans-serif", background: "#f9fafb", minHeight: "100vh", padding: "20px" }}>
//       {!selectedOffer ? (
//         <div style={{ textAlign: "center", padding: "60px 0" }}>
//           <h1 style={{ fontSize: "36px", fontWeight: "700", color: "#111827", marginBottom: "16px" }}>
//             Créez un entretien pour l'offre parfaite
//           </h1>
//           <p style={{ color: "#6b7280", fontSize: "16px", marginBottom: "40px" }}>
//             Sélectionnez une offre ci-dessous pour commencer à rédiger vos questions d’entretien.
//           </p>

//           {offers.length === 0 ? (
//             <p style={{ color: "#6b7280" }}>Aucune offre disponible pour le moment.</p>
//           ) : (
//             <div style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
//               gap: "20px",
//             }}>
//               {offers.map((offre) => (
//                 <div
//                   key={offre.id}
//                   style={{
//                     background: "white",
//                     padding: "24px",
//                     borderRadius: "12px",
//                     boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
//                     cursor: "pointer",
//                     transition: "all 0.3s ease",
//                     border: "1px solid #e5e5e5",
//                     minHeight: "160px",
//                     display: "flex",
//                     flexDirection: "column",
//                     justifyContent: "space-between",
//                   }}
//                   onClick={() => setSelectedOffer(offre)}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.transform = "translateY(-4px)";
//                     e.currentTarget.style.boxShadow = "0 12px 25px rgba(0,0,0,0.12)";
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.transform = "translateY(0)";
//                     e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.08)";
//                   }}
//                 >
//                   <h3 style={{
//                     fontWeight: "600",
//                     fontSize: "18px",
//                     margin: "0 0 12px 0",
//                     lineHeight: "1.4",
//                   }}>
//                     {offre.title}
//                   </h3>
//                   <p style={{
//                     fontSize: "14px",
//                     color: "#6b7280",
//                     margin: "0 0 8px 0",
//                     lineHeight: "1.4",
//                   }}>
//                     {offre.location}
//                   </p>
//                   <p
//                     style={{
//                       fontSize: "14px",
//                       color: "#374151",
//                       margin: "0",
//                       overflow: "auto",
//                       maxHeight: "80px",
//                       lineHeight: "1.4",
//                       flex: 1,
//                       whiteSpace: "pre-line",
//                     }}
//                   >
//                     {offre.description}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       ) : showForm ? (
//         <div style={{ display: "flex", justifyContent: "center", marginTop: "40px" }}>
//           <div style={{
//             width: "700px",
//             background: "white",
//             padding: "30px",
//             borderRadius: "12px",
//             boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
//             border: "1px solid #e5e5e5",
//           }}>
//             <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", marginBottom: "20px" }}>
//               Entretien pour : {selectedOffer.title}
//             </h2>
//             <div style={{
//               display: "inline-block",
//               background: color,
//               padding: "6px 14px",
//               borderRadius: "12px",
//               fontSize: "14px",
//               fontWeight: "500",
//               color: "white",
//               marginBottom: "20px",
//             }}>
//               5 Qst niveau : {label}
//             </div>

//             {questions[step].map((q, i) => (
//               <div key={i} style={{ marginBottom: "16px" }}>
//                 <label style={{ display: "block", fontSize: "14px", marginBottom: "8px" }}>
//                   Question {i + 1}
//                 </label>
//                 <input
//                   type="text"
//                   value={q}
//                   onChange={(e) => handleChange(step, i, e.target.value)}
//                   placeholder={`Écrire la question ${i + 1}...`}
//                   style={{
//                     width: "100%",
//                     padding: "12px",
//                     borderRadius: "8px",
//                     border: "1px solid #ddd",
//                     fontSize: "14px",
//                   }}
//                 />
//               </div>
//             ))}

//             <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
//               <button
//                 onClick={() => setShowForm(false)}
//                 style={{
//                   padding: "10px 20px",
//                   borderRadius: "8px",
//                   border: "none",
//                   background: "#e5e5e5",
//                   color: "#111",
//                   cursor: "pointer",
//                   fontSize: "14px",
//                 }}
//               >
//                 Retour
//               </button>
//               {step !== "difficile" ? (
//                 <button
//                   onClick={nextStep}
//                   style={{
//                     padding: "10px 20px",
//                     borderRadius: "8px",
//                     border: "none",
//                     background: "#111",
//                     color: "white",
//                     cursor: "pointer",
//                     fontSize: "14px",
//                   }}
//                 >
//                   Suivant
//                 </button>
//               ) : (
//                 <button
//                   onClick={handleValidate}
//                   style={{
//                     padding: "10px 20px",
//                     borderRadius: "8px",
//                     border: "none",
//                     background: "#10B981",
//                     color: "white",
//                     cursor: "pointer",
//                     fontSize: "14px",
//                   }}
//                 >
//                   Valider
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       ) : (
//         // Dashboard + candidats
//         <div style={{ display: "flex", gap: "20px", height: "calc(100vh - 100px)" }}>
//           {/* Colonne gauche */}
//           <div style={{
//             width: "280px",
//             background: "white",
//             borderRadius: "12px",
//             boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
//             padding: "20px",
//             flexShrink: 0,
//           }}>
//             {/* Carte de l'offre */}
//             <div style={{
//               background: "#f9fafb",
//               borderRadius: "12px",
//               padding: "16px",
//               marginBottom: "24px",
//             }}>
//               <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
//                 <div style={{
//                   width: "32px",
//                   height: "32px",
//                   borderRadius: "50%",
//                   background: "#e5e5e5",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   fontSize: "14px",
//                   color: "#6b7280",
//                 }}>
//                   {selectedOffer.title.charAt(0).toUpperCase()}
//                 </div>
//                 <h3 style={{
//                   fontSize: "14px",
//                   fontWeight: "600",
//                   marginLeft: "10px",
//                   color: "#111827",
//                 }}>
//                   {selectedOffer.title}
//                 </h3>
//               </div>
//               <p style={{
//                 fontSize: "14px",
//                 color: "#6b7280",
//                 margin: "0",
//                 lineHeight: "1.4",
//               }}>
//                 {selectedOffer.description}
//               </p>
//             </div>

//             {/* Boutons */}
//             <button
//               onClick={() => setShowForm(true)}
//               style={{
//                 width: "100%",
//                 padding: "10px",
//                 borderRadius: "8px",
//                 border: "none",
//                 background: "#e5e5e5",
//                 color: "#111",
//                 cursor: "pointer",
//                 fontSize: "14px",
//                 fontWeight: "500",
//                 marginBottom: "12px",
//                 transition: "background 0.2s ease",
//               }}
//               onMouseEnter={(e) => (e.currentTarget.style.background = "#d1d5db")}
//               onMouseLeave={(e) => (e.currentTarget.style.background = "#e5e5e5")}
//             >
//               Créer un formulaire
//             </button>

//             <button
//               onClick={() => setSelectedOffer(null)}
//               style={{
//                 width: "100%",
//                 padding: "10px",
//                 borderRadius: "8px",
//                 border: "1px solid #d1d5db",
//                 background: "white",
//                 color: "#111827",
//                 cursor: "pointer",
//                 fontSize: "14px",
//                 fontWeight: "500",
//                 marginBottom: "24px",
//                 transition: "all 0.2s ease",
//                 textAlign: "left",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "8px",
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.background = "#f3f4f6";
//                 e.currentTarget.style.borderColor = "#9ca3af";
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.background = "white";
//                 e.currentTarget.style.borderColor = "#d1d5db";
//               }}
//             >
//               <span style={{ fontSize: "16px" }}>←</span>
//               <span>Retour aux offres</span>
//             </button>

//             {/* Dashboard */}
//             <div style={{
//               background: "#f9fafb",
//               borderRadius: "12px",
//               padding: "16px",
//               border: "1px solid #e5e5e5",
//             }}>
//               <h4 style={{
//                 fontSize: "14px",
//                 fontWeight: "600",
//                 color: "#111827",
//                 marginBottom: "12px",
//               }}>
//                 Dashboard
//               </h4>
//               <div style={{ display: "flex", gap: "12px" }}>
//                 <div style={{
//                   width: "50px",
//                   height: "50px",
//                   background: "#FECACA",
//                   borderRadius: "50%",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   fontSize: "14px",
//                   color: "#DC2626",
//                 }}>12%</div>
//                 <div style={{
//                   width: "50px",
//                   height: "50px",
//                   background: "#E0E7FF",
//                   borderRadius: "50%",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   fontSize: "14px",
//                   color: "#3B82F6",
//                 }}>23%</div>
//               </div>
//             </div>
//           </div>

//           {/* Colonne droite : Liste des candidats */}
//           <div style={{
//             flex: 1,
//             background: "white",
//             borderRadius: "12px",
//             boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
//             padding: "20px",
//             overflowY: "auto",
//           }}>
//             {/* Barre de recherche */}
//             <div style={{
//               display: "flex",
//               justifyContent: "flex-end",
//               marginBottom: "20px",
//             }}>
//               <div style={{ position: "relative", width: "300px" }}>
//                 <input
//                   type="text"
//                   placeholder="Recherche"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   style={{
//                     width: "100%",
//                     padding: "10px 14px 10px 40px",
//                     borderRadius: "24px",
//                     border: "1px solid #d1d5db",
//                     fontSize: "14px",
//                     background: "#f9fafb",
//                     color: "#111",
//                     boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
//                   }}
//                 />
//                 <div style={{
//                   position: "absolute",
//                   left: "14px",
//                   top: "50%",
//                   transform: "translateY(-50%)",
//                   color: "#6b7280",
//                   fontSize: "16px",
//                 }}>
//                   🔍
//                 </div>
//               </div>
//             </div>

//             {/* Tableau des candidats */}
//             <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
//               <thead>
//                 <tr style={{ backgroundColor: "#f3f4f6", borderBottom: "1px solid #d1d5db" }}>
//                   <th style={{ padding: "12px", textAlign: "left" }}>Nom</th>
//                   <th style={{ padding: "12px", textAlign: "left" }}>État de l’entretien</th>
//                   <th style={{ padding: "12px", textAlign: "left" }}>État de la demande</th>
//                   <th style={{ padding: "12px", textAlign: "right" }}>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredCandidates.map((candidate) => (
//                   <tr key={candidate.id} style={{ borderBottom: "1px solid #e5e5e5", height: "60px" }}>
//                     <td style={{ padding: "12px", display: "flex", alignItems: "center" }}>
//                       <div style={{
//                         width: "32px",
//                         height: "32px",
//                         borderRadius: "50%",
//                         background: "#e5e5e5",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         fontSize: "14px",
//                         color: "#6b7280",
//                       }}>
//                         {candidate.name.split(" ").map(n => n[0]).join("")}
//                       </div>
//                       <span style={{ marginLeft: "10px", fontWeight: "500", color: "#111827" }}>{candidate.name}</span>
//                     </td>
//                     <td style={{ padding: "12px" }}>
//                       <span style={{
//                         color: candidate.interviewStatus === "Enregistré" ? "#10B981" : "#6B7280"
//                       }}>
//                         {candidate.interviewStatus}
//                       </span>
//                     </td>
//                     <td style={{ padding: "12px" }}>
//                       <select
//                         style={{
//                           padding: "6px",
//                           borderRadius: "6px",
//                           border: "1px solid #ddd",
//                           background: candidate.requestStatus === "Lien envoyé" ? "#DCFCE7" : "#F3F4F6",
//                           color: candidate.requestStatus === "Lien envoyé" ? "#10B981" : "#6B7280",
//                         }}
//                         defaultValue={candidate.requestStatus}
//                       >
//                         <option value="Lien envoyé">Lien envoyé</option>
//                         <option value="Pas de demande">Pas de demande</option>
//                       </select>
//                     </td>
//                     <td style={{ padding: "12px", textAlign: "right" }}>
//                       <span style={{ fontSize: "16px", color: "#6b7280", cursor: "pointer" }} onClick={() => handleDelete(candidate.id)}>
//                         ...
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {showDeleteConfirm && (
//               <div style={{
//                 position: "fixed",
//                 top: "50%",
//                 left: "50%",
//                 transform: "translate(-50%, -50%)",
//                 background: "white",
//                 padding: "20px",
//                 borderRadius: "12px",
//                 boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
//                 zIndex: 1000,
//                 width: "300px",
//                 textAlign: "center",
//               }}>
//                 <h4 style={{ fontSize: "18px", fontWeight: "600", color: "#111827" }}>
//                   Êtes-vous sûr ?
//                 </h4>
//                 <p style={{ color: "#6b7280", marginTop: "10px" }}>
//                   Voulez-vous vraiment supprimer ce candidat ?
//                 </p>
//                 <div style={{ display: "flex", justifyContent: "space-around", marginTop: "20px" }}>
//                   <button
//                     onClick={cancelDelete}
//                     style={{
//                       padding: "8px 16px",
//                       borderRadius: "6px",
//                       border: "1px solid #ddd",
//                       background: "#f3f4f6",
//                       color: "#111",
//                       cursor: "pointer",
//                       fontSize: "14px",
//                     }}
//                   >
//                     Annuler
//                   </button>
//                   <button
//                     onClick={confirmDelete}
//                     style={{
//                       padding: "8px 16px",
//                       borderRadius: "6px",
//                       border: "none",
//                       background: "#ef4444",
//                       color: "white",
//                       cursor: "pointer",
//                       fontSize: "14px",
//                     }}
//                   >
//                     Supprimer
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// //aya
// // src/pages/ManageInterviews.js
// import { useState, useEffect } from "react";
// import {
//   getJobOffers,
//   getInterviewForms,
//   createInterviewForm,
// } from "../services/hrService";
// import { getCandidatsByOffer } from "../services/candidatService";

// // candidates will be loaded from the API for the selected offer

// export default function ManageInterviews() {
//   const [offers, setOffers] = useState([]);
//   const [selectedOffer, setSelectedOffer] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [step, setStep] = useState("facile");
//   const [questions, setQuestions] = useState({
//     facile: Array(5).fill(""),
//     moyen: Array(5).fill(""),
//     difficile: Array(5).fill(""),
//   });

//   const [searchTerm, setSearchTerm] = useState("");
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
//   const [candidates, setCandidates] = useState([]);
//   const token = localStorage.getItem("access");

//   // Charger les offres
//   useEffect(() => {
//     const fetchOffers = async () => {
//       try {
//         const data = await getJobOffers(token);
//         setOffers(data);
//       } catch (err) {
//         console.error("Erreur lors de la récupération des offres :", err);
//       }
//     };

//     if (token) fetchOffers();
//   }, [token]);

//   // Charger les formulaires existants
//   useEffect(() => {
//     const loadForms = async () => {
//       if (!selectedOffer || showForm) return;

//       try {
//         const forms = await getInterviewForms(token, selectedOffer.id);
//         if (forms && forms.length > 0) {
//           const latest = forms[forms.length - 1];

//           const parseField = (data) => {
//             try {
//               return Array.isArray(data) ? data : JSON.parse(data);
//             } catch (e) {
//               return Array(5).fill("");
//             }
//           };

//           const loaded = {
//             facile: parseField(latest.questions_facile),
//             moyen: parseField(latest.questions_moyen),
//             difficile: parseField(latest.questions_difficile),
//           };

//           setQuestions(loaded);
//         }
//       } catch (err) {
//         console.error("Erreur lors du chargement des formulaires :", err);
//       }
//     };

//     loadForms();
//   }, [selectedOffer, showForm, token]);

//   // Charger les candidats ayant postulé pour l'offre sélectionnée
//   useEffect(() => {
//     const loadCandidates = async () => {
//       if (!selectedOffer) return setCandidates([]);
//       try {
//         const data = await getCandidatsByOffer(token, selectedOffer.id);
//         // data returned by API: [{ id, email, interviewStatus, requestStatus }] per earlier view
//         // Map to shape expected by the table (id, name, interviewStatus, requestStatus)
//         const mapped = data.map((d) => ({
//           id: d.id,
//           name: d.email || Candidate ${d.id},
//           interviewStatus: d.interviewStatus || (d.has_video ? "Enregistré" : "Non Enregistré"),
//           requestStatus: d.requestStatus || "Pas de demande",
//         }));
//         setCandidates(mapped);
//       } catch (err) {
//         console.error("Erreur chargement candidats :", err);
//         setCandidates([]);
//       }
//     };

//     loadCandidates();
//   }, [selectedOffer, token]);

//   const handleChange = (level, index, value) => {
//     setQuestions((prev) => {
//       const updated = { ...prev };
//       updated[level][index] = value;
//       return updated;
//     });
//   };

//   const nextStep = () => {
//     if (step === "facile") setStep("moyen");
//     else if (step === "moyen") setStep("difficile");
//   };

//   const handleValidate = async () => {
//     if (!selectedOffer) return;

//     try {
//       await createInterviewForm(token, selectedOffer.id, {
//         questions_facile: questions.facile,
//         questions_moyen: questions.moyen,
//         questions_difficile: questions.difficile,
//       });

//       alert(✅ Formulaire d'entretien enregistré pour l'offre "${selectedOffer.title}");
//       setShowForm(false);
//       setSelectedOffer(null);
//       setStep("facile");
//     } catch (err) {
//       const errorMsg = err.response?.data || err.message;
//       console.error("Erreur API :", errorMsg);
//       alert(❌ Échec de création : ${JSON.stringify(errorMsg)});
//     }
//   };

//   const getStepInfo = () => {
//     if (step === "facile") return { label: "Facile", color: "#A7F3D0" };
//     if (step === "moyen") return { label: "Moyen", color: "#FCD34D" };
//     return { label: "Difficile", color: "#FCA5A5" };
//   };

//   const { label, color } = getStepInfo();

//   const filteredCandidates = candidates.filter((candidate) =>
//     candidate.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleDelete = (id) => {
//     setShowDeleteConfirm(id);
//   };

//   const confirmDelete = () => {
//     if (showDeleteConfirm) {
//       alert(🗑 Candidat ${showDeleteConfirm} supprimé);
//       setShowDeleteConfirm(null);
//     }
//   };

//   const cancelDelete = () => {
//     setShowDeleteConfirm(null);
//   };

//   return (
//     <div style={{ fontFamily: "Inter, sans-serif", background: "#f9fafb", minHeight: "100vh", padding: "20px" }}>
//       {!selectedOffer ? (
//         <div style={{ textAlign: "center", padding: "60px 0" }}>
//           <h1 style={{ fontSize: "36px", fontWeight: "700", color: "#111827", marginBottom: "16px" }}>
//             Créez un entretien pour l'offre parfaite
//           </h1>
//           <p style={{ color: "#6b7280", fontSize: "16px", marginBottom: "40px" }}>
//             Sélectionnez une offre ci-dessous pour commencer à rédiger vos questions d’entretien.
//           </p>

//           {offers.length === 0 ? (
//             <p style={{ color: "#6b7280" }}>Aucune offre disponible pour le moment.</p>
//           ) : (
//             <div style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
//               gap: "20px",
//             }}>
//               {offers.map((offre) => (
//                 <div
//                   key={offre.id}
//                   style={{
//                     background: "white",
//                     padding: "24px",
//                     borderRadius: "12px",
//                     boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
//                     cursor: "pointer",
//                     transition: "all 0.3s ease",
//                     border: "1px solid #e5e5e5",
//                     minHeight: "160px",
//                     display: "flex",
//                     flexDirection: "column",
//                     justifyContent: "space-between",
//                   }}
//                   onClick={() => setSelectedOffer(offre)}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.transform = "translateY(-4px)";
//                     e.currentTarget.style.boxShadow = "0 12px 25px rgba(0,0,0,0.12)";
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.transform = "translateY(0)";
//                     e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.08)";
//                   }}
//                 >
//                   <h3 style={{
//                     fontWeight: "600",
//                     fontSize: "18px",
//                     margin: "0 0 12px 0",
//                     lineHeight: "1.4",
//                   }}>
//                     {offre.title}
//                   </h3>
//                   <p style={{
//                     fontSize: "14px",
//                     color: "#6b7280",
//                     margin: "0 0 8px 0",
//                     lineHeight: "1.4",
//                   }}>
//                     {offre.location}
//                   </p>
//                   <p
//                     style={{
//                       fontSize: "14px",
//                       color: "#374151",
//                       margin: "0",
//                       overflow: "auto",
//                       maxHeight: "80px",
//                       lineHeight: "1.4",
//                       flex: 1,
//                       whiteSpace: "pre-line",
//                     }}
//                   >
//                     {offre.description}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       ) : showForm ? (
//         <div style={{ display: "flex", justifyContent: "center", marginTop: "40px" }}>
//           <div style={{
//             width: "700px",
//             background: "white",
//             padding: "30px",
//             borderRadius: "12px",
//             boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
//             border: "1px solid #e5e5e5",
//           }}>
//             <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", marginBottom: "20px" }}>
//               Entretien pour : {selectedOffer.title}
//             </h2>
//             <div style={{
//               display: "inline-block",
//               background: color,
//               padding: "6px 14px",
//               borderRadius: "12px",
//               fontSize: "14px",
//               fontWeight: "500",
//               color: "white",
//               marginBottom: "20px",
//             }}>
//               5 Qst niveau : {label}
//             </div>

//             {questions[step].map((q, i) => (
//               <div key={i} style={{ marginBottom: "16px" }}>
//                 <label style={{ display: "block", fontSize: "14px", marginBottom: "8px" }}>
//                   Question {i + 1}
//                 </label>
//                 <input
//                   type="text"
//                   value={q}
//                   onChange={(e) => handleChange(step, i, e.target.value)}
//                   placeholder={Écrire la question ${i + 1}...}
//                   style={{
//                     width: "100%",
//                     padding: "12px",
//                     borderRadius: "8px",
//                     border: "1px solid #ddd",
//                     fontSize: "14px",
//                   }}
//                 />
//               </div>
//             ))}

//             <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
//               <button
//                 onClick={() => setShowForm(false)}
//                 style={{
//                   padding: "10px 20px",
//                   borderRadius: "8px",
//                   border: "none",
//                   background: "#e5e5e5",
//                   color: "#111",
//                   cursor: "pointer",
//                   fontSize: "14px",
//                 }}
//               >
//                 Retour
//               </button>
//               {step !== "difficile" ? (
//                 <button
//                   onClick={nextStep}
//                   style={{
//                     padding: "10px 20px",
//                     borderRadius: "8px",
//                     border: "none",
//                     background: "#111",
//                     color: "white",
//                     cursor: "pointer",
//                     fontSize: "14px",
//                   }}
//                 >
//                   Suivant
//                 </button>
//               ) : (
//                 <button
//                   onClick={handleValidate}
//                   style={{
//                     padding: "10px 20px",
//                     borderRadius: "8px",
//                     border: "none",
//                     background: "#10B981",
//                     color: "white",
//                     cursor: "pointer",
//                     fontSize: "14px",
//                   }}
//                 >
//                   Valider
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       ) : (
//         // Dashboard + candidats
//         <div style={{ display: "flex", gap: "20px", height: "calc(100vh - 100px)" }}>
//           {/* Colonne gauche */}
//           <div style={{
//             width: "280px",
//             background: "white",
//             borderRadius: "12px",
//             boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
//             padding: "20px",
//             flexShrink: 0,
//           }}>
//             {/* Carte de l'offre */}
//             <div style={{
//               background: "#f9fafb",
//               borderRadius: "12px",
//               padding: "16px",
//               marginBottom: "24px",
//             }}>
//               <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
//                 <div style={{
//                   width: "32px",
//                   height: "32px",
//                   borderRadius: "50%",
//                   background: "#e5e5e5",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   fontSize: "14px",
//                   color: "#6b7280",
//                 }}>
//                   {selectedOffer.title.charAt(0).toUpperCase()}
//                 </div>
//                 <h3 style={{
//                   fontSize: "14px",
//                   fontWeight: "600",
//                   marginLeft: "10px",
//                   color: "#111827",
//                 }}>
//                   {selectedOffer.title}
//                 </h3>
//               </div>
//               <p style={{
//                 fontSize: "14px",
//                 color: "#6b7280",
//                 margin: "0",
//                 lineHeight: "1.4",
//               }}>
//                 {selectedOffer.description}
//               </p>
//             </div>

//             {/* Boutons */}
//             <button
//               onClick={() => setShowForm(true)}
//               style={{
//                 width: "100%",
//                 padding: "10px",
//                 borderRadius: "8px",
//                 border: "none",
//                 background: "#e5e5e5",
//                 color: "#111",
//                 cursor: "pointer",
//                 fontSize: "14px",
//                 fontWeight: "500",
//                 marginBottom: "12px",
//                 transition: "background 0.2s ease",
//               }}
//               onMouseEnter={(e) => (e.currentTarget.style.background = "#d1d5db")}
//               onMouseLeave={(e) => (e.currentTarget.style.background = "#e5e5e5")}
//             >
//               Créer un formulaire
//             </button>

//             <button
//               onClick={() => setSelectedOffer(null)}
//               style={{
//                 width: "100%",
//                 padding: "10px",
//                 borderRadius: "8px",
//                 border: "1px solid #d1d5db",
//                 background: "white",
//                 color: "#111827",
//                 cursor: "pointer",
//                 fontSize: "14px",
//                 fontWeight: "500",
//                 marginBottom: "24px",
//                 transition: "all 0.2s ease",
//                 textAlign: "left",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "8px",
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.background = "#f3f4f6";
//                 e.currentTarget.style.borderColor = "#9ca3af";
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.background = "white";
//                 e.currentTarget.style.borderColor = "#d1d5db";
//               }}
//             >
//               <span style={{ fontSize: "16px" }}>←</span>
//               <span>Retour aux offres</span>
//             </button>

//             {/* Dashboard */}
//             <div style={{
//               background: "#f9fafb",
//               borderRadius: "12px",
//               padding: "16px",
//               border: "1px solid #e5e5e5",
//             }}>
//               <h4 style={{
//                 fontSize: "14px",
//                 fontWeight: "600",
//                 color: "#111827",
//                 marginBottom: "12px",
//               }}>
//                 Dashboard
//               </h4>
//               <div style={{ display: "flex", gap: "12px" }}>
//                 <div style={{
//                   width: "50px",
//                   height: "50px",
//                   background: "#FECACA",
//                   borderRadius: "50%",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   fontSize: "14px",
//                   color: "#DC2626",
//                 }}>12%</div>
//                 <div style={{
//                   width: "50px",
//                   height: "50px",
//                   background: "#E0E7FF",
//                   borderRadius: "50%",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   fontSize: "14px",
//                   color: "#3B82F6",
//                 }}>23%</div>
//               </div>
//             </div>
//           </div>

//           {/* Colonne droite : Liste des candidats */}
//           <div style={{
//             flex: 1,
//             background: "white",
//             borderRadius: "12px",
//             boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
//             padding: "20px",
//             overflowY: "auto",
//           }}>
//             {/* Barre de recherche */}
//             <div style={{
//               display: "flex",
//               justifyContent: "flex-end",
//               marginBottom: "20px",
//             }}>
//               <div style={{ position: "relative", width: "300px" }}>
//                 <input
//                   type="text"
//                   placeholder="Recherche"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   style={{
//                     width: "100%",
//                     padding: "10px 14px 10px 40px",
//                     borderRadius: "24px",
//                     border: "1px solid #d1d5db",
//                     fontSize: "14px",
//                     background: "#f9fafb",
//                     color: "#111",
//                     boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
//                   }}
//                 />
//                 <div style={{
//                   position: "absolute",
//                   left: "14px",
//                   top: "50%",
//                   transform: "translateY(-50%)",
//                   color: "#6b7280",
//                   fontSize: "16px",
//                 }}>
//                   🔍
//                 </div>
//               </div>
//             </div>

//             {/* Tableau des candidats */}
//             <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
//               <thead>
//                 <tr style={{ backgroundColor: "#f3f4f6", borderBottom: "1px solid #d1d5db" }}>
//                   <th style={{ padding: "12px", textAlign: "left" }}>Nom</th>
//                   <th style={{ padding: "12px", textAlign: "left" }}>État de l’entretien</th>
//                   <th style={{ padding: "12px", textAlign: "left" }}>État de la demande</th>
//                   <th style={{ padding: "12px", textAlign: "right" }}>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredCandidates.map((candidate) => (
//                   <tr key={candidate.id} style={{ borderBottom: "1px solid #e5e5e5", height: "60px" }}>
//                     <td style={{ padding: "12px", display: "flex", alignItems: "center" }}>
//                       <div style={{
//                         width: "32px",
//                         height: "32px",
//                         borderRadius: "50%",
//                         background: "#e5e5e5",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         fontSize: "14px",
//                         color: "#6b7280",
//                       }}>
//                         {candidate.name.split(" ").map(n => n[0]).join("")}
//                       </div>
//                       <span style={{ marginLeft: "10px", fontWeight: "500", color: "#111827" }}>{candidate.name}</span>
//                     </td>
//                     <td style={{ padding: "12px" }}>
//                       <span style={{
//                         color: candidate.interviewStatus === "Enregistré" ? "#10B981" : "#6B7280"
//                       }}>
//                         {candidate.interviewStatus}
//                       </span>
//                     </td>
//                     <td style={{ padding: "12px" }}>
//                       <select
//                         style={{
//                           padding: "6px",
//                           borderRadius: "6px",
//                           border: "1px solid #ddd",
//                           background: candidate.requestStatus === "Lien envoyé" ? "#DCFCE7" : "#F3F4F6",
//                           color: candidate.requestStatus === "Lien envoyé" ? "#10B981" : "#6B7280",
//                         }}
//                         defaultValue={candidate.requestStatus}
//                       >
//                         <option value="Lien envoyé">Lien envoyé</option>
//                         <option value="Pas de demande">Pas de demande</option>
//                       </select>
//                     </td>
//                     <td style={{ padding: "12px", textAlign: "right" }}>
//                       <span style={{ fontSize: "16px", color: "#6b7280", cursor: "pointer" }} onClick={() => handleDelete(candidate.id)}>
//                         ...
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {showDeleteConfirm && (
//               <div style={{
//                 position: "fixed",
//                 top: "50%",
//                 left: "50%",
//                 transform: "translate(-50%, -50%)",
//                 background: "white",
//                 padding: "20px",
//                 borderRadius: "12px",
//                 boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
//                 zIndex: 1000,
//                 width: "300px",
//                 textAlign: "center",
//               }}>
//                 <h4 style={{ fontSize: "18px", fontWeight: "600", color: "#111827" }}>
//                   Êtes-vous sûr ?
//                 </h4>
//                 <p style={{ color: "#6b7280", marginTop: "10px" }}>
//                   Voulez-vous vraiment supprimer ce candidat ?
//                 </p>
//                 <div style={{ display: "flex", justifyContent: "space-around", marginTop: "20px" }}>
//                   <button
//                     onClick={cancelDelete}
//                     style={{
//                       padding: "8px 16px",
//                       borderRadius: "6px",
//                       border: "1px solid #ddd",
//                       background: "#f3f4f6",
//                       color: "#111",
//                       cursor: "pointer",
//                       fontSize: "14px",
//                     }}
//                   >
//                     Annuler
//                   </button>
//                   <button
//                     onClick={confirmDelete}
//                     style={{
//                       padding: "8px 16px",
//                       borderRadius: "6px",
//                       border: "none",
//                       background: "#ef4444",
//                       color: "white",
//                       cursor: "pointer",
//                       fontSize: "14px",
//                     }}
//                   >
//                     Supprimer
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }














// // src/pages/ManageInterviews.js
// import { useState, useEffect } from "react";
// import {
//   getJobOffers,
//   getInterviewForms,
//   createInterviewForm,
// } from "../services/hrService";
// import { getCandidatsByOffer } from "../services/candidatService";

// export default function ManageInterviews() {
//   const [offers, setOffers] = useState([]);
//   const [selectedOffer, setSelectedOffer] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [step, setStep] = useState("facile");
//   const [questions, setQuestions] = useState({
//     facile: Array(5).fill(""),
//     moyen: Array(5).fill(""),
//     difficile: Array(5).fill(""),
//   });

//   const [searchTerm, setSearchTerm] = useState("");
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
//   const [candidates, setCandidates] = useState([]);
//   const token = localStorage.getItem("access");

//   // Charger les offres
//   useEffect(() => {
//     const fetchOffers = async () => {
//       if (!token) return;
//       try {
//         const data = await getJobOffers(token);
//         setOffers(data);
//       } catch (err) {
//         console.error("Erreur lors de la récupération des offres :", err);
//       }
//     };
//     fetchOffers();
//   }, [token]);

//   // Charger les formulaires existants
//   useEffect(() => {
//     const loadForms = async () => {
//       if (!selectedOffer || showForm) return;

//       try {
//         const forms = await getInterviewForms(token, selectedOffer.id);
//         if (forms && forms.length > 0) {
//           const latest = forms[forms.length - 1];

//           const parseField = (data) => {
//             try {
//               return Array.isArray(data) ? data : JSON.parse(data);
//             } catch (e) {
//               return Array(5).fill("");
//             }
//           };

//           const loaded = {
//             facile: parseField(latest.questions_facile),
//             moyen: parseField(latest.questions_moyen),
//             difficile: parseField(latest.questions_difficile),
//           };

//           setQuestions(loaded);
//         }
//       } catch (err) {
//         console.error("Erreur lors du chargement des formulaires :", err);
//       }
//     };

//     loadForms();
//   }, [selectedOffer, showForm, token]);

//   // Charger les candidats pour l'offre sélectionnée
//   useEffect(() => {
//     const loadCandidates = async () => {
//       if (!selectedOffer) return setCandidates([]);
//       try {
//         const data = await getCandidatsByOffer(token, selectedOffer.id);
//         const mapped = data.map((d) => ({
//           id: d.id,
//           name: d.email || `Candidate ${d.id}`,
//           interviewStatus: d.interviewStatus || (d.has_video ? "Enregistré" : "Non Enregistré"),
//           requestStatus: d.requestStatus || "Pas de demande",
//         }));
//         setCandidates(mapped);
//       } catch (err) {
//         console.error("Erreur chargement candidats :", err);
//         setCandidates([]);
//       }
//     };

//     loadCandidates();
//   }, [selectedOffer, token]);

//   const handleChange = (level, index, value) => {
//     setQuestions((prev) => {
//       const updated = { ...prev };
//       updated[level][index] = value;
//       return updated;
//     });
//   };

//   const nextStep = () => {
//     if (step === "facile") setStep("moyen");
//     else if (step === "moyen") setStep("difficile");
//   };

//   const handleValidate = async () => {
//     if (!selectedOffer) return;

//     try {
//       await createInterviewForm(token, selectedOffer.id, {
//         questions_facile: questions.facile,
//         questions_moyen: questions.moyen,
//         questions_difficile: questions.difficile,
//       });

//       alert(`✅ Formulaire d'entretien enregistré pour l'offre "${selectedOffer.title}"`);
//       setShowForm(false);
//       setSelectedOffer(null);
//       setStep("facile");
//     } catch (err) {
//       const errorMsg = err.response?.data || err.message;
//       console.error("Erreur API :", errorMsg);
//       alert(`❌ Échec de création : ${JSON.stringify(errorMsg)}`);
//     }
//   };

//   const getStepInfo = () => {
//     if (step === "facile") return { label: "Facile", color: "#A7F3D0" };
//     if (step === "moyen") return { label: "Moyen", color: "#FCD34D" };
//     return { label: "Difficile", color: "#FCA5A5" };
//   };

//   const { label, color } = getStepInfo();

//   const filteredCandidates = candidates.filter((candidate) =>
//     candidate.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleDelete = (id) => {
//     setShowDeleteConfirm(id);
//   };

//   const confirmDelete = () => {
//     if (showDeleteConfirm) {
//       alert(`🗑 Candidat ${showDeleteConfirm} supprimé`);
//       setShowDeleteConfirm(null);
//     }
//   };

//   const cancelDelete = () => {
//     setShowDeleteConfirm(null);
//   };

//   return (
//     <div style={{ fontFamily: "Inter, sans-serif", background: "#f9fafb", minHeight: "100vh", padding: "20px" }}>
//       {!selectedOffer ? (
//         <div style={{ textAlign: "center", padding: "60px 0" }}>
//           <h1 style={{ fontSize: "36px", fontWeight: "700", color: "#111827", marginBottom: "16px" }}>
//             Créez un entretien pour l'offre parfaite
//           </h1>
//           <p style={{ color: "#6b7280", fontSize: "16px", marginBottom: "40px" }}>
//             Sélectionnez une offre ci-dessous pour commencer à rédiger vos questions d’entretien.
//           </p>

//           {offers.length === 0 ? (
//             <p style={{ color: "#6b7280" }}>Aucune offre disponible pour le moment.</p>
//           ) : (
//             <div style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
//               gap: "20px",
//             }}>
//               {offers.map((offre) => (
//                 <div
//                   key={offre.id}
//                   style={{
//                     background: "white",
//                     padding: "24px",
//                     borderRadius: "12px",
//                     boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
//                     cursor: "pointer",
//                     transition: "all 0.3s ease",
//                     border: "1px solid #e5e5e5",
//                     minHeight: "160px",
//                     display: "flex",
//                     flexDirection: "column",
//                     justifyContent: "space-between",
//                   }}
//                   onClick={() => setSelectedOffer(offre)}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.transform = "translateY(-4px)";
//                     e.currentTarget.style.boxShadow = "0 12px 25px rgba(0,0,0,0.12)";
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.transform = "translateY(0)";
//                     e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.08)";
//                   }}
//                 >
//                   <h3 style={{
//                     fontWeight: "600",
//                     fontSize: "18px",
//                     margin: "0 0 12px 0",
//                     lineHeight: "1.4",
//                   }}>
//                     {offre.title}
//                   </h3>
//                   <p style={{
//                     fontSize: "14px",
//                     color: "#6b7280",
//                     margin: "0 0 8px 0",
//                     lineHeight: "1.4",
//                   }}>
//                     {offre.location}
//                   </p>
//                   <p style={{
//                     fontSize: "14px",
//                     color: "#374151",
//                     margin: "0",
//                     overflow: "auto",
//                     maxHeight: "80px",
//                     lineHeight: "1.4",
//                     flex: 1,
//                     whiteSpace: "pre-line",
//                   }}>
//                     {offre.description}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       ) : showForm ? (
//         <div style={{ display: "flex", justifyContent: "center", marginTop: "40px" }}>
//           <div style={{
//             width: "700px",
//             background: "white",
//             padding: "30px",
//             borderRadius: "12px",
//             boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
//             border: "1px solid #e5e5e5",
//           }}>
//             <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", marginBottom: "20px" }}>
//               Entretien pour : {selectedOffer.title}
//             </h2>
//             <div style={{
//               display: "inline-block",
//               background: color,
//               padding: "6px 14px",
//               borderRadius: "12px",
//               fontSize: "14px",
//               fontWeight: "500",
//               color: "white",
//               marginBottom: "20px",
//             }}>
//               5 Qst niveau : {label}
//             </div>

//             {questions[step].map((q, i) => (
//               <div key={i} style={{ marginBottom: "16px" }}>
//                 <label style={{ display: "block", fontSize: "14px", marginBottom: "8px" }}>
//                   Question {i + 1}
//                 </label>
//                 <input
//                   type="text"
//                   value={q}
//                   onChange={(e) => handleChange(step, i, e.target.value)}
//                   placeholder={`Écrire la question ${i + 1}...`}
//                   style={{
//                     width: "100%",
//                     padding: "12px",
//                     borderRadius: "8px",
//                     border: "1px solid #ddd",
//                     fontSize: "14px",
//                   }}
//                 />
//               </div>
//             ))}

//             <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
//               <button
//                 onClick={() => setShowForm(false)}
//                 style={{
//                   padding: "10px 20px",
//                   borderRadius: "8px",
//                   border: "none",
//                   background: "#e5e5e5",
//                   color: "#111",
//                   cursor: "pointer",
//                   fontSize: "14px",
//                 }}
//               >
//                 Retour
//               </button>
//               {step !== "difficile" ? (
//                 <button
//                   onClick={nextStep}
//                   style={{
//                     padding: "10px 20px",
//                     borderRadius: "8px",
//                     border: "none",
//                     background: "#111",
//                     color: "white",
//                     cursor: "pointer",
//                     fontSize: "14px",
//                   }}
//                 >
//                   Suivant
//                 </button>
//               ) : (
//                 <button
//                   onClick={handleValidate}
//                   style={{
//                     padding: "10px 20px",
//                     borderRadius: "8px",
//                     border: "none",
//                     background: "#10B981",
//                     color: "white",
//                     cursor: "pointer",
//                     fontSize: "14px",
//                   }}
//                 >
//                   Valider
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       ) : (
//         // Ici tu peux ajouter la vue dashboard si nécessaire
//         <div>Aucune vue sélectionnée</div>
//       )}
//     </div>
//   );
// }




// src/pages/ManageInterviews.jsx
import { useState, useEffect } from "react";
import {
  getJobOffers,
  getInterviewForms,
  createInterviewForm,
} from "../services/hrService";
import { getCandidatsByOffer } from "../services/candidatService";

export default function ManageInterviews() {
  const [offers, setOffers] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState("facile");
  const [questions, setQuestions] = useState({
    facile: Array(5).fill(""),
    moyen: Array(5).fill(""),
    difficile: Array(5).fill(""),
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const token = localStorage.getItem("access");

  // Charger les offres
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const data = await getJobOffers(token);
        setOffers(data);
      } catch (err) {
        console.error("Erreur lors de la récupération des offres :", err);
      }
    };

    if (token) fetchOffers();
  }, [token]);

  // Charger les formulaires existants
  useEffect(() => {
    const loadForms = async () => {
      if (!selectedOffer || showForm) return;

      try {
        const forms = await getInterviewForms(token, selectedOffer.id);
        if (forms && forms.length > 0) {
          const latest = forms[forms.length - 1];

          const parseField = (data) => {
            try {
              return Array.isArray(data) ? data : JSON.parse(data);
            } catch (e) {
              return Array(5).fill("");
            }
          };

          const loaded = {
            facile: parseField(latest.questions_facile),
            moyen: parseField(latest.questions_moyen),
            difficile: parseField(latest.questions_difficile),
          };

          setQuestions(loaded);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des formulaires :", err);
      }
    };

    loadForms();
  }, [selectedOffer, showForm, token]);

  // Charger les candidats pour l'offre sélectionnée
  useEffect(() => {
    const loadCandidates = async () => {
      if (!selectedOffer) return setCandidates([]);
      try {
        const data = await getCandidatsByOffer(token, selectedOffer.id);
        const mapped = data.map((d) => ({
          id: d.id,
          name: d.email || `Candidate ${d.id}`,
          interviewStatus: d.interviewStatus || (d.has_video ? "Enregistré" : "Non Enregistré"),
          requestStatus: d.requestStatus || "Pas de demande",
        }));
        setCandidates(mapped);
      } catch (err) {
        console.error("Erreur chargement candidats :", err);
        setCandidates([]);
      }
    };

    loadCandidates();
  }, [selectedOffer, token]);

  const handleChange = (level, index, value) => {
    setQuestions((prev) => {
      const updated = { ...prev };
      updated[level][index] = value;
      return updated;
    });
  };

  const nextStep = () => {
    if (step === "facile") setStep("moyen");
    else if (step === "moyen") setStep("difficile");
  };

  const handleValidate = async () => {
    if (!selectedOffer) return;

    try {
      await createInterviewForm(token, selectedOffer.id, {
        questions_facile: questions.facile,
        questions_moyen: questions.moyen,
        questions_difficile: questions.difficile,
      });

      alert(`✅ Formulaire d'entretien enregistré pour l'offre "${selectedOffer.title}"`);
      setShowForm(false);
      setSelectedOffer(null);
      setStep("facile");
    } catch (err) {
      const errorMsg = err.response?.data || err.message;
      console.error("Erreur API :", errorMsg);
      alert(`❌ Échec de création : ${JSON.stringify(errorMsg)}`);
    }
  };

  const getStepInfo = () => {
    if (step === "facile") return { label: "Facile", color: "#A7F3D0" };
    if (step === "moyen") return { label: "Moyen", color: "#FCD34D" };
    return { label: "Difficile", color: "#FCA5A5" };
  };

  const { label, color } = getStepInfo();

  const filteredCandidates = candidates.filter((candidate) =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    setShowDeleteConfirm(id);
  };

  const confirmDelete = () => {
    if (showDeleteConfirm) {
      alert(`🗑 Candidat ${showDeleteConfirm} supprimé`);
      setShowDeleteConfirm(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#f9fafb", minHeight: "100vh", padding: "20px" }}>
      {!selectedOffer ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <h1 style={{ fontSize: "36px", fontWeight: "700", color: "#111827", marginBottom: "16px" }}>
            Créez un entretien pour l'offre parfaite
          </h1>
          <p style={{ color: "#6b7280", fontSize: "16px", marginBottom: "40px" }}>
            Sélectionnez une offre ci-dessous pour commencer à rédiger vos questions d’entretien.
          </p>

          {offers.length === 0 ? (
            <p style={{ color: "#6b7280" }}>Aucune offre disponible pour le moment.</p>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "20px",
            }}>
              {offers.map((offre) => (
                <div
                  key={offre.id}
                  style={{
                    background: "white",
                    padding: "24px",
                    borderRadius: "12px",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    border: "1px solid #e5e5e5",
                    minHeight: "160px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                  onClick={() => setSelectedOffer(offre)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 12px 25px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.08)";
                  }}
                >
                  <h3 style={{ fontWeight: "600", fontSize: "18px", margin: "0 0 12px 0", lineHeight: "1.4" }}>
                    {offre.title}
                  </h3>
                  <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 8px 0", lineHeight: "1.4" }}>
                    {offre.location}
                  </p>
                  <p style={{
                    fontSize: "14px",
                    color: "#374151",
                    margin: "0",
                    overflow: "auto",
                    maxHeight: "80px",
                    lineHeight: "1.4",
                    flex: 1,
                    whiteSpace: "pre-line",
                  }}>
                    {offre.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : showForm ? (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "40px" }}>
          <div style={{
            width: "700px",
            background: "white",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
            border: "1px solid #e5e5e5",
          }}>
            <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", marginBottom: "20px" }}>
              Entretien pour : {selectedOffer.title}
            </h2>
            <div style={{
              display: "inline-block",
              background: color,
              padding: "6px 14px",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "500",
              color: "white",
              marginBottom: "20px",
            }}>
              5 Qst niveau : {label}
            </div>

            {questions[step].map((q, i) => (
              <div key={i} style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "14px", marginBottom: "8px" }}>
                  Question {i + 1}
                </label>
                <input
                  type="text"
                  value={q}
                  onChange={(e) => handleChange(step, i, e.target.value)}
                  placeholder={`Écrire la question ${i + 1}...`}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    fontSize: "14px",
                  }}
                />
              </div>
            ))}

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
              <button
                onClick={() => setShowForm(false)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#e5e5e5",
                  color: "#111",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Retour
              </button>
              {step !== "difficile" ? (
                <button
                  onClick={nextStep}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#111",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Suivant
                </button>
              ) : (
                <button
                  onClick={handleValidate}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#10B981",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Valider
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        // Dashboard + candidats
        <div style={{ display: "flex", gap: "20px", height: "calc(100vh - 100px)" }}>
          {/* Colonne gauche */}
          <div style={{
            width: "280px",
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
            padding: "20px",
            flexShrink: 0,
          }}>
            <div style={{
              background: "#f9fafb",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "24px",
            }}>
              <h3 style={{ fontWeight: "600", fontSize: "16px", marginBottom: "8px" }}>
                {selectedOffer.title}
              </h3>
              <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
                {selectedOffer.description}
              </p>
            </div>

            <button
              onClick={() => setShowForm(true)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "none",
                background: "#e5e5e5",
                color: "#111",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: "12px",
              }}
            >
              Créer un formulaire
            </button>

            <button
              onClick={() => setSelectedOffer(null)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                background: "white",
                color: "#111827",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                textAlign: "left",
              }}
            >
              ← Retour aux offres
            </button>
          </div>

          {/* Colonne droite : Liste des candidats */}
          <div style={{
            flex: 1,
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
            padding: "20px",
            overflowY: "auto",
          }}>
            <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "16px" }}>
              Candidats
            </h2>

            <input
              type="text"
              placeholder="Rechercher un candidat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                marginBottom: "16px",
                fontSize: "14px",
              }}
            />

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
                  <th style={{ padding: "8px" }}>Email</th>
                  <th style={{ padding: "8px" }}>Statut Entretien</th>
                  <th style={{ padding: "8px" }}>Statut Demande</th>
                  <th style={{ padding: "8px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.map((c) => (
                  <tr key={c.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "8px" }}>{c.name}</td>
                    <td style={{ padding: "8px" }}>{c.interviewStatus}</td>
                    <td style={{ padding: "8px" }}>{c.requestStatus}</td>
                    <td style={{ padding: "8px" }}>
                      <button
                        onClick={() => handleDelete(c.id)}
                        style={{
                          padding: "6px 10px",
                          borderRadius: "6px",
                          border: "none",
                          background: "#ef4444",
                          color: "white",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {showDeleteConfirm && (
              <div style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}>
                <div style={{
                  background: "white",
                  padding: "30px",
                  borderRadius: "12px",
                  textAlign: "center",
                  width: "400px",
                }}>
                  <p>Voulez-vous vraiment supprimer le candidat {showDeleteConfirm} ?</p>
                  <div style={{ display: "flex", justifyContent: "space-around", marginTop: "20px" }}>
                    <button onClick={confirmDelete} style={{ padding: "10px 20px", background: "#10B981", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>
                      Oui
                    </button>
                    <button onClick={cancelDelete} style={{ padding: "10px 20px", background: "#e5e5e5", color: "#111", border: "none", borderRadius: "8px", cursor: "pointer" }}>
                      Non
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
