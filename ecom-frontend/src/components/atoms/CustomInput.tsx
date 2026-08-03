import React, { useState } from "react";
import { EyeOffIcon, EyeOnIcon } from "./icons/Icons";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function CustomInput({
  label,
  type = "text",
  className = "",
  error,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className={`input-wrapper ${className}`} style={{ marginBottom: "1rem", width: "100%" }}>
      <label className="input-label" style={{ display: "block", textAlign: "left", marginBottom: "0.25rem" }}>
        {label}
      </label>
      
      <div className="input-container" style={{ position: "relative" }}>
        <input 
          className={`input-field ${isPassword ? "with-password" : ""} ${error ? "input-field-error" : ""}`} 
          type={inputType} 
          style={{ 
            width: "100%",
            borderColor: error ? "#ef4444" : undefined,
            outlineColor: error ? "#ef4444" : undefined
          }}
          {...props} 
        />

        {isPassword && (
          <button
            type="button"
            className="input-password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer" }}
          >
            {showPassword ? <EyeOffIcon /> : <EyeOnIcon />}
          </button>
        )}
      </div>

      {error && (
        <span className="input-error-msg" style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.25rem", display: "block", textAlign: "left" }}>
          {error}
        </span>
      )}
    </div>
  );
}