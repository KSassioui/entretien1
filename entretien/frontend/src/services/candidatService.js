

// import axios from "axios";

// const API_URL = "http://localhost:8000/api"; // adapte selon ton backend

// export const getCandidatsByOffer = async (token, offerId) => {
//   try {
//     const res = await axios.get(`${API_URL}/candidat/offers/${offerId}/candidats/`, {
//       headers: { Authorization: `JWT ${token}` },
//     });
//     return res.data;
//   } catch (err) {
//     console.error("Erreur lors de la récupération des candidats :", err);
//     throw err;
//   }
// };



// src/services/candidatService.js
import axios from "axios";

const API_URL = "http://localhost:8000/api"; // 🔧 Adapte si ton backend est ailleurs

export const getCandidatsByOffer = async (token, offerId) => {
  try {
    const res = await axios.get(`${API_URL}/candidat/offers/${offerId}/candidats/`, {
      headers: { Authorization: `JWT ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Erreur lors de la récupération des candidats :", err);
    throw err;
  }
};

// ✅ Nouvelle fonction : Envoyer le lien d'entretien
export const sendInterviewLink = async (token, applicationId) => {
  const res = await axios.post(
    `${API_URL}/candidat/send-interview-link/`,
    { application_id: applicationId },
    {
      headers: {
        Authorization: `JWT ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return res.data;
};