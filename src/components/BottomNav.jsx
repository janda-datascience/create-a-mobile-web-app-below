import Icon from "./Icon.jsx";

const enumItems = [
  ["entry", "Data Entry", "home"],
  ["sync", "Sync", "cloud"],
  ["tasks", "Tasks", "tasks"],
  ["more", "More", "more"],
];

const analystItems = [
  ["dashboard", "Dashboard", "chart"],
  ["data", "Data", "table"],
  ["maps", "Maps", "location"],
  ["reports", "Reports", "report"],
  ["more", "More", "more"],
];

export default function BottomNav({ activeView, role, setActiveView }) {
  const items = role === "analyst" ? analystItems : enumItems;

  return (
    <nav className="bottom-nav" aria-label="Primary">
      {items.map(([id, label, icon]) => (
        <button
          className={activeView === id ? "active" : ""}
          key={id}
          onClick={() => setActiveView(id)}
          type="button"
        >
          <Icon name={icon} size={24} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
