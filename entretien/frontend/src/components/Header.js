



// import { useNavigate } from "react-router-dom";
// import "./Header.css";

// export default function Header({ onNavigate }) {
//     const navigate = useNavigate();

//     const handleLogoClick = () => {
//         navigate("/recruteur"); // ← redirige vers la page recruteur
//     };

//     return (
//         <header className="header">
//             <div className="logo" onClick={handleLogoClick}>JOBGATE</div>
//             <nav>
//                 <button onClick={() => onNavigate("offers")}>Tableau de bord</button>
//                 <button onClick={() => onNavigate("create")}>Créer une offre</button>
//                 <button onClick={() => onNavigate("manageOffers")}>Gérer les offres</button>
//                 <button onClick={() => onNavigate("manageInterviews")}>Gérer les entretiens</button>
//             </nav>
//             <div className="profile-pic"></div>
//         </header>
//     );
// }










//correcte version 1


// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Header.css";

// export default function Header({ onNavigate, userEmail, onLogout }) {
//     const navigate = useNavigate();
//     const [dropdownOpen, setDropdownOpen] = useState(false);

//     const handleLogoClick = () => {
//         navigate("/recruteur"); // redirige vers la page recruteur
//     };

//     const firstLetter = userEmail?.charAt(0).toUpperCase() || "U";

//     return (
//         <header className="header">
//             <div className="logo" onClick={handleLogoClick}>JOBGATE</div>
            
//             <nav>
//                 <button onClick={() => onNavigate("offers")}>Tableau de bord</button>
//                 <button onClick={() => onNavigate("create")}>Créer une offre</button>
//                 <button onClick={() => onNavigate("manageOffers")}>Gérer les offres</button>
//                 <button onClick={() => onNavigate("manageInterviews")}>Gérer les entretiens</button>
//             </nav>

//             {/* Avatar utilisateur */}
//             <div style={{ position: "relative" }}>
//                 <div
//                     className="profile-pic"
//                     onClick={() => setDropdownOpen(!dropdownOpen)}
//                     style={{
//                         width: "40px",
//                         height: "40px",
//                         borderRadius: "50%",
//                         background: "#3b82f6",
//                         display: "flex",
//                         justifyContent: "center",
//                         alignItems: "center",
//                         fontWeight: "700",
//                         cursor: "pointer",
//                         color: "white",
//                         userSelect: "none",
//                     }}
//                 >
//                     {firstLetter}
//                 </div>

//                 {dropdownOpen && (
//                     <ul style={{
//                         position: "absolute",
//                         right: 0,
//                         marginTop: "10px",
//                         background: "white",
//                         color: "#111827",
//                         borderRadius: "10px",
//                         boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
//                         listStyle: "none",
//                         padding: "10px 0",
//                         width: "150px",
//                         zIndex: 10
//                     }}>
//                         <li
//                             style={{ padding: "10px 20px", cursor: "pointer", fontSize: "14px" }}
//                             onClick={() => alert("Changer la langue")}
//                         >
//                             Langue
//                         </li>
//                         <li
//                             style={{ padding: "10px 20px", cursor: "pointer", fontSize: "14px" }}
//                             onClick={onLogout}
//                         >
//                             Se déconnecter
//                         </li>
//                     </ul>
//                 )}
//             </div>
//         </header>
//     );
// }














//deuxieme version correcte



// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Header.css";

// export default function Header({ onNavigate }) {
//   const navigate = useNavigate();
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [userEmail, setUserEmail] = useState(null);

//   useEffect(() => {
//     // Récupérer l'email stocké lors du login
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       const parsed = JSON.parse(storedUser);
//       setUserEmail(parsed.email); // ✅ email bien chargé
//     }
//   }, []);

//   const handleLogoClick = () => {
//     navigate("/recruteur"); // redirige vers la page recruteur
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/"); // retour login
//   };

//   const firstLetter = userEmail?.charAt(0).toUpperCase() || "U";

//   return (
//     <header className="header">
//       <div className="logo" onClick={handleLogoClick}>
//         JOBGATE
//       </div>

//       <nav>
//         <button onClick={() => onNavigate("offers")}>Tableau de bord</button>
//         <button onClick={() => onNavigate("create")}>Créer une offre</button>
//         <button onClick={() => onNavigate("manageOffers")}>Gérer les offres</button>
//         <button onClick={() => onNavigate("manageInterviews")}>Gérer les entretiens</button>
//       </nav>

//       {/* Avatar utilisateur */}
//       <div style={{ position: "relative" }}>
//         <div
//           className="profile-pic"
//           onClick={() => setDropdownOpen(!dropdownOpen)}
//           style={{
//             width: "40px",
//             height: "40px",
//             borderRadius: "50%",
//             background: "#3b82f6",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             fontWeight: "700",
//             cursor: "pointer",
//             color: "white",
//             userSelect: "none",
//           }}
//         >
//           {firstLetter}
//         </div>

//         {dropdownOpen && (
//           <ul
//             style={{
//               position: "absolute",
//               right: 0,
//               marginTop: "10px",
//               background: "white",
//               color: "#111827",
//               borderRadius: "10px",
//               boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
//               listStyle: "none",
//               padding: "10px 0",
//               width: "150px",
//               zIndex: 10,
//             }}
//           >
//             <li
//               style={{
//                 padding: "10px 20px",
//                 cursor: "pointer",
//                 fontSize: "14px",
//               }}
//               onClick={() => alert("Changer la langue")}
//             >
//               Langue
//             </li>
//             <li
//               style={{
//                 padding: "10px 20px",
//                 cursor: "pointer",
//                 fontSize: "14px",
//               }}
//               onClick={handleLogout}
//             >
//               Se déconnecter
//             </li>
//           </ul>
//         )}
//       </div>
//     </header>
//   );
// }


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

export default function Header({ onNavigate }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [language, setLanguage] = useState("fr"); // Langue par défaut

  useEffect(() => {
    // Récupérer l'email stocké
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUserEmail(parsed.email);
    }

    // Charger la langue depuis localStorage
    const savedLang = localStorage.getItem("language");
    if (savedLang && ["fr", "en"].includes(savedLang)) {
      setLanguage(savedLang);
    } else {
      localStorage.setItem("language", "fr");
    }
  }, []);

  const handleLogoClick = () => {
    if (language === "fr") {
      navigate("/recruteur"); // ou une page d'accueil
    } else {
      navigate("/recruiter"); // exemple si tu as des routes multilingues
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    localStorage.removeItem("language"); // optionnel
    navigate("/"); // ✅ Redirige bien vers la page de login
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
    // Optionnel : rafraîchir ou mettre à jour l'interface
    alert(`Langue changée en ${lang === "fr" ? "français" : "english"}`);
    setDropdownOpen(false);
  };

  const firstLetter = userEmail?.charAt(0).toUpperCase() || "U";

  return (
    <header className="header">
      <div className="logo" onClick={handleLogoClick}>
        JOBGATE
      </div>

      <nav>
        <button onClick={() => onNavigate("offers")}>Tableau de bord</button>
        <button onClick={() => onNavigate("create")}>Créer une offre</button>
        <button onClick={() => onNavigate("Offers")}>Gérer les offres</button>
        <button onClick={() => onNavigate("manageInterviews")}>Gérer les entretiens</button>
      </nav>

      {/* Avatar utilisateur */}
      <div style={{ position: "relative" }}>
        <div
          className="profile-pic"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "#3b82f6",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: "700",
            cursor: "pointer",
            color: "white",
            userSelect: "none",
          }}
        >
          {firstLetter}
        </div>

        {dropdownOpen && (
          <ul
            style={{
              position: "absolute",
              right: 0,
              marginTop: "10px",
              background: "white",
              color: "#111827",
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              listStyle: "none",
              padding: "10px 0",
              width: "180px",
              zIndex: 10,
              fontSize: "14px",
            }}
          >
            {/* Menu Langue */}
            <li
              style={{
                padding: "10px 20px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              }}
            >
              <span>🌐 Changer la langue</span>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "8px",
                  justifyContent: "center",
                }}
              >
                <button
                  style={{
                    border: language === "fr" ? "2px solid #007bff" : "1px solid #ccc",
                    borderRadius: "4px",
                    padding: "4px 8px",
                    background: "#f0f0f0",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    changeLanguage("fr");
                  }}
                >
                  🇫🇷 FR
                </button>
                <button
                  style={{
                    border: language === "en" ? "2px solid #007bff" : "1px solid #ccc",
                    borderRadius: "4px",
                    padding: "4px 8px",
                    background: "#f0f0f0",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    changeLanguage("en");
                  }}
                >
                  🇬🇧 EN
                </button>
              </div>
            </li>

            {/* Déconnexion */}
            <li
              style={{
                padding: "10px 20px",
                cursor: "pointer",
                borderTop: "1px solid #eee",
                color: "#d32f2f",
                fontWeight: "500",
              }}
              onClick={handleLogout}
            >
              🔐 Se déconnecter
            </li>
          </ul>
        )}
      </div>
    </header>
  );
}