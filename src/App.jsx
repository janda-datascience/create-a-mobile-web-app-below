import { useEffect, useMemo, useState } from "react";
import AppHeader from "./components/AppHeader.jsx";
import AuthScreen from "./components/AuthScreen.jsx";
import BottomNav from "./components/BottomNav.jsx";
import Dashboard from "./components/Dashboard.jsx";
import EnumeratorForm from "./components/EnumeratorForm.jsx";
import { DataView, MoreView, ReportsView, TasksView } from "./components/SecondaryViews.jsx";
import SyncQueue from "./components/SyncQueue.jsx";
import { areas, defaultDraft, demoQueue, demoRecords } from "./data/demoData.js";
import { clearStoredValue, loadStoredValue, saveStoredValue } from "./services/localStore.js";

function nowLabel() {
  return new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

function createRecordFromDraft(draft) {
  return {
    ...draft,
    id: `${draft.householdId}-${Date.now()}`,
    tract: areas.find((area) => area.id === draft.areaId)?.tract || "12-045",
    householdSize: Number(draft.householdSize),
    rooms: Number(draft.rooms),
    age: Number(draft.age),
    status: "Completed",
    capturedAt: new Date().toISOString(),
    processingSeconds: 704,
  };
}

function createQueueItem(record) {
  return {
    id: `queue-${record.id}`,
    householdId: record.householdId,
    areaId: record.areaId,
    capturedAt: record.capturedAt,
    sizeKb: 2.1,
    status: "Pending",
    record,
  };
}

export default function App() {
  const [session, setSession] = useState(() => loadStoredValue("session", null));
  const [records, setRecords] = useState(() => loadStoredValue("records", demoRecords));
  const [queue, setQueue] = useState(() => loadStoredValue("queue", demoQueue));
  const [draft, setDraft] = useState(() => loadStoredValue("draft", defaultDraft));
  const [isOnline, setIsOnline] = useState(() => loadStoredValue("network", false));
  const [activeAreaId, setActiveAreaId] = useState(() => loadStoredValue("activeAreaId", "ward-12"));
  const [activeView, setActiveView] = useState("entry");
  const [lastSavedAt, setLastSavedAt] = useState(nowLabel);
  const [toast, setToast] = useState("");
  const [filters, setFilters] = useState({ dateRange: "Current cycle", demographic: "All demographics" });

  const activeArea = useMemo(
    () => areas.find((area) => area.id === activeAreaId) || areas[0],
    [activeAreaId],
  );
  const availableAreas = useMemo(() => {
    if (!session || session.role === "analyst") {
      return areas;
    }
    return areas.filter((area) => session.assignedAreaIds.includes(area.id));
  }, [session]);

  useEffect(() => {
    saveStoredValue("records", records);
  }, [records]);

  useEffect(() => {
    saveStoredValue("queue", queue);
  }, [queue]);

  useEffect(() => {
    saveStoredValue("network", isOnline);
  }, [isOnline]);

  useEffect(() => {
    saveStoredValue("activeAreaId", activeAreaId);
  }, [activeAreaId]);

  useEffect(() => {
    saveStoredValue("draft", draft);
    setLastSavedAt(nowLabel());
  }, [draft]);

  useEffect(() => {
    if (session) {
      saveStoredValue("session", session);
      setActiveView(session.role === "analyst" ? "dashboard" : "entry");
    }
  }, [session]);

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }
    const timeout = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  function handleLogin(nextSession) {
    setSession(nextSession);
    saveStoredValue("session", nextSession);
    const firstArea = nextSession.assignedAreaIds[0] || areas[0].id;
    setActiveAreaId(firstArea);
    setDraft((current) => ({ ...current, areaId: firstArea }));
  }

  function handleLogout() {
    setSession(null);
    clearStoredValue("session");
  }

  function handleAreaChange(areaId) {
    setActiveAreaId(areaId);
    setDraft((current) => ({
      ...current,
      areaId,
      householdId:
        areaId === "ward-12"
          ? current.householdId
          : `${areas.find((area) => area.id === areaId)?.tract || "12-045"}-0001`,
    }));
  }

  function handleSubmitDraft() {
    const record = createRecordFromDraft({ ...draft, areaId: activeArea.id });
    if (isOnline) {
      setRecords((current) => [record, ...current]);
      setToast("Household submitted.");
    } else {
      setQueue((current) => [createQueueItem(record), ...current]);
      setToast("Saved to offline queue.");
    }
    const areaPrefix = activeArea.tract;
    const nextNumber = String(records.length + queue.length + 8).padStart(4, "0");
    setDraft({ ...defaultDraft, areaId: activeArea.id, householdId: `${areaPrefix}-${nextNumber}` });
  }

  function handleSync() {
    if (!isOnline) {
      setToast("Connection unavailable. Queue retained locally.");
      return;
    }

    const queuedRecords = queue.map((item) => item.record).filter(Boolean);
    setRecords((current) => [...queuedRecords, ...current]);
    setQueue([]);
    setToast(`${queuedRecords.length} queued records synced.`);
  }

  if (!session) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  const role = session.role;

  return (
    <div className={`app-shell ${role}`}>
      <div className="app-frame">
        <AppHeader
          activeArea={activeArea}
          areas={availableAreas}
          isOnline={isOnline}
          onAreaChange={handleAreaChange}
          onLogout={handleLogout}
          onToggleOnline={() => setIsOnline((current) => !current)}
          session={session}
        />

        <div className="screen-body">
          {role === "enumerator" && activeView === "entry" ? (
            <EnumeratorForm
              activeArea={activeArea}
              draft={draft}
              isOnline={isOnline}
              lastSavedAt={lastSavedAt}
              onDraftChange={setDraft}
              onSubmit={handleSubmitDraft}
              onToggleOnline={() => setIsOnline((current) => !current)}
            />
          ) : null}
          {role === "enumerator" && activeView === "sync" ? (
            <SyncQueue
              activeArea={activeArea}
              isOnline={isOnline}
              onSync={handleSync}
              onToggleOnline={() => setIsOnline((current) => !current)}
              queue={queue}
              records={records}
            />
          ) : null}
          {role === "enumerator" && activeView === "tasks" ? (
            <TasksView activeArea={activeArea} queue={queue} records={records} />
          ) : null}
          {role === "analyst" && activeView === "dashboard" ? (
            <Dashboard
              activeArea={activeArea}
              filters={filters}
              onFiltersChange={setFilters}
              records={records}
            />
          ) : null}
          {role === "analyst" && activeView === "data" ? <DataView records={records} /> : null}
          {role === "analyst" && activeView === "maps" ? (
            <Dashboard
              activeArea={activeArea}
              filters={filters}
              onFiltersChange={setFilters}
              records={records}
            />
          ) : null}
          {role === "analyst" && activeView === "reports" ? <ReportsView records={records} /> : null}
          {activeView === "more" ? <MoreView onLogout={handleLogout} role={role} /> : null}
        </div>

        <BottomNav activeView={activeView} role={role} setActiveView={setActiveView} />
        {toast ? <div className="toast" role="status">{toast}</div> : null}
      </div>
    </div>
  );
}
