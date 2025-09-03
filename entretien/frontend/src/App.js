
// // App.js
// import { Routes, Route } from "react-router-dom";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import Candidat from "./pages/Candidat";
// import Recruteur from "./pages/Recruteur";
// import Dashboard from "./pages/Dashboard";
// import InterviewTest from "./pages/InterviewTest";
// import CameraTest from "./pages/CameraTest";
// import Interview from "./pages/Interview";
// import "./index.css";

// function App() {
//   const token = localStorage.getItem("access");

//   return (
//     <Routes>
//       <Route path="/" element={<Login />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/signup" element={<Signup />} />
//       <Route path="/candidat" element={<Candidat />} />
//       <Route path="/recruteur" element={<Recruteur />} />
//       <Route path="/recruteur/dashboard" element={<Dashboard token={token} />} />

//       {/* === Routes pour l'entretien différé === */}
//       <Route path="/interview" element={<InterviewTest />} />
//       <Route path="/interview/camera-test" element={<CameraTest />} />
      
//       {/* ✅ Route avec UUID dynamique */}
//       <Route path="/interview/:uuid" element={<Interview />} />
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
      <Route path="/interview-test" element={<InterviewTest />} />
      <Route path="/camera-test" element={<CameraTest />} />
      <Route path="/interview/:uuid" element={<Interview />} />
    </Routes>
  );
}

export default App;