

//pour le traitement des candidats supp

// src/pages/ManageOffers.js
import { useState } from "react";
import "./ManageOffers.css";

export default function ManageOffers() {
  // Données simulées : ajout du champ `isProcessed` pour savoir si traité
  const initialCandidates = [
    {
      id: 1,
      photo: "/assets/images/profile1.jpg",
      name: "Alice Dupont",
      cv: "CV_Alice.pdf",
      videoInterview: "https://example.com/video1.mp4",
      interviewStatus: "En cours",
      candidateStatus: "Sélectionné",
      note: 8.5,
      comment: "Très bon profil, compétences solides.",
      notifications: 2,
      isProcessed: false, // ❌ Non traité
    },
    {
      id: 2,
      photo: "/assets/images/profile2.jpg",
      name: "Marc Martin",
      cv: "CV_Marc.pdf",
      videoInterview: "https://example.com/video2.mp4",
      interviewStatus: "Terminé",
      candidateStatus: "Refusé",
      note: 6.0,
      comment: "Compétences insuffisantes.",
      notifications: 0,
      isProcessed: true, // ✅ Déjà traité
    },
    {
      id: 3,
      photo: "/assets/images/profile3.jpg",
      name: "Sophie Lefèvre",
      cv: "CV_Sophie.pdf",
      videoInterview: "https://example.com/video3.mp4",
      interviewStatus: "À venir",
      candidateStatus: "En attente",
      note: 9.2,
      comment: "Excellent profil, à revoir.",
      notifications: 1,
      isProcessed: false, // ❌ Non traité
    },
  ];

  // On utilise useState pour pouvoir mettre à jour l'état
  const [candidates, setCandidates] = useState(initialCandidates);

  // Fonction pour basculer le statut "traité / non traité"
  const toggleProcessed = (id) => {
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, isProcessed: !c.isProcessed } : c
      )
    );
  };

  // Filtrer les candidats
  const untreated = candidates.filter((c) => !c.isProcessed);
  const treated = candidates.filter((c) => c.isProcessed);

  return (
    <div className="manage-offers-container">
      <h1>Gérer les Candidatures</h1>
      <p>Organisez les candidatures : passez un dossier de "non traité" à "traité" en un clic.</p>

      <div className="kanban-layout">
        {/* Colonne : Non traités */}
        <div className="column">
          <h2>📋 Non traités ({untreated.length})</h2>
          {untreated.length === 0 ? (
            <p className="empty">Aucun candidat en attente de traitement</p>
          ) : (
            <div className="candidates-grid">
              {untreated.map((candidate) => (
                <div key={candidate.id} className="candidate-card">
                  <img
                    src={candidate.photo}
                    alt={candidate.name}
                    className="candidate-photo"
                  />
                  <div className="candidate-info">
                    <h3>{candidate.name}</h3>
                    <p><strong>CV:</strong> <a href={candidate.cv} target="_blank" rel="noopener noreferrer">Télécharger</a></p>
                    <p><strong>État entretien:</strong> <span className={`status ${candidate.interviewStatus.toLowerCase().replace(" ", "-")}`}>{candidate.interviewStatus}</span></p>
                    <p><strong>Statut:</strong> <span className={`status ${candidate.candidateStatus.toLowerCase().replace(" ", "-")}`}>{candidate.candidateStatus}</span></p>
                    <p><strong>Note:</strong> {candidate.note}/10</p>
                  </div>
                  <div className="actions">
                    <button
                      className="btn-primary"
                      onClick={() => toggleProcessed(candidate.id)}
                    >
                      Marquer comme traité
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Colonne : Traités */}
        <div className="column">
          <h2>✅ Traités ({treated.length})</h2>
          {treated.length === 0 ? (
            <p className="empty">Aucun candidat traité pour le moment</p>
          ) : (
            <div className="candidates-grid">
              {treated.map((candidate) => (
                <div key={candidate.id} className="candidate-card treated">
                  <img
                    src={candidate.photo}
                    alt={candidate.name}
                    className="candidate-photo"
                  />
                  <div className="candidate-info">
                    <h3>{candidate.name}</h3>
                    <p><strong>CV:</strong> <a href={candidate.cv} target="_blank" rel="noopener noreferrer">Télécharger</a></p>
                    <p><strong>État entretien:</strong> <span className={`status ${candidate.interviewStatus.toLowerCase().replace(" ", "-")}`}>{candidate.interviewStatus}</span></p>
                    <p><strong>Statut:</strong> <span className={`status ${candidate.candidateStatus.toLowerCase().replace(" ", "-")}`}>{candidate.candidateStatus}</span></p>
                    <p><strong>Note:</strong> {candidate.note}/10</p>
                    <p><strong>Commentaire:</strong> {candidate.comment}</p>
                  </div>
                  <div className="actions">
                    <button
                      className="btn-secondary"
                      onClick={() => toggleProcessed(candidate.id)}
                    >
                      Annuler le traitement
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}