// src/components/StatusDropdown.jsx
import { useState } from "react";

export default function StatusDropdown({ status, onSend }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSend = () => {
    onSend();
    setIsOpen(false);
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: "6px 12px",
          borderRadius: "8px",
          border: "1px solid #ddd",
          background: "white",
          cursor: "pointer",
          fontSize: "14px",
          minWidth: "120px",
          textAlign: "left"
        }}
      >
        {status}
      </button>

      {isOpen && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            background: "white",
            border: "1px solid #ddd",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            listStyle: "none",
            margin: 0,
            padding: 0,
            zIndex: 10,
            minWidth: "160px"
          }}
        >
          <li
            onClick={handleSend}
            style={{
              padding: "8px 12px",
              cursor: "pointer",
              fontSize: "14px",
              color: "#3b82f6",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            ✉️ Envoyer lien
          </li>
        </ul>
      )}
    </div>
  );
}