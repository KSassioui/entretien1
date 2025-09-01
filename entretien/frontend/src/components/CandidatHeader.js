import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

export default function CandidatHeader({ onNavigate }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const userEmail = JSON.parse(localStorage.getItem("user") || "{}").email || "";

  const firstLetter = userEmail.charAt(0).toUpperCase() || "U";

  const handleLogoClick = () => {
    navigate("/candidat");
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <header className="header">
      <div className="logo" onClick={handleLogoClick}>
        JOBGATE
      </div>
      <nav>
        <button onClick={() => onNavigate("offers")}>Offres</button>
        <button onClick={() => onNavigate("profile")}>Profil</button>
      </nav>
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
              width: "150px",
              zIndex: 10,
              fontSize: "14px",
            }}
          >
            <li
              style={{
                padding: "10px 20px",
                cursor: "pointer",
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