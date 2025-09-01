import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Authentification via JWT
      const res = await axios.post("http://127.0.0.1:8000/auth/jwt/create/", {
        email,
        password,
      });

      // 2. Stocker les tokens dans localStorage
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      // 3. Récupérer les informations de l'utilisateur
      const userRes = await axios.get("http://127.0.0.1:8000/auth/users/me/", {
        headers: { Authorization: `JWT ${res.data.access}` },
      });

      // ✅ Sauvegarder les infos utilisateur (dont email)
      localStorage.setItem("user", JSON.stringify(userRes.data));

      const groups = userRes.data.groups;

      // 4. Redirection selon le groupe
      if (groups.includes("Recruteur")) {
        // navigate("/recruteur");
        navigate("/recruteur/dashboard");
      } else {
        navigate("/candidat");
      }
    } catch (err) {
      console.error(err); // Utile pour le debug
      alert("Email ou mot de passe incorrect");
    }
  };

  return (
    <div className="login-container">
      <div className="left-section">
        <header>
          <img src="/assets/images/jobgate-logo.png" alt="JobGate Logo" className="logo" />
          <h1>Welcome back to JOBGATE</h1>
          <p>Connectez-vous pour accéder à votre espace</p>
        </header>

        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Mot de passe</label>
          <div className="password-input-container">
            <input
              type="password"
              id="password"
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="button" className="eye-button">
              👁️
            </button>
          </div>

          <div className="links">
            <a href="/signup">Pas encore inscrit ? Inscrivez-vous</a>
            <a href="/forgot-password">Mot de passe oublié ?</a>
          </div>

          <button type="submit" className="login-button">
            Se connecter
          </button>
        </form>
      </div>

      <div className="right-section"></div>
    </div>
  );
}
