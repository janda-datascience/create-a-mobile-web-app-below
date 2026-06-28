import Icon from "./Icon.jsx";
import OfflineBanner from "./OfflineBanner.jsx";
import { Button } from "./ui.jsx";

function formatTime(value) {
  return new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function ProgressMetric({ label, value, target, accent = "teal" }) {
  const percent = target ? Math.min(100, Math.round((value / target) * 100)) : 0;
  return (
    <div className="progress-metric">
      <span>{label}</span>
      <strong>{value}</strong>
      <em>/ {target}</em>
      <div className="progress-track">
        <i className={accent} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export default function SyncQueue({
  activeArea,
  isOnline,
  onSync,
  onToggleOnline,
  queue,
  records,
}) {
  const areaRecords = records.filter((record) => record.areaId === activeArea.id);
  const completed = areaRecords.filter((record) => record.status === "Completed").length;
  const individuals = areaRecords.reduce((sum, record) => sum + Number(record.householdSize || 0), 0);

  return (
    <main className="screen-stack">
      <OfflineBanner isOnline={isOnline} onToggleOnline={onToggleOnline} />

      <section className="panel progress-card">
        <div className="panel-heading">
          <h2>
            <Icon name="calendar" size={22} />
            Daily Progress
          </h2>
          <span>Today</span>
        </div>
        <div className="metric-grid">
          <ProgressMetric label="Households Surveyed" target={activeArea.targetHouseholds} value={areaRecords.length} />
          <ProgressMetric label="Individuals Captured" target={activeArea.targetIndividuals} value={individuals} />
          <ProgressMetric label="Forms Completed" target={activeArea.targetHouseholds} value={completed} />
          <div className="pending-sync">
            <span>Pending Sync</span>
            <strong>{queue.length}</strong>
            <em>records</em>
          </div>
        </div>
      </section>

      <section className="panel queue-panel">
        <div className="panel-heading">
          <h2>Sync Queue ({queue.length})</h2>
          <span>Last attempted: 08:15 AM</span>
        </div>

        <div className="queue-list">
          {queue.map((item) => (
            <article className="queue-item" key={item.id}>
              <Icon name="file" size={30} />
              <div>
                <strong>HH {item.householdId}</strong>
                <span>Captured: {formatTime(item.capturedAt)}</span>
              </div>
              <div className="queue-meta">
                <span>{item.sizeKb} KB</span>
                <em>{item.status}</em>
              </div>
            </article>
          ))}
          {queue.length === 0 ? (
            <div className="empty-state">
              <Icon name="cloud" size={34} />
              <strong>Queue clear</strong>
              <span>All local records are synced.</span>
            </div>
          ) : null}
        </div>

        <Button className="full-width" icon="refresh" onClick={onSync} variant="primary">
          Sync Now
        </Button>
        <p className="sync-note">
          {isOnline ? "Pending records will be committed to the local demo dataset." : "Sync will run when connection is available."}
        </p>
      </section>
    </main>
  );
}
