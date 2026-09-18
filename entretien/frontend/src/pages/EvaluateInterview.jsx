// src/pages/EvaluateInterview.jsx

import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000/api"; // 🔧 Ajuste si ton backend est ailleurs

export default function EvaluateInterview({ match }) {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("access");

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/entretien/entretiens/${match.params.uuid}/responses/`,
          {
            headers: { Authorization: `JWT ${token}` },
          }
        );
        setResponses(res.data);
      } catch (err) {
        console.error("Erreur chargement des réponses :", err);
        setError("Impossible de charger les vidéos. Vérifiez le lien ou réessayez plus tard.");
      } finally {
        setLoading(false);
      }
    };

    if (match.params.uuid) {
      fetchResponses();
    }
  }, [match.params.uuid, token]);

  const handleSaveEvaluation = async (reponseId, note, commentaire) => {
    try {
      await axios.post(
        `${API_URL}/entretien/entretiens/save-evaluation/`,
        { reponse_id: reponseId, note, commentaire },
        {
          headers: { Authorization: `JWT ${token}` },
        }
      );
      // Optionnel : mettre à jour localement
      setResponses((prev) =>
        prev.map((r) =>
          r.id === reponseId ? { ...r, note, commentaire } : r
        )
      );
    } catch (err) {
      console.error("Échec de la sauvegarde de l'évaluation :", err);
      alert("❌ Échec de l'enregistrement de la note.");
    }
  };

  const average = responses.length > 0
    ? (responses.reduce((sum, r) => sum + (r.note || 0), 0) / responses.length).toFixed(1)
    : 0;

  return (
    <div style={{ padding: "20px", fontFamily: "Inter, sans-serif", background: "#f9fafb", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", marginBottom: "20px" }}>
        Évaluation des réponses vidéo
      </h1>

      {loading ? (
        <p>Chargement des vidéos en cours...</p>
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
  );
}