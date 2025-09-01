// // src/pages/InterviewTest.jsx

// import React from "react";
// import MinimalHeader from "../components/MinimalHeader"; // ✅ Import

// function InterviewTest() {
//   return (
//     <div className="interview-preparation-page">
//       {/* ✅ Utilise le composant MinimalHeader */}
//       <MinimalHeader />

//       {/* Contenu principal */}
//       <main className="preparation-content">
//         <h1>Guide de préparation</h1>

//         <p className="intro-text">
//           Bonjour,<br />
//           Félicitations ! Vous êtes invité à passer un entretien vidéo différé dans le cadre de votre candidature. 
//           Voici quelques conseils pour vous aider à réussir cette étape sereinement.
//         </p>

//         <ul className="checklist">
//           <li>
//             <span className="check-icon">✅</span>
//             Vérifiez votre caméra, micro et connexion Internet.
//           </li>
//           <li>
//             <span className="check-icon">✅</span>
//             Installez-vous dans un lieu calme et bien éclairé.
//           </li>
//           <li>
//             <span className="check-icon">✅</span>
//             Respectez le temps imparti et prenez un instant pour réfléchir avant de répondre.
//           </li>
//           <li>
//             <span className="check-icon">✅</span>
//             Parlez clairement et restez naturel(le), votre motivation compte beaucoup.
//           </li>
//           <li>
//             <span className="check-icon">✅</span>
//             La plateforme vous permettra de tester votre matériel avant de commencer.
//           </li>
//         </ul>

//         <button 
//           className="start-test-btn"
//           onClick={() => window.location.href = "/interview/camera-test"}
//         >
//           Commencer le test
//         </button>
//       </main>

//       {/* Styles */}
//       <style jsx>{`
//         .interview-preparation-page {
//           min-height: 100vh;
//           background-color: #f9fafb;
//           font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
//           color: #1f2937;
//         }

//         .preparation-content {
//           max-width: 800px;
//           margin: 60px auto;
//           padding: 40px;
//           background-color: white;
//           border-radius: 16px;
//           box-shadow: 0 10px 25px rgba(0,0,0,0.05);
//           border: 1px solid #e5e7eb;
//         }

//         h1 {
//           font-size: 24px;
//           color: #1f2937;
//           margin-bottom: 20px;
//           font-weight: 700;
//           text-align: center;
//         }

//         .intro-text {
//           font-size: 16px;
//           line-height: 1.6;
//           color: #374151;
//           margin: 20px 0 30px 0;
//           text-align: left;
//         }

//         .checklist {
//           list-style: none;
//           padding: 0;
//           margin: 30px 0;
//           text-align: left;
//         }

//         .checklist li {
//           padding: 12px 0;
//           display: flex;
//           align-items: center;
//           font-size: 15px;
//           color: #374151;
//         }

//         .check-icon {
//           margin-right: 10px;
//           font-size: 14px;
//           color: #10b981;
//           background-color: #d1fae5;
//           padding: 3px;
//           border-radius: 3px;
//           width: 18px;
//           text-align: center;
//         }

//         .start-test-btn {
//           display: block;
//           width: 100%;
//           padding: 16px;
//           font-size: 18px;
//           font-weight: 600;
//           color: white;
//           background-color: #3b82f6;
//           border: none;
//           border-radius: 12px;
//           cursor: pointer;
//           transition: background-color 0.3s ease;
//           box-shadow: 0 2px 4px rgba(0,0,0,0.1);
//           margin-top: 30px;
//         }

//         .start-test-btn:hover {
//           background-color: #2563eb;
//         }
//       `}</style>
//     </div>
//   );
// }

// export default InterviewTest;


// frontend/src/components/Header.jsx

import React from "react";

function Header() {
  return (
    <header className="preparation-header">
      <div className="logo" onClick={() => (window.location.href = "/")}>
        JOB GATE
      </div>
      <div className="user-avatar">
        <span>K</span>
      </div>

      {/* Styles intégrés directement dans le composant */}
      <style jsx>{`
        .preparation-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 40px;
          background-color: white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 100;
          border-bottom: 1px solid #e5e7eb;
        }

        .logo {
          font-size: 20px;
          font-weight: 700;
          color: #374151;
          cursor: pointer;
        }

        .logo:hover {
          color: #2563eb;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          background-color: #3b82f6;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          font-weight: 700;
          cursor: pointer;
        }

        .user-avatar:hover {
          transform: scale(1.05);
          transition: transform 0.2s ease;
        }
      `}</style>
    </header>
  );
}

export default Header;