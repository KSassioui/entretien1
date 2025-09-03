// import axios from "axios";

// const API_URL = "http://localhost:8000/api"; // adapte selon ton backend

// export const getCandidatsByOffer = async (token, offerId) => {
//   // Note: endpoint is mounted under /api/candidat/offers/<id>/candidats/
//   const res = await axios.get(${API_URL}/candidat/offers/${offerId}/candidats/, {
//     // project uses JWT prefix elsewhere in the frontend
//     headers: { Authorization: JWT ${token} },
//   });
//   return res.data;
// };


import axios from "axios";

const API_URL = "http://localhost:8000/api"; // adapte selon ton backend

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
