
import { useState } from "react";
import { createJobOffer } from "../services/hrService";

export default function CreateOffer({ token, onOfferCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) return alert("Le titre est requis.");
    if (!description.trim()) return alert("La description est requise.");
    if (!location.trim()) return alert("Le lieu est requis.");
    if (!token) return alert("Erreur : vous n'êtes pas connecté.");

    try {
      const newOffer = await createJobOffer(token, { title, description, location });
      onOfferCreated(newOffer);
      setTitle(""); setDescription(""); setLocation("");
      alert("Offre créée avec succès !");
    } catch (err) {
      console.error(err.response?.data || err.message);
      if (err.response?.status === 401) alert("Session expirée. Veuillez vous reconnecter.");
      else if (err.response?.data) alert("Erreur : " + JSON.stringify(err.response.data));
      else alert("Erreur réseau ou serveur.");
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      marginTop: "40px",
      fontFamily: "Arial, sans-serif",
      background: "#f9fafb",
      minHeight: "80vh",
      padding: "20px"
    }}>
      <form onSubmit={handleSubmit} style={{
        background: "white",
        padding: "40px",
        borderRadius: "16px",
        boxShadow: "0 12px 25px rgba(0,0,0,0.15)",
        width: "500px",
      }}>
        <h2 style={{
          textAlign: "center",
          marginBottom: "30px",
          color: "#111827",
          fontSize: "26px",
          fontWeight: "700",
        }}>
          Créer une nouvelle offre
        </h2>

        <label style={{ display: "block", marginBottom: "15px", fontWeight: "500", color: "#374151" }}>
          Titre :
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Développeur React"
            required
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "6px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              outline: "none",
              fontSize: "14px",
              transition: "border-color 0.3s",
            }}
            onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
            onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
          />
        </label>

        <label style={{ display: "block", marginBottom: "15px", fontWeight: "500", color: "#374151" }}>
          Description :
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Décrivez le poste..."
            rows="5"
            required
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "6px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              outline: "none",
              fontSize: "14px",
              transition: "border-color 0.3s",
              resize: "vertical"
            }}
            onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
            onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
          />
        </label>

        <label style={{ display: "block", marginBottom: "25px", fontWeight: "500", color: "#374151" }}>
          Lieu :
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Ex: Rabat, Maroc"
            required
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "6px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              outline: "none",
              fontSize: "14px",
              transition: "border-color 0.3s",
            }}
            onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
            onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
          />
        </label>

        <button type="submit" style={{
          width: "100%",
          padding: "14px",
          borderRadius: "10px",
          border: "none",
          background: "#3b82f6",
          color: "white",
          fontSize: "16px",
          fontWeight: "600",
          cursor: "pointer",
          transition: "background 0.3s",
        }}
        onMouseEnter={e => e.target.style.background = "#2563eb"}
        onMouseLeave={e => e.target.style.background = "#3b82f6"}
        >
          Créer l'offre
        </button>
      </form>
    </div>
  );
}
