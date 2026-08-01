import React, { useState } from "react";
import { EyeOffIcon, EyeOnIcon } from "./icons/Icons";

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
      
      <div className="input-container">
        <input 
          className={`input-field ${isPassword ? "with-password" : ""}`} 
          type={inputType} 
          {...props} 
        />

        {isPassword && (
          <button
            type="button"
            className="input-password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOffIcon /> : <EyeOnIcon />}
          </button>
        )}
      </div>
    </div>
  );
}