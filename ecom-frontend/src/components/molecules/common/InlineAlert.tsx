type AlertVariant = "primary" | "success" | "warning" | "danger" | "info";

interface InlineAlertProps {
  variant?: AlertVariant;
  message: string;
  onClose?: () => void;
  className?: string;
}

export default function InlineAlert({
  variant = "primary",
  message,
  onClose,
  className = "",
}: InlineAlertProps) {
  // Paleta de colores basada en la vista previa que compartiste
  const variantStyles: Record<AlertVariant, { bg: string; text: string; border: string }> = {
    primary: { bg: "#e2e8f0", text: "#1e293b", border: "#cbd5e1" },
    success: { bg: "#d1fae5", text: "#065f46", border: "#a7f3d0" },
    warning: { bg: "#fef3c7", text: "#92400e", border: "#fde68a" },
    danger: { bg: "#fee2e2", text: "#991b1b", border: "#fecaca" },
    info: { bg: "#cffafe", text: "#155e75", border: "#a5f3fc" },
  };

  const currentStyle = variantStyles[variant] || variantStyles.primary;

  const renderIcon = () => {
    switch (variant) {
      case "success":
        return "✓";
      case "warning":
        return "⚠";
      case "danger":
        return "✕";
      case "info":
        return "ℹ";
      default:
        return "🔔";
    }
  };

  return (
    <div
      className={`inline-alert inline-alert-${variant} ${className}`}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: currentStyle.bg,
        color: currentStyle.text,
        border: `1px solid ${currentStyle.border}`,
        padding: "0.75rem 1rem",
        borderRadius: "0.375rem",
        fontSize: "0.875rem",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <small style={{ fontSize: "1rem", lineHeight: 1 }}>{renderIcon()}</small>
        <small>{message}</small>
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            color: currentStyle.text,
            cursor: "pointer",
            fontSize: "1.1rem",
            fontWeight: "bold",
            padding: "0 0.25rem",
            lineHeight: 1,
            opacity: 0.7,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
          aria-label="Cerrar alerta"
        >
          ×
        </button>
      )}
    </div>
  );
}