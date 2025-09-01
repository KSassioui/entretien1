// import axios from "axios";

// const API_URL = "http://127.0.0.1:8000/api/hr/offers/";

// export const getJobOffers = async (token) => {
//     const res = await axios.get(API_URL, {
//         headers: { Authorization: `Token ${token}` }
//     });
//     return res.data;
// };



// import axios from "axios";

// const API_URL = "http://127.0.0.1:8000/api/hr/offers/";

// // Récupérer toutes les offres
// export const getJobOffers = async (token) => {
//     const res = await axios.get(API_URL, {
//         headers: { Authorization: `Bearer ${token}` }   // ✅ JWT utilise Bearer
//     });
//     return res.data;
// };

// // Créer une offre
// export const createJobOffer = async (token, offerData) => {
//     const res = await axios.post(API_URL, offerData, {
//         headers: { 
//             Authorization: `Bearer ${token}`,  // ✅ JWT
//             "Content-Type": "application/json"
//         }
//     });
//     return res.data;
// };













// import axios from "axios";

// const API_URL = "http://127.0.0.1:8000/api/hr/offers/";

// // Récupérer toutes les offres
// export const getJobOffers = async (token) => {
//     const res = await axios.get(API_URL, {
//         headers: { Authorization: `JWT ${token}` }
//     });
//     return res.data;
// };

// // Créer une offre
// export const createJobOffer = async (token, offerData) => {
//     const res = await axios.post(API_URL, offerData, {
//         headers: { 
//             Authorization: `JWT ${token}`,
//             "Content-Type": "application/json"
//         }
//     });
//     return res.data;
// };









// import axios from "axios";

// const API_URL = "http://127.0.0.1:8000/api/hr/offers/";

// // Récupérer toutes les offres
// export const getJobOffers = async (token) => {
//     const res = await axios.get(API_URL, {
//         headers: { Authorization: `JWT ${token}` }
//     });
//     return res.data;
// };

// // Créer une offre
// export const createJobOffer = async (token, offerData) => {
//     const res = await axios.post(API_URL, offerData, {
//         headers: { 
//             Authorization: `JWT ${token}`,
//             "Content-Type": "application/json"
//         }
//     });
//     return res.data;
// };

// // Récupérer les formulaires d'une offre
// export const getInterviewForms = async (token, offerId) => {
//     const res = await axios.get(`${API_URL}${offerId}/interview-forms/`, {
//         headers: { Authorization: `JWT ${token}` }
//     });
//     return res.data;
// };

// // Créer ou mettre à jour un formulaire d'entretien
// export const createInterviewForm = async (token, offerId, level, questions) => {
//     const res = await axios.post(`${API_URL}${offerId}/interview-form/create/`, 
//         { level, questions },
//         { headers: { Authorization: `JWT ${token}`, "Content-Type": "application/json" } }
//     );
//     return res.data;
// };






// services/hrService.js
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/hr/offers/";

// ✅ Récupérer toutes les offres
export const getJobOffers = async (token) => {
    const res = await axios.get(API_URL, {
        headers: { Authorization: `JWT ${token}` }
    });
    return res.data;
};

// ✅ Créer une offre
export const createJobOffer = async (token, offerData) => {
    const res = await axios.post(API_URL, offerData, {
        headers: { 
            Authorization: `JWT ${token}`,
            "Content-Type": "application/json"
        }
    });
    return res.data;
};

// ✅ Récupérer les formulaires d'une offre
export const getInterviewForms = async (token, offerId) => {
    const res = await axios.get(`${API_URL}${offerId}/interview-forms/`, {
        headers: { Authorization: `JWT ${token}` }
    });
    return res.data;
};

// ✅ Créer un formulaire d'entretien (CORRIGÉ)
export const createInterviewForm = async (token, offerId, formData) => {
    const res = await axios.post(
        `${API_URL}${offerId}/interview-forms/`,
        { 
            job_offer: offerId,
            ...formData 
        },
        {
            headers: { 
                Authorization: `JWT ${token}`,
                "Content-Type": "application/json"
            }
        }
    );
    return res.data;
};
























































































































