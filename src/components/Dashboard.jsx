import { ageBuckets } from "../data/demoData.js";
import { exportExecutiveSummary, exportRecordsCsv } from "../services/exporters.js";
import Icon from "./Icon.jsx";
import { Button, Field, Select, StatCard } from "./ui.jsx";

function secondsToLabel(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}m ${remainder}s`;
}

function matchesFilters(record, filters) {
  if (filters.demographic === "Female" && record.sex !== "Female") {
    return false;
  }
  if (filters.demographic === "Male" && record.sex !== "Male") {
    return false;
  }
  if (filters.demographic === "Age 60+" && record.age < 60) {
    return false;
  }

  const capturedAt = new Date(record.capturedAt).getTime();
  const now = Date.now();
  if (filters.dateRange === "Last 7 days") {
    return now - capturedAt <= 7 * 24 * 60 * 60 * 1000;
  }
  if (filters.dateRange === "Last 30 days") {
    return now - capturedAt <= 30 * 24 * 60 * 60 * 1000;
  }

  return true;
}

function getDashboardSummary(records, activeAreaId, filters) {
  const filtered = records.filter((record) => record.areaId === activeAreaId && matchesFilters(record, filters));
  const totalPopulation = filtered.reduce((sum, record) => sum + Number(record.householdSize || 0), 0);
  const householdsSurveyed = filtered.length;
  const completed = filtered.filter((record) => record.status === "Completed").length;
  const completeness = householdsSurveyed ? Math.round((completed / householdsSurveyed) * 1000) / 10 : 0;
  const avgSeconds = filtered.length
    ? Math.round(filtered.reduce((sum, record) => sum + record.processingSeconds, 0) / filtered.length)
    : 0;

  return {
    filtered,
    totalPopulation,
    householdsSurveyed,
    completeness,
    averageProcessingTime: secondsToLabel(avgSeconds),
  };
}

function BarChart({ records }) {
  const values = ageBuckets.map((bucket) => ({
    label: bucket.label,
    value: records
      .filter((record) => record.age >= bucket.min && record.age <= bucket.max)
      .reduce((sum, record) => sum + Number(record.householdSize || 0), 0),
  }));
  const max = Math.max(...values.map((item) => item.value), 1);

  return (
    <div className="bar-chart" aria-label="Population by age group">
      {values.map((item) => (
        <div className="bar-cell" key={item.label}>
          <span>{item.value}</span>
          <i style={{ height: `${24 + (item.value / max) * 112}px` }} />
          <em>{item.label}</em>
        </div>
      ))}
    </div>
  );
}

function Donut({ segments, label }) {
  const total = segments.reduce((sum, item) => sum + item.value, 0) || 1;
  let offset = 25;

  return (
    <svg className="donut" viewBox="0 0 44 44" role="img" aria-label={label}>
      <circle cx="22" cy="22" fill="transparent" r="15.915" stroke="#eef3f5" strokeWidth="8" />
      {segments.map((segment) => {
        const stroke = `${(segment.value / total) * 100} ${100 - (segment.value / total) * 100}`;
        const circle = (
          <circle
            cx="22"
            cy="22"
            fill="transparent"
            key={segment.label}
            r="15.915"
            stroke={segment.color}
            strokeDasharray={stroke}
            strokeDashoffset={offset}
            strokeWidth="8"
          />
        );
        offset -= (segment.value / total) * 100;
        return circle;
      })}
    </svg>
  );
}

function Legend({ segments }) {
  return (
    <div className="legend">
      {segments.map((segment) => (
        <span key={segment.label}>
          <i style={{ background: segment.color }} />
          {segment.label} <b>{segment.value}</b>
        </span>
      ))}
    </div>
  );
}

function MapPanel() {
  return (
    <div className="map-panel" aria-label="Coverage map preview">
      <div className="map-controls">
        <button type="button">+</button>
        <button type="button">−</button>
      </div>
      <svg viewBox="0 0 520 156" preserveAspectRatio="none">
        <rect width="520" height="156" fill="#dbece6" />
        <path d="M0 126 C88 96 146 146 216 104 S335 67 520 95" fill="none" stroke="#ffffff" strokeWidth="6" />
        <path d="M12 78 C90 49 150 64 216 28 S339 19 520 46" fill="none" stroke="#f9ffff" strokeWidth="4" />
        <path d="M310 0 C296 46 306 94 288 156" fill="none" stroke="#b3d3e7" strokeWidth="18" />
        <path d="M42 0v156M106 0v156M174 0v156M245 0v156M375 0v156M447 0v156" stroke="#ffffff" strokeWidth="2" />
        <path d="M0 38h520M0 86h520M0 132h520" stroke="#ffffff" strokeWidth="2" />
        <rect x="174" y="38" width="71" height="48" fill="#0b9898" opacity=".35" />
        <rect x="245" y="86" width="65" height="46" fill="#007f84" opacity=".44" />
        <rect x="106" y="86" width="68" height="46" fill="#14aaa1" opacity=".25" />
      </svg>
      <button className="layers-button" type="button" aria-label="Map layers">
        <Icon name="map" size={20} />
      </button>
    </div>
  );
}

export default function Dashboard({ activeArea, filters, onFiltersChange, records }) {
  const summary = getDashboardSummary(records, activeArea.id, filters);
  const statusSegments = [
    { label: "Completed", value: summary.filtered.filter((record) => record.status === "Completed").length, color: "#008f93" },
    { label: "In Progress", value: summary.filtered.filter((record) => record.status === "In Progress").length, color: "#f5a400" },
    { label: "Pending Review", value: summary.filtered.filter((record) => record.status === "Review").length, color: "#3a91d8" },
  ];
  const sexSegments = [
    { label: "Female", value: summary.filtered.filter((record) => record.sex === "Female").length, color: "#008f93" },
    { label: "Male", value: summary.filtered.filter((record) => record.sex === "Male").length, color: "#f5a400" },
  ];

  return (
    <main className="screen-stack dashboard-stack">
      <section className="filter-strip">
        <Field label="Date Range">
          <Select
            onChange={(event) => onFiltersChange({ ...filters, dateRange: event.target.value })}
            value={filters.dateRange}
          >
            <option>Current cycle</option>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
          </Select>
        </Field>
        <Field label="Demographic">
          <Select
            onChange={(event) => onFiltersChange({ ...filters, demographic: event.target.value })}
            value={filters.demographic}
          >
            <option>All demographics</option>
            <option>Female</option>
            <option>Male</option>
            <option>Age 60+</option>
          </Select>
        </Field>
      </section>

      <section className="dashboard-section">
        <div className="section-heading">
          <h2>Overview</h2>
          <span>As of today, 09:41 AM</span>
        </div>
        <div className="kpi-grid">
          <StatCard change="+2.4% vs yesterday" label="Total Population" value={summary.totalPopulation.toLocaleString()} />
          <StatCard change="+3.1% vs yesterday" label="Households Surveyed" value={summary.householdsSurveyed.toLocaleString()} />
          <StatCard change="+4.2 pp vs yesterday" label="Completeness" value={`${summary.completeness}%`} />
          <StatCard change="−1m 18s vs yesterday" label="Avg. Processing Time" value={summary.averageProcessingTime} />
        </div>
      </section>

      <section className="panel chart-panel">
        <div className="panel-heading">
          <h2>Population by Age Group</h2>
          <button type="button">View all</button>
        </div>
        <BarChart records={summary.filtered} />
      </section>

      <div className="split-panels">
        <section className="panel donut-panel">
          <div className="panel-heading">
            <h2>Status Distribution</h2>
            <button type="button">View all</button>
          </div>
          <div className="donut-row">
            <Donut label="Status distribution" segments={statusSegments} />
            <Legend segments={statusSegments} />
          </div>
        </section>
        <section className="panel donut-panel">
          <div className="panel-heading">
            <h2>By Sex</h2>
            <button type="button">View all</button>
          </div>
          <div className="donut-row">
            <Donut label="Sex distribution" segments={sexSegments} />
            <Legend segments={sexSegments} />
          </div>
        </section>
      </div>

      <section className="panel">
        <div className="panel-heading">
          <h2>Coverage Map</h2>
          <button type="button">View full map</button>
        </div>
        <MapPanel />
        <div className="export-row">
          <Button icon="file" onClick={() => exportRecordsCsv(summary.filtered)} variant="outline">
            Export CSV
          </Button>
          <Button icon="report" onClick={() => exportExecutiveSummary(summary)} variant="outline">
            Export PDF
          </Button>
        </div>
      </section>
    </main>
  );
}
