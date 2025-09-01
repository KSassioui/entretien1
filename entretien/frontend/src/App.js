


// import { Routes, Route, Link } from "react-router-dom";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";

// function App() {
//   return (
//     // Ne remets pas Router ici car il est déjà dans index.js
//     <div>
//       {/* <nav>
//         <Link to="/login">Login</Link> | <Link to="/signup">Signup</Link>
//       </nav> */}
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//       </Routes>
//     </div>
//   );
// }

// export default App;




// import { Routes, Route } from "react-router-dom";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import Candidat from "./pages/Candidat";
// import Recruteur from "./pages/Recruteur";

// function App() {
//   return (
//     <Routes>
//       <Route path="/login" element={<Login />} />
//       <Route path="/signup" element={<Signup />} />
//       <Route path="/candidat" element={<Candidat />} />
//       <Route path="/recruteur" element={<Recruteur />} />
//     </Routes>
//   );
// }

// export default App;









//vertion correcte 1

// import { Routes, Route } from "react-router-dom";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import Candidat from "./pages/Candidat";
// import Recruteur from "./pages/Recruteur"; // Va contenir le Dashboard
// import Dashboard from "./pages/Dashboard"; // Le composant que je t’ai donné
// import "./index.css";

// function App() {
//   const token = localStorage.getItem("token");

//   return (
//     <Routes>
//       <Route path="/login" element={<Login />} />
//       <Route path="/signup" element={<Signup />} />
//       <Route path="/candidat" element={<Candidat />} />

//       {/* Si tu veux garder l’ancien Recruteur */}
//       <Route path="/recruteur" element={<Recruteur />} />

//       {/* Si tu veux que la page recruteur charge directement le dashboard */}
//       <Route path="/recruteur/dashboard" element={<Dashboard token={token} />} />
//     </Routes>
//   );
// }

// export default App;





// import { Routes, Route } from "react-router-dom";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import Candidat from "./pages/Candidat";
// import Recruteur from "./pages/Recruteur";
// import Dashboard from "./pages/Dashboard";
// import InterviewTest from "./pages/InterviewTest"; // 👈 Nouveau composant
// import CameraTest from "./pages/CameraTest";
// import Interview from "./pages/Interview";
// import "./index.css";

// function App() {
//   const token = localStorage.getItem("access"); // ⚠️ Attention : c’est "access", pas "token"

//   return (
//     <Routes>
//       {/* ✅ Ajoute cette ligne : / redirige vers /login */}
//       <Route path="/" element={<Login />} />
      
//       <Route path="/login" element={<Login />} />
//       <Route path="/signup" element={<Signup />} />
//       <Route path="/candidat" element={<Candidat />} />
//       <Route path="/recruteur" element={<Recruteur />} />
//       <Route path="/recruteur/dashboard" element={<Dashboard token={token} />} />
//       <Route path="/interview" element={<InterviewTest />} /> {/* 👈 Nouvelle route */}
//       <Route path="/interview/camera-test" element={<CameraTest />} />
//       <Route path="/interview/start" element={<Interview />} /> {/* 👈 Nouvelle route */}
//     </Routes>
//   );
// }

// export default App;


// App.js
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Candidat from "./pages/Candidat";
import Recruteur from "./pages/Recruteur";
import Dashboard from "./pages/Dashboard";
import InterviewTest from "./pages/InterviewTest";
import CameraTest from "./pages/CameraTest";
import Interview from "./pages/Interview";
import "./index.css";

function App() {
  const token = localStorage.getItem("access");

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/candidat" element={<Candidat />} />
      <Route path="/recruteur" element={<Recruteur />} />
      <Route path="/recruteur/dashboard" element={<Dashboard token={token} />} />

      {/* === Routes pour l'entretien différé === */}
      <Route path="/interview" element={<InterviewTest />} />
      <Route path="/interview/camera-test" element={<CameraTest />} />
      
      {/* ✅ Route avec UUID dynamique */}
      <Route path="/interview/:uuid" element={<Interview />} />
    </Routes>
  );
}

export default App;