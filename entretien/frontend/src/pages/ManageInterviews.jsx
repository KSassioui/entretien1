// // src/pages/ManageInterviews.js
// import { useState, useEffect } from "react";
// import {
//   getJobOffers,
//   getInterviewForms,
//   createInterviewForm,
// } from "../services/hrService";
// import { getCandidatsByOffer, sendInterviewLink } from "../services/candidatService"; // ✅ Ajout de sendInterviewLink
// import StatusDropdown from "../components/StatusDropdown"; // ✅ Import du composant

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

//   // Charger les candidats pour l'offre sélectionnée
//   useEffect(() => {
//     const loadCandidates = async () => {
//       if (!selectedOffer) return setCandidates([]);
//       try {
//         const data = await getCandidatsByOffer(token, selectedOffer.id);
//         const mapped = data.map((d) => ({
//           id: d.id,
//           name: d.email || `Candidat ${d.id}`,
//           interviewStatus: d.has_video ? "Enregistré" : "Non Enregistré",
//           requestStatus: d.has_video ? "Lien envoyé" : "Pas de demande",
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

//   // ✅ Fonction pour envoyer le lien
//   const handleSendLink = async (applicationId) => {
//     try {
//       await sendInterviewLink(token, applicationId);
//       setCandidates((prev) =>
//         prev.map((c) =>
//           c.id === applicationId
//             ? { ...c, requestStatus: "Lien envoyé", interviewStatus: "Non Enregistré" }
//             : c
//         )
//       );
//       alert("✅ Lien envoyé avec succès !");
//     } catch (err) {
//       alert("❌ Échec de l'envoi du lien.");
//     }
//   };

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
//                   <h3 style={{ fontWeight: "600", fontSize: "18px", margin: "0 0 12px 0", lineHeight: "1.4" }}>
//                     {offre.title}
//                   </h3>
//                   <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 8px 0", lineHeight: "1.4" }}>
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
//             <div style={{
//               background: "#f9fafb",
//               borderRadius: "12px",
//               padding: "16px",
//               marginBottom: "24px",
//             }}>
//               <h3 style={{ fontWeight: "600", fontSize: "16px", marginBottom: "8px" }}>
//                 {selectedOffer.title}
//               </h3>
//               <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
//                 {selectedOffer.description}
//               </p>
//             </div>

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
//               }}
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
//                 textAlign: "left",
//               }}
//             >
//               ← Retour aux offres
//             </button>
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
//             <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "16px" }}>
//               Candidats
//             </h2>

//             <input
//               type="text"
//               placeholder="Rechercher un candidat..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               style={{
//                 width: "100%",
//                 padding: "10px",
//                 borderRadius: "8px",
//                 border: "1px solid #ddd",
//                 marginBottom: "16px",
//                 fontSize: "14px",
//               }}
//             />

//             <table style={{ width: "100%", borderCollapse: "collapse" }}>
//               <thead>
//                 <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
//                   <th style={{ padding: "8px" }}>Email</th>
//                   <th style={{ padding: "8px" }}>Statut Entretien</th>
//                   <th style={{ padding: "8px" }}>Statut Demande</th>
//                   <th style={{ padding: "8px" }}>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredCandidates.map((c) => (
//                   <tr key={c.id} style={{ borderBottom: "1px solid #eee" }}>
//                     <td style={{ padding: "8px" }}>{c.name}</td>
//                     <td style={{ padding: "8px" }}>{c.interviewStatus}</td>
//                     <td style={{ padding: "8px" }}>
//                       {/* ✅ Dropdown ici */}
//                       <StatusDropdown
//                         status={c.requestStatus}
//                         onSend={() => handleSendLink(c.id)}
//                       />
//                     </td>
//                     <td style={{ padding: "8px" }}>
//                       <button
//                         onClick={() => handleDelete(c.id)}
//                         style={{
//                           padding: "6px 10px",
//                           borderRadius: "6px",
//                           border: "none",
//                           background: "#ef4444",
//                           color: "white",
//                           cursor: "pointer",
//                           fontSize: "12px",
//                         }}
//                       >
//                         Supprimer
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {showDeleteConfirm && (
//               <div style={{
//                 position: "fixed",
//                 top: 0,
//                 left: 0,
//                 width: "100%",
//                 height: "100%",
//                 background: "rgba(0,0,0,0.5)",
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//               }}>
//                 <div style={{
//                   background: "white",
//                   padding: "30px",
//                   borderRadius: "12px",
//                   textAlign: "center",
//                   width: "400px",
//                 }}>
//                   <p>Voulez-vous vraiment supprimer le candidat {showDeleteConfirm} ?</p>
//                   <div style={{ display: "flex", justifyContent: "space-around", marginTop: "20px" }}>
//                     <button onClick={confirmDelete} style={{ padding: "10px 20px", background: "#10B981", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>
//                       Oui
//                     </button>
//                     <button onClick={cancelDelete} style={{ padding: "10px 20px", background: "#e5e5e5", color: "#111", border: "none", borderRadius: "8px", cursor: "pointer" }}>
//                       Non
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
















// // src/pages/ManageInterviews.js

// import { useState, useEffect } from "react";
// import {
//   getJobOffers,
//   getInterviewForms,
//   createInterviewForm,
// } from "../services/hrService";
// import { getCandidatsByOffer, sendInterviewLink } from "../services/candidatService";
// import StatusDropdown from "../components/StatusDropdown";

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

//   // Charger les candidats pour l'offre sélectionnée
//   useEffect(() => {
//     const loadCandidates = async () => {
//       if (!selectedOffer) return setCandidates([]);
//       try {
//         const data = await getCandidatsByOffer(token, selectedOffer.id);
//         const mapped = data.map((d) => ({
//           id: d.id,
//           name: d.email || `Candidat ${d.id}`,
//           interviewStatus: d.has_video ? "Enregistré" : "Non Enregistré",
//           requestStatus: d.has_video ? "Lien envoyé" : "Pas de demande",
//           entretien_uuid: d.entretien_uuid, // ✅ Ajouté
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

//   // ✅ Fonction pour envoyer le lien
//   const handleSendLink = async (applicationId) => {
//     try {
//       await sendInterviewLink(token, applicationId);
//       setCandidates((prev) =>
//         prev.map((c) =>
//           c.id === applicationId
//             ? { ...c, requestStatus: "Lien envoyé", interviewStatus: "Non Enregistré" }
//             : c
//         )
//       );
//       alert("✅ Lien envoyé avec succès !");
//     } catch (err) {
//       alert("❌ Échec de l'envoi du lien.");
//     }
//   };

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
//                   <h3 style={{ fontWeight: "600", fontSize: "18px", margin: "0 0 12px 0", lineHeight: "1.4" }}>
//                     {offre.title}
//                   </h3>
//                   <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 8px 0", lineHeight: "1.4" }}>
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
//             <div style={{
//               background: "#f9fafb",
//               borderRadius: "12px",
//               padding: "16px",
//               marginBottom: "24px",
//             }}>
//               <h3 style={{ fontWeight: "600", fontSize: "16px", marginBottom: "8px" }}>
//                 {selectedOffer.title}
//               </h3>
//               <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
//                 {selectedOffer.description}
//               </p>
//             </div>

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
//               }}
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
//                 textAlign: "left",
//               }}
//             >
//               ← Retour aux offres
//             </button>
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
//             <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "16px" }}>
//               Candidats
//             </h2>

//             <input
//               type="text"
//               placeholder="Rechercher un candidat..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               style={{
//                 width: "100%",
//                 padding: "10px",
//                 borderRadius: "8px",
//                 border: "1px solid #ddd",
//                 marginBottom: "16px",
//                 fontSize: "14px",
//               }}
//             />

//             <table style={{ width: "100%", borderCollapse: "collapse" }}>
//               <thead>
//                 <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
//                   <th style={{ padding: "8px" }}>Email</th>
//                   <th style={{ padding: "8px" }}>Statut Entretien</th>
//                   <th style={{ padding: "8px" }}>Statut Demande</th>
//                   <th style={{ padding: "8px" }}>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredCandidates.map((c) => (
//                   <tr key={c.id} style={{ borderBottom: "1px solid #eee" }}>
//                     <td style={{ padding: "8px" }}>
//                       {c.entretien_uuid ? (
//                         <button
//                           onClick={() => window.open(`/evaluate-interview/${c.entretien_uuid}`, '_blank')}
//                           style={{
//                             background: "transparent",
//                             border: "none",
//                             color: "#007BFF",
//                             textDecoration: "underline",
//                             cursor: "pointer",
//                             fontSize: "14px",
//                             fontWeight: "500",
//                             padding: 0,
//                           }}
//                         >
//                           {c.name}
//                         </button>
//                       ) : (
//                         <span>{c.name}</span>
//                       )}
//                     </td>
//                     <td style={{ padding: "8px" }}>{c.interviewStatus}</td>
//                     <td style={{ padding: "8px" }}>
//                       <StatusDropdown
//                         status={c.requestStatus}
//                         onSend={() => handleSendLink(c.id)}
//                       />
//                     </td>
//                     <td style={{ padding: "8px" }}>
//                       <button
//                         onClick={() => handleDelete(c.id)}
//                         style={{
//                           padding: "6px 10px",
//                           borderRadius: "6px",
//                           border: "none",
//                           background: "#ef4444",
//                           color: "white",
//                           cursor: "pointer",
//                           fontSize: "12px",
//                         }}
//                       >
//                         Supprimer
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {showDeleteConfirm && (
//               <div style={{
//                 position: "fixed",
//                 top: 0,
//                 left: 0,
//                 width: "100%",
//                 height: "100%",
//                 background: "rgba(0,0,0,0.5)",
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//               }}>
//                 <div style={{
//                   background: "white",
//                   padding: "30px",
//                   borderRadius: "12px",
//                   textAlign: "center",
//                   width: "400px",
//                 }}>
//                   <p>Voulez-vous vraiment supprimer le candidat {showDeleteConfirm} ?</p>
//                   <div style={{ display: "flex", justifyContent: "space-around", marginTop: "20px" }}>
//                     <button onClick={confirmDelete} style={{ padding: "10px 20px", background: "#10B981", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>
//                       Oui
//                     </button>
//                     <button onClick={cancelDelete} style={{ padding: "10px 20px", background: "#e5e5e5", color: "#111", border: "none", borderRadius: "8px", cursor: "pointer" }}>
//                       Non
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }








// // src/pages/ManageInterviews.js

// import { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   getJobOffers,
//   getInterviewForms,
//   createInterviewForm,
// } from "../services/hrService";
// import { getCandidatsByOffer, sendInterviewLink } from "../services/candidatService";
// import StatusDropdown from "../components/StatusDropdown";

// const API_URL = "http://localhost:8000/api"; // Ajuste si besoin

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
//   const [selectedCandidate, setSelectedCandidate] = useState(null); // ✅ Candidat sélectionné
//   const [responses, setResponses] = useState([]); // ✅ Réponses du candidat
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
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

//   // Charger les candidats pour l'offre sélectionnée
//   useEffect(() => {
//     const loadCandidates = async () => {
//       if (!selectedOffer) return setCandidates([]);
//       try {
//         const data = await getCandidatsByOffer(token, selectedOffer.id);
//         const mapped = data.map((d) => ({
//           id: d.id,
//           name: d.email || `Candidat ${d.id}`,
//           interviewStatus: d.has_video ? "Enregistré" : "Non Enregistré",
//           requestStatus: d.has_video ? "Lien envoyé" : "Pas de demande",
//           entretien_uuid: d.entretien_uuid,
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

//   // ✅ Fonction pour envoyer le lien
//   const handleSendLink = async (applicationId) => {
//     try {
//       await sendInterviewLink(token, applicationId);
//       setCandidates((prev) =>
//         prev.map((c) =>
//           c.id === applicationId
//             ? { ...c, requestStatus: "Lien envoyé", interviewStatus: "Non Enregistré" }
//             : c
//         )
//       );
//       alert("✅ Lien envoyé avec succès !");
//     } catch (err) {
//       alert("❌ Échec de l'envoi du lien.");
//     }
//   };

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

//   // ✅ Charger les réponses du candidat
//   const loadCandidateResponses = async (uuid) => {
//     if (!uuid) return;
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await axios.get(
//         `${API_URL}/entretien/entretiens/${uuid}/responses/`,
//         { headers: { Authorization: `JWT ${token}` } }
//       );
//       setResponses(res.data);
//       setSelectedCandidate(uuid);
//     } catch (err) {
//       setError("Impossible de charger les vidéos.");
//       console.error("Erreur :", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Sauvegarder une évaluation
//   const handleSaveEvaluation = async (reponseId, note, commentaire) => {
//     try {
//       await axios.post(
//         `${API_URL}/entretien/entretiens/save-evaluation/`,
//         { reponse_id: reponseId, note, commentaire },
//         { headers: { Authorization: `JWT ${token}` } }
//       );
//       setResponses((prev) =>
//         prev.map((r) =>
//           r.id === reponseId ? { ...r, note, commentaire } : r
//         )
//       );
//     } catch (err) {
//       console.error("Échec de la sauvegarde :", err);
//       alert("❌ Échec de l'enregistrement");
//     }
//   };

//   const average = responses.length > 0
//     ? (responses.reduce((sum, r) => sum + (r.note || 0), 0) / responses.length).toFixed(1)
//     : 0;

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
//                   <h3 style={{ fontWeight: "600", fontSize: "18px", margin: "0 0 12px 0", lineHeight: "1.4" }}>
//                     {offre.title}
//                   </h3>
//                   <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 8px 0", lineHeight: "1.4" }}>
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
//             <div style={{
//               background: "#f9fafb",
//               borderRadius: "12px",
//               padding: "16px",
//               marginBottom: "24px",
//             }}>
//               <h3 style={{ fontWeight: "600", fontSize: "16px", marginBottom: "8px" }}>
//                 {selectedOffer.title}
//               </h3>
//               <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
//                 {selectedOffer.description}
//               </p>
//             </div>

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
//               }}
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
//                 textAlign: "left",
//               }}
//             >
//               ← Retour aux offres
//             </button>
//           </div>

//           {/* Colonne droite : Liste des candidats OU vidéos */}
//           <div style={{
//             flex: 1,
//             background: "white",
//             borderRadius: "12px",
//             boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
//             padding: "20px",
//             overflowY: "auto",
//           }}>
//             {selectedCandidate ? (
//               // ✅ Afficher les vidéos
//               <div>
//                 <button
//                   onClick={() => setSelectedCandidate(null)}
//                   style={{
//                     background: "#e5e5e5",
//                     border: "none",
//                     padding: "8px 16px",
//                     borderRadius: "6px",
//                     marginBottom: "16px",
//                     cursor: "pointer",
//                   }}
//                 >
//                   ← Retour aux candidats
//                 </button>

//                 <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "20px" }}>
//                   Évaluation des réponses vidéo
//                 </h2>

//                 {loading ? (
//                   <p>Chargement...</p>
//                 ) : error ? (
//                   <p style={{ color: "red" }}>{error}</p>
//                 ) : responses.length === 0 ? (
//                   <p style={{ color: "#6b7280", fontStyle: "italic" }}>
//                     Aucune réponse vidéo enregistrée pour le moment.
//                   </p>
//                 ) : (
//                   <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "30px" }}>
//                     <thead>
//                       <tr style={{ borderBottom: "2px solid #ddd", backgroundColor: "#f3f4f6" }}>
//                         <th style={{ padding: "12px", textAlign: "left" }}>Vidéo</th>
//                         <th style={{ padding: "12px", textAlign: "left" }}>Question</th>
//                         <th style={{ padding: "12px", textAlign: "left" }}>Note /20</th>
//                         <th style={{ padding: "12px", textAlign: "left" }}>Commentaire</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {responses.map((r) => (
//                         <tr key={r.id} style={{ borderBottom: "1px solid #eee" }}>
//                           <td style={{ padding: "12px" }}>
//                             <video
//                               controls
//                               style={{ width: "100%", maxWidth: "300px", height: "auto", borderRadius: "8px" }}
//                             >
//                               <source src={r.video_url} type="video/webm" />
//                               Votre navigateur ne supporte pas la vidéo.
//                             </video>
//                           </td>
//                           <td style={{ padding: "12px", color: "#374151", lineHeight: "1.4" }}>
//                             {r.question}
//                           </td>
//                           <td style={{ padding: "12px" }}>
//                             <input
//                               type="number"
//                               min="0"
//                               max="20"
//                               defaultValue={r.note || ""}
//                               onBlur={(e) =>
//                                 handleSaveEvaluation(r.id, parseInt(e.target.value) || 0, r.commentaire)
//                               }
//                               style={{
//                                 width: "60px",
//                                 padding: "6px",
//                                 borderRadius: "6px",
//                                 border: "1px solid #ddd",
//                               }}
//                             />
//                           </td>
//                           <td style={{ padding: "12px" }}>
//                             <textarea
//                               defaultValue={r.commentaire}
//                               onBlur={(e) =>
//                                 handleSaveEvaluation(r.id, r.note, e.target.value)
//                               }
//                               rows="2"
//                               style={{
//                                 width: "100%",
//                                 padding: "6px",
//                                 borderRadius: "6px",
//                                 border: "1px solid #ddd",
//                                 resize: "vertical",
//                               }}
//                             />
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 )}

//                 {responses.length > 0 && (
//                   <div
//                     style={{
//                       fontSize: "18px",
//                       fontWeight: "bold",
//                       color: "#111827",
//                       marginTop: "20px",
//                       padding: "16px",
//                       backgroundColor: "#f0fdf4",
//                       borderRadius: "8px",
//                       display: "inline-block",
//                     }}
//                   >
//                     📊 Moyenne finale :{" "}
//                     <span style={{ color: "#059669" }}>{average}/20</span>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               // ✅ Afficher la liste des candidats
//               <>
//                 <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "16px" }}>
//                   Candidats
//                 </h2>

//                 <input
//                   type="text"
//                   placeholder="Rechercher un candidat..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   style={{
//                     width: "100%",
//                     padding: "10px",
//                     borderRadius: "8px",
//                     border: "1px solid #ddd",
//                     marginBottom: "16px",
//                     fontSize: "14px",
//                   }}
//                 />

//                 <table style={{ width: "100%", borderCollapse: "collapse" }}>
//                   <thead>
//                     <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
//                       <th style={{ padding: "8px" }}>Email</th>
//                       <th style={{ padding: "8px" }}>Statut Entretien</th>
//                       <th style={{ padding: "8px" }}>Statut Demande</th>
//                       <th style={{ padding: "8px" }}>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredCandidates.map((c) => (
//                       <tr key={c.id} style={{ borderBottom: "1px solid #eee" }}>
//                         <td style={{ padding: "8px" }}>
//                           {c.entretien_uuid ? (
//                             <button
//                               onClick={() => loadCandidateResponses(c.entretien_uuid)}
//                               style={{
//                                 background: "transparent",
//                                 border: "none",
//                                 color: "#007BFF",
//                                 textDecoration: "underline",
//                                 cursor: "pointer",
//                                 fontSize: "14px",
//                                 fontWeight: "500",
//                                 padding: 0,
//                               }}
//                             >
//                               {c.name}
//                             </button>
//                           ) : (
//                             <span>{c.name}</span>
//                           )}
//                         </td>
//                         <td style={{ padding: "8px" }}>{c.interviewStatus}</td>
//                         <td style={{ padding: "8px" }}>
//                           <StatusDropdown
//                             status={c.requestStatus}
//                             onSend={() => handleSendLink(c.id)}
//                           />
//                         </td>
//                         <td style={{ padding: "8px" }}>
//                           <button
//                             onClick={() => handleDelete(c.id)}
//                             style={{
//                               padding: "6px 10px",
//                               borderRadius: "6px",
//                               border: "none",
//                               background: "#ef4444",
//                               color: "white",
//                               cursor: "pointer",
//                               fontSize: "12px",
//                             }}
//                           >
//                             Supprimer
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </>
//             )}

//             {showDeleteConfirm && (
//               <div style={{
//                 position: "fixed",
//                 top: 0,
//                 left: 0,
//                 width: "100%",
//                 height: "100%",
//                 background: "rgba(0,0,0,0.5)",
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//               }}>
//                 <div style={{
//                   background: "white",
//                   padding: "30px",
//                   borderRadius: "12px",
//                   textAlign: "center",
//                   width: "400px",
//                 }}>
//                   <p>Voulez-vous vraiment supprimer le candidat {showDeleteConfirm} ?</p>
//                   <div style={{ display: "flex", justifyContent: "space-around", marginTop: "20px" }}>
//                     <button onClick={confirmDelete} style={{ padding: "10px 20px", background: "#10B981", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>
//                       Oui
//                     </button>
//                     <button onClick={cancelDelete} style={{ padding: "10px 20px", background: "#e5e5e5", color: "#111", border: "none", borderRadius: "8px", cursor: "pointer" }}>
//                       Non
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }










// version correcte

// src/pages/ManageInterviews.js

import { useState, useEffect } from "react";
import axios from "axios";
import {
  getJobOffers,
  getInterviewForms,
  createInterviewForm,
} from "../services/hrService";
import { getCandidatsByOffer, sendInterviewLink } from "../services/candidatService";
import StatusDropdown from "../components/StatusDropdown";

const API_URL = "http://localhost:8000/api"; // ✅ Vérifie ton port

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
  const [selectedCandidate, setSelectedCandidate] = useState(null); // ✅ Candidat sélectionné
  const [responses, setResponses] = useState([]); // ✅ Réponses du candidat
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
          name: d.email || `Candidat ${d.id}`,
          interviewStatus: d.has_video ? "Enregistré" : "Non Enregistré",
          requestStatus: d.has_video ? "Lien envoyé" : "Pas de demande",
          entretien_uuid: d.entretien_uuid,
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

  // ✅ Fonction pour envoyer le lien
  const handleSendLink = async (applicationId) => {
    try {
      await sendInterviewLink(token, applicationId);
      setCandidates((prev) =>
        prev.map((c) =>
          c.id === applicationId
            ? { ...c, requestStatus: "Lien envoyé", interviewStatus: "Non Enregistré" }
            : c
        )
      );
      alert("✅ Lien envoyé avec succès !");
    } catch (err) {
      alert("❌ Échec de l'envoi du lien.");
    }
  };

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

  // ✅ Charger les réponses du candidat
  const loadCandidateResponses = async (uuid) => {
    if (!uuid) return;
    setLoading(true);
    setError(null);
    try {
      // ✅ URL CORRIGÉE : /entretiens/... (pas /entretien/entretiens/)
      const res = await axios.get(
        `${API_URL}/entretiens/${uuid}/responses/`,
        { headers: { Authorization: `JWT ${token}` } }
      );
      setResponses(res.data);
      setSelectedCandidate(uuid);
    } catch (err) {
      setError("Impossible de charger les vidéos.");
      console.error("Erreur :", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Sauvegarder une évaluation
  const handleSaveEvaluation = async (reponseId, note, commentaire) => {
    try {
      // ✅ URL CORRIGÉE
      await axios.post(
        `${API_URL}/entretiens/save-evaluation/`,
        { reponse_id: reponseId, note, commentaire },
        { headers: { Authorization: `JWT ${token}` } }
      );
      setResponses((prev) =>
        prev.map((r) =>
          r.id === reponseId ? { ...r, note, commentaire } : r
        )
      );
    } catch (err) {
      console.error("Échec de la sauvegarde :", err);
      alert("❌ Échec de l'enregistrement");
    }
  };

  const average = responses.length > 0
    ? (responses.reduce((sum, r) => sum + (r.note || 0), 0) / responses.length).toFixed(1)
    : 0;

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

          {/* Colonne droite : Liste des candidats OU vidéos */}
          <div style={{
            flex: 1,
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
            padding: "20px",
            overflowY: "auto",
          }}>
            {selectedCandidate ? (
              // ✅ Afficher les vidéos
              <div>
                <button
                  onClick={() => setSelectedCandidate(null)}
                  style={{
                    background: "#e5e5e5",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    marginBottom: "16px",
                    cursor: "pointer",
                  }}
                >
                  ← Retour aux candidats
                </button>

                <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "20px" }}>
                  Évaluation des réponses vidéo
                </h2>

                {loading ? (
                  <p>Chargement...</p>
                ) : error ? (
                  <p style={{ color: "red" }}>{error}</p>
                ) : responses.length === 0 ? (
                  <p style={{ color: "#6b7280", fontStyle: "italic" }}>
                    Aucune réponse vidéo enregistrée pour le moment.
                  </p>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "30px" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid #ddd", backgroundColor: "#f3f4f6" }}>
                        <th style={{ padding: "12px", textAlign: "left" }}>Vidéo</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Question</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Note /20</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Commentaire</th>
                      </tr>
                    </thead>
                    <tbody>
                      {responses.map((r) => (
                        <tr key={r.id} style={{ borderBottom: "1px solid #eee" }}>
                          <td style={{ padding: "12px" }}>
                            <video
                              controls
                              style={{ width: "100%", maxWidth: "300px", height: "auto", borderRadius: "8px" }}
                            >
                              <source src={r.video_url} type="video/webm" />
                              Votre navigateur ne supporte pas la vidéo.
                            </video>
                          </td>
                          <td style={{ padding: "12px", color: "#374151", lineHeight: "1.4" }}>
                            {r.question}
                          </td>
                          <td style={{ padding: "12px" }}>
                            <input
                              type="number"
                              min="0"
                              max="20"
                              defaultValue={r.note || ""}
                              onBlur={(e) =>
                                handleSaveEvaluation(r.id, parseInt(e.target.value) || 0, r.commentaire)
                              }
                              style={{
                                width: "60px",
                                padding: "6px",
                                borderRadius: "6px",
                                border: "1px solid #ddd",
                              }}
                            />
                          </td>
                          <td style={{ padding: "12px" }}>
                            <textarea
                              defaultValue={r.commentaire}
                              onBlur={(e) =>
                                handleSaveEvaluation(r.id, r.note, e.target.value)
                              }
                              rows="2"
                              style={{
                                width: "100%",
                                padding: "6px",
                                borderRadius: "6px",
                                border: "1px solid #ddd",
                                resize: "vertical",
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {responses.length > 0 && (
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "#111827",
                      marginTop: "20px",
                      padding: "16px",
                      backgroundColor: "#f0fdf4",
                      borderRadius: "8px",
                      display: "inline-block",
                    }}
                  >
                    📊 Moyenne finale :{" "}
                    <span style={{ color: "#059669" }}>{average}/20</span>
                  </div>
                )}
              </div>
            ) : (
              // ✅ Afficher la liste des candidats
              <>
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
                        <td style={{ padding: "8px" }}>
                          {c.entretien_uuid ? (
                            <button
                              onClick={() => loadCandidateResponses(c.entretien_uuid)}
                              style={{
                                background: "transparent",
                                border: "none",
                                color: "#007BFF",
                                textDecoration: "underline",
                                cursor: "pointer",
                                fontSize: "14px",
                                fontWeight: "500",
                                padding: 0,
                              }}
                            >
                              {c.name}
                            </button>
                          ) : (
                            <span>{c.name}</span>
                          )}
                        </td>
                        <td style={{ padding: "8px" }}>{c.interviewStatus}</td>
                        <td style={{ padding: "8px" }}>
                          <StatusDropdown
                            status={c.requestStatus}
                            onSend={() => handleSendLink(c.id)}
                          />
                        </td>
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
              </>
            )}

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




