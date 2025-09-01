import { useState } from "react";
import axios from "axios";
import "./Signup.css";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/auth/users/", {
        email,
        password,
        re_password: password2,
      });
      alert("Compte créé avec succès ! Vous pouvez vous connecter.");
    } catch (err) {
      alert("Erreur lors de l'inscription");
    }
  };

  return (
    <div className="signup-container">
      <div className="left-section">
        <header>
          <img src="/assets/images/jobgate-logo.png" alt="JobGate Logo" className="logo" />
          <h1>Inscrivez-vous sur JOBGATE</h1>
          <p>Démarrez votre parcours vers le succès professionnel</p>
        </header>

        <form onSubmit={handleSubmit} className="signup-form">
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

          <label htmlFor="password2">Confirmez le mot de passe</label>
          <div className="password-input-container">
            <input
              type="password"
              id="password2"
              placeholder="Confirmez le mot de passe"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
            />
            <button type="button" className="eye-button">
              👁️
            </button>
          </div>

          <button type="submit" className="signup-button">
            S'inscrire
          </button>
        </form>
      </div>

      <div className="right-section"></div>
    </div>
  );
}