// import { useState, useEffect } from "react";
// import axios from "axios";
// import CandidatHeader from "../components/CandidatHeader";

// export default function Candidat() {
//   const [page, setPage] = useState("offers");
//   const [offers, setOffers] = useState([]);
//   const [appliedOffers, setAppliedOffers] = useState([]);
//   const token = localStorage.getItem("access");

//   // Charger les offres et les candidatures existantes
//   useEffect(() => {
//     if (!token) return;

//     // Récupérer toutes les offres
//     axios
//       .get("http://127.0.0.1:8000/api/hr/offers/", {
//         headers: { Authorization: `JWT ${token}` },
//       })
//       .then((res) => setOffers(res.data))
//       .catch(() => setOffers([]));

//     // Récupérer les offres déjà postulé par le candidat
//     axios
//       .get("http://127.0.0.1:8000/api/candidat/applied/", {
//         headers: { Authorization: `JWT ${token}` },
//       })
//       .then((res) => setAppliedOffers(res.data.map((o) => o.id)))
//       .catch(() => setAppliedOffers([]));
//   }, [token]);

//   // Fonction pour postuler à une offre
//   const handleApply = (offerId) => {
//     if (!token) return;

//     axios
//       .post(
//         "http://127.0.0.1:8000/api/candidat/apply/",
//         { offer_id: offerId },
//         { headers: { Authorization: `JWT ${token}` } }
//       )
//       .then(() => {
//         alert("✅ Vous avez postulé avec succès !");
//         setAppliedOffers([...appliedOffers, offerId]);
//       })
//       .catch((err) => {
//         console.error(err);
//         alert("❌ Erreur lors de la candidature.");
//       });
//   };

//   return (
//     <div>
//       <CandidatHeader onNavigate={setPage} />

//       {page === "offers" && (
//         <div className="offers-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", padding: "20px" }}>
//           {offers.length === 0 && <p>Aucune offre disponible.</p>}

//           {offers.map((offer) => (
//             <div key={offer.id} className="offer-card" style={{ background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
//               <div className="offer-header" style={{ marginBottom: "12px" }}>
//                 <h3 className="offer-title">{offer.title}</h3>
//               </div>
//               <p>{offer.description}</p>
//               <p>
//                 <b>Lieu:</b> {offer.location}
//               </p>

//               {/* Bouton Postuler */}
//               {appliedOffers.includes(offer.id) ? (
//                 <button
//                   disabled
//                   style={{ marginTop: "12px", padding: "8px 12px", borderRadius: "8px", background: "#d1fae5", color: "#065f46", border: "none", cursor: "not-allowed" }}
//                 >
//                   Déjà postulé
//                 </button>
//               ) : (
//                 <button
//                   onClick={() => handleApply(offer.id)}
//                   style={{ marginTop: "12px", padding: "8px 12px", borderRadius: "8px", background: "#10b981", color: "white", border: "none", cursor: "pointer" }}
//                 >
//                   Postuler
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>
//       )}

//       {page === "profile" && (
//         <div style={{ padding: "20px" }}>
//           <h2>Profil Candidat</h2>
//           <p>Bienvenue dans votre espace personnel.</p>
//           {/* Tu peux afficher ici plus d'infos sur le profil */}
//         </div>
//       )}
//     </div>
//   );
// }






//aya
// import { useState, useEffect } from "react";
// import axios from "axios";
// import CandidatHeader from "../components/CandidatHeader";

// export default function Candidat() {
//   const [page, setPage] = useState("offers");
//   const [offers, setOffers] = useState([]);
//   const [appliedOffers, setAppliedOffers] = useState([]);
//   const token = localStorage.getItem("access");

//   // Charger les offres et les candidatures existantes
//   useEffect(() => {
//     if (!token) return;

//     // Récupérer toutes les offres
//     axios
//       .get("http://127.0.0.1:8000/api/hr/offers/", {
//         headers: { Authorization: JWT ${token} },
//       })
//       .then((res) => setOffers(res.data))
//       .catch(() => setOffers([]));

//     // Récupérer les offres déjà postulé par le candidat
//     axios
//       .get("http://127.0.0.1:8000/api/candidat/applied/", {
//         headers: { Authorization: JWT ${token} },
//       })
//       .then((res) => setAppliedOffers(res.data.map((o) => o.id)))
//       .catch(() => setAppliedOffers([]));
//   }, [token]);

//   // Fonction pour postuler à une offre
//   const handleApply = (offerId) => {
//     if (!token) return;

//     axios
//       .post(
//         "http://127.0.0.1:8000/api/candidat/apply/",
//         { offer_id: offerId },
//         { headers: { Authorization: JWT ${token} } }
//       )
//       .then(() => {
//         alert("✅ Vous avez postulé avec succès !");
//         setAppliedOffers([...appliedOffers, offerId]);
//       })
//       .catch((err) => {
//         console.error(err);
//         alert("❌ Erreur lors de la candidature.");
//       });
//   };

//   return (
//     <div>
//       <CandidatHeader onNavigate={setPage} />

//       {page === "offers" && (
//         <div className="offers-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", padding: "20px" }}>
//           {offers.length === 0 && <p>Aucune offre disponible.</p>}

//           {offers.map((offer) => (
//             <div key={offer.id} className="offer-card" style={{ background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
//               <div className="offer-header" style={{ marginBottom: "12px" }}>
//                 <h3 className="offer-title">{offer.title}</h3>
//               </div>
//               <p>{offer.description}</p>
//               <p>
//                 <b>Lieu:</b> {offer.location}
//               </p>

//               {/* Bouton Postuler */}
//               {appliedOffers.includes(offer.id) ? (
//                 <button
//                   disabled
//                   style={{ marginTop: "12px", padding: "8px 12px", borderRadius: "8px", background: "#d1fae5", color: "#065f46", border: "none", cursor: "not-allowed" }}
//                 >
//                   Déjà postulé
//                 </button>
//               ) : (
//                 <button
//                   onClick={() => handleApply(offer.id)}
//                   style={{ marginTop: "12px", padding: "8px 12px", borderRadius: "8px", background: "#10b981", color: "white", border: "none", cursor: "pointer" }}
//                 >
//                   Postuler
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>
//       )}

//       {page === "profile" && (
//         <div style={{ padding: "20px" }}>
//           <h2>Profil Candidat</h2>
//           <p>Bienvenue dans votre espace personnel.</p>
//           {/* Tu peux afficher ici plus d'infos sur le profil */}
//         </div>
//       )}
//     </div>
//   );
// }



import { useState, useEffect } from "react";
import axios from "axios";
import CandidatHeader from "../components/CandidatHeader";

export default function Candidat() {
  const [page, setPage] = useState("offers");
  const [offers, setOffers] = useState([]);
  const [appliedOffers, setAppliedOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("access");

  // Charger les offres et les candidatures existantes
  useEffect(() => {
    if (!token) return;

    setLoading(true);

    // Récupérer toutes les offres
    axios
      .get("http://127.0.0.1:8000/api/hr/offers/", {
        headers: { Authorization: `JWT ${token}` },
      })
      .then((res) => setOffers(res.data))
      .catch(() => setOffers([]));

    // Récupérer les offres déjà postulé par le candidat
    axios
      .get("http://127.0.0.1:8000/api/candidat/applied/", {
        headers: { Authorization: `JWT ${token}` },
      })
      .then((res) => setAppliedOffers(res.data.map((o) => o.id)))
      .catch(() => setAppliedOffers([]))
      .finally(() => setLoading(false));
  }, [token]);

  // Fonction pour postuler à une offre
  const handleApply = (offerId) => {
    if (!token) return;

    axios
      .post(
        "http://127.0.0.1:8000/api/candidat/apply/",
        { offer_id: offerId },
        { headers: { Authorization: `JWT ${token}` } }
      )
      .then(() => {
        alert("✅ Vous avez postulé avec succès !");
        setAppliedOffers([...appliedOffers, offerId]);
      })
      .catch((err) => {
        console.error(err);
        alert(
          err.response?.data?.detail || "❌ Erreur lors de la candidature."
        );
      });
  };

  if (!token) {
    return <p>⚠️ Vous devez être connecté pour voir cette page.</p>;
  }

  if (loading) {
    return <p>Chargement des offres...</p>;
  }

  return (
    <div>
      <CandidatHeader onNavigate={setPage} />

      {page === "offers" && (
        <div
          className="offers-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
            padding: "20px",
          }}
        >
          {offers.length === 0 && <p>Aucune offre disponible.</p>}

          {offers.map((offer) => (
            <div
              key={offer.id}
              className="offer-card"
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
            >
              <div className="offer-header" style={{ marginBottom: "12px" }}>
                <h3 className="offer-title">{offer.title}</h3>
              </div>
              <p>{offer.description}</p>
              <p>
                <b>Lieu:</b> {offer.location}
              </p>

              {appliedOffers.includes(offer.id) ? (
                <button
                  disabled
                  style={{
                    marginTop: "12px",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    background: "#d1fae5",
                    color: "#065f46",
                    border: "none",
                    cursor: "not-allowed",
                  }}
                >
                  Déjà postulé
                </button>
              ) : (
                <button
                  onClick={() => handleApply(offer.id)}
                  style={{
                    marginTop: "12px",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    background: "#10b981",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Postuler
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {page === "profile" && (
        <div style={{ padding: "20px" }}>
          <h2>Profil Candidat</h2>
          <p>Bienvenue dans votre espace personnel.</p>
          {/* Ajouter ici d'autres infos sur le profil si besoin */}
        </div>
      )}
    </div>
  );
}
