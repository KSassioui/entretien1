//vertion 2 correcte

// import { useState, useEffect } from "react";
// import Header from "../components/Header";
// import Offers from "./Offers";

// import CreateOffer from "./CreateOffer";
// import { getJobOffers } from "../services/hrService";
// import ManageInterviews from "./ManageInterviews"; // <-- importer le nouveau composant
// import ManageOffers from "./ManageOffers"; 

// export default function Dashboard({ token }) {
//     const [page, setPage] = useState("offers");
//     const [offers, setOffers] = useState([]);

//     // Charger les offres au montage
//     useEffect(() => {
//         getJobOffers(token).then((data) => setOffers(data));
//     }, [token]);

//     // Quand une offre est créée → l’ajouter dans le state
//     const handleOfferCreated = (newOffer) => {
//         setOffers((prevOffers) => [newOffer, ...prevOffers]);
//         setPage("offers"); // revenir sur la liste après création
//     };

//     const renderPage = () => {
//         switch (page) {
//             case "offers":
//                 return <Offers offers={offers} />;
//             case "create":
//                 return <CreateOffer token={token} onOfferCreated={handleOfferCreated} />;
//             case "manageOffers":
//                 return <ManageOffers title="Gérer les offres" />;
//             case "manageInterviews":
//                 return <ManageInterviews />; // <-- utiliser ManageInterviews au lieu de BlankPage
//             default:
//                 return <Offers offers={offers} />;
//         }
//     };

//     return (
//         <div>
//             <Header onNavigate={setPage} />
//             {renderPage()}
//         </div>
//     );
// }




import { useState, useEffect } from "react";
import Header from "../components/Header";
import Offers from "./Offers";

import CreateOffer from "./CreateOffer";
import { getJobOffers } from "../services/hrService";
import ManageInterviews from "./ManageInterviews"; // <-- importer le nouveau composant


export default function Dashboard() {
    const [page, setPage] = useState("offers");
    const [offers, setOffers] = useState([]);
    const token = localStorage.getItem("access");
    // Charger les offres au montage
    useEffect(() => {
        getJobOffers(token).then((data) => setOffers(data));
    }, [token]);

    // Quand une offre est créée → l’ajouter dans le state
    const handleOfferCreated = (newOffer) => {
        setOffers((prevOffers) => [newOffer, ...prevOffers]);
        setPage("offers"); // revenir sur la liste après création
    };

    const renderPage = () => {
        switch (page) {
            case "offers":
                return <Offers offers={offers} />;
            case "create":
                return <CreateOffer token={token} onOfferCreated={handleOfferCreated} />;
            case "offers":
                return <Offers title="Gérer les offres" />;
            case "manageInterviews":
                return <ManageInterviews />; // <-- utiliser ManageInterviews au lieu de BlankPage
            default:
                return <Offers offers={offers} />;
        }
    };

    return (
        <div>
            <Header onNavigate={setPage} />
            {renderPage()}
        </div>
    );
}













