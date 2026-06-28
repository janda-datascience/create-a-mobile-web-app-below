import Icon from "./Icon.jsx";
import { Button } from "./ui.jsx";

export default function OfflineBanner({ isOnline, onToggleOnline }) {
  return (
    <section className={`offline-banner ${isOnline ? "online" : ""}`}>
      <Icon name={isOnline ? "cloud" : "cloudOff"} size={32} strokeWidth={1.8} />
      <div>
        <strong>{isOnline ? "Online Mode" : "Offline Mode"}</strong>
        <p>
          {isOnline
            ? "Queued records will sync immediately."
            : "Data will be saved and synced when connection is available."}
        </p>
      </div>
      <Button onClick={onToggleOnline} variant="ghost">
        {isOnline ? "Go Offline" : "Go Online"}
      </Button>
    </section>
  );
}
