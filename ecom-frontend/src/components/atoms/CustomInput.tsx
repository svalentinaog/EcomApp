import React, { useState } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function CustomInput({
  label,
  type = "text",
  className = "",
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className={`input-wrapper ${className}`}>
      <label className="input-label">{label}</label>
      
      {/* Contenedor relativo para alinear el botón de forma limpia a la derecha */}
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <input 
          className="input-field" 
          type={inputType} 
          style={{ width: "100%", paddingRight: isPassword ? "70px" : undefined }}
          {...props} 
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "12px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "0.85rem",
              padding: 0,
            }}
          >
            {showPassword ? "Ocultar" : "Mostrar"}
          </button>
        )}
      </div>
    </div>
  );
}