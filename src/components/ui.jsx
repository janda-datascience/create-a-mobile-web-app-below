import Icon from "./Icon.jsx";

export function Button({ children, className = "", variant = "primary", icon, ...props }) {
  return (
    <button className={`button button-${variant} ${className}`} type="button" {...props}>
      {icon ? <Icon name={icon} size={18} /> : null}
      <span>{children}</span>
    </button>
  );
}

export function Field({
  label,
  error,
  hint,
  required,
  children,
  className = "",
}) {
  return (
    <label className={`field ${className}`}>
      <span className="field-label">
        {label}
        {required ? <b> *</b> : null}
      </span>
      {children}
      {error ? <span className="field-error">{error}</span> : hint ? <span className="field-hint">{hint}</span> : null}
    </label>
  );
}

export function Select({ children, ...props }) {
  return <select className="control" {...props}>{children}</select>;
}

export function TextInput(props) {
  return <input className="control" {...props} />;
}

export function StatCard({ label, value, change, tone = "positive" }) {
  return (
    <section className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
      {change ? <em className={tone}>{change}</em> : null}
    </section>
  );
}

export function StatusDot({ online }) {
  return <span className={`status-dot ${online ? "online" : "offline"}`} />;
}
