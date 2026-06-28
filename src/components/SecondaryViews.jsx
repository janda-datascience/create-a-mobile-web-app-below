import { collectionPaths, firebaseConfigShape } from "../services/firebaseAdapter.js";
import { exportExecutiveSummary, exportRecordsCsv } from "../services/exporters.js";
import Icon from "./Icon.jsx";
import { Button } from "./ui.jsx";

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function TasksView({ activeArea, queue, records }) {
  const areaRecords = records.filter((record) => record.areaId === activeArea.id);
  return (
    <main className="screen-stack">
      <section className="panel">
        <div className="panel-heading">
          <h2>Today’s Tasks</h2>
          <span>{activeArea.tract}</span>
        </div>
        <div className="task-list">
          <article>
            <Icon name="home" />
            <div>
              <strong>Complete remaining households</strong>
              <span>{Math.max(activeArea.targetHouseholds - areaRecords.length, 0)} households left in assigned block.</span>
            </div>
          </article>
          <article>
            <Icon name="cloud" />
            <div>
              <strong>Resolve pending sync</strong>
              <span>{queue.length} records waiting for a stable connection.</span>
            </div>
          </article>
          <article>
            <Icon name="map" />
            <div>
              <strong>Verify block boundary</strong>
              <span>Confirm location before starting a new household.</span>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}

export function DataView({ records }) {
  return (
    <main className="screen-stack">
      <section className="panel">
        <div className="panel-heading">
          <h2>Raw Records</h2>
          <span>{records.length} rows</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Household</th>
                <th>Area</th>
                <th>Status</th>
                <th>Captured</th>
              </tr>
            </thead>
            <tbody>
              {records.slice(0, 12).map((record) => (
                <tr key={record.id}>
                  <td>{record.householdId}</td>
                  <td>{record.tract}</td>
                  <td>{record.status}</td>
                  <td>{formatDate(record.capturedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export function ReportsView({ records }) {
  const summary = {
    totalPopulation: records.reduce((sum, record) => sum + Number(record.householdSize || 0), 0),
    householdsSurveyed: records.length,
    completeness: records.length ? 78.6 : 0,
    averageProcessingTime: "12m 34s",
  };

  return (
    <main className="screen-stack">
      <section className="panel report-panel">
        <div className="panel-heading">
          <h2>Cycle Reports</h2>
          <span>Monthly summary</span>
        </div>
        <div className="report-summary">
          <Icon name="report" size={42} />
          <div>
            <strong>Executive Summary</strong>
            <span>Prepared from current local demo records.</span>
          </div>
        </div>
        <div className="export-row">
          <Button icon="file" onClick={() => exportRecordsCsv(records)} variant="outline">
            Download CSV
          </Button>
          <Button icon="report" onClick={() => exportExecutiveSummary(summary)} variant="outline">
            Download PDF
          </Button>
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <h2>Production Wiring</h2>
          <span>Firebase-ready</span>
        </div>
        <dl className="definition-list">
          <div>
            <dt>Env keys</dt>
            <dd>{Object.values(firebaseConfigShape).join(", ")}</dd>
          </div>
          <div>
            <dt>Primary records</dt>
            <dd>{collectionPaths.censusRecords}</dd>
          </div>
          <div>
            <dt>Offline queue</dt>
            <dd>{collectionPaths.syncQueue}</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}

export function MoreView({ onLogout, role }) {
  return (
    <main className="screen-stack">
      <section className="panel">
        <div className="panel-heading">
          <h2>Account</h2>
          <span>{role === "analyst" ? "Analyst/Admin" : "Enumerator"}</span>
        </div>
        <div className="task-list">
          <article>
            <Icon name="cloud" />
            <div>
              <strong>Session persistence</strong>
              <span>Your role and local queue persist in this browser.</span>
            </div>
          </article>
          <article>
            <Icon name="report" />
            <div>
              <strong>Security model</strong>
              <span>Production rules are documented under docs/firebase-security-rules.md.</span>
            </div>
          </article>
        </div>
        <Button className="full-width" onClick={onLogout} variant="outline">
          Sign Out
        </Button>
      </section>
    </main>
  );
}
