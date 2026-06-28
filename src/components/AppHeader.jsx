import Icon from "./Icon.jsx";
import { Button, Select, StatusDot } from "./ui.jsx";

export default function AppHeader({
  activeArea,
  areas,
  isOnline,
  onAreaChange,
  onLogout,
  session,
}) {
  return (
    <header className="app-header">
      <div className="phone-status" aria-hidden="true">
        <span>9:41</span>
        <span className="phone-glyphs">▮▮▮ ◒ ▰</span>
      </div>
      <div className="brand-row">
        <button className="icon-button" type="button" aria-label="Open navigation">
          <Icon name="menu" />
        </button>
        <strong className="brand">CensusOps</strong>
        <button className="session-chip" type="button" onClick={onLogout} title="Sign out">
          <StatusDot online={isOnline} />
          <span>{session.email}</span>
        </button>
      </div>
      <div className="scope-row">
        <label>
          <span>{session.role === "analyst" ? "Area / Scope" : "Assigned Area"}</span>
          <div className="select-shell">
            <Icon name="location" size={18} />
            <Select value={activeArea.id} onChange={(event) => onAreaChange(event.target.value)}>
              {areas.map((area) => (
                <option key={area.id} value={area.id}>
                  {session.role === "analyst" ? area.label.replace(", Block 045", "") : area.label}
                </option>
              ))}
            </Select>
          </div>
        </label>
        <Button className="header-action" icon={session.role === "analyst" ? "filter" : "map"} variant="ghost">
          {session.role === "analyst" ? "Filters" : "Map"}
        </Button>
      </div>
    </header>
  );
}
