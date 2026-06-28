export const firebaseConfigShape = {
  apiKey: "VITE_FIREBASE_API_KEY",
  authDomain: "VITE_FIREBASE_AUTH_DOMAIN",
  projectId: "VITE_FIREBASE_PROJECT_ID",
};

export const collectionPaths = {
  users: "users/{userId}",
  areas: "areas/{areaId}",
  censusRecords: "censusRecords/{recordId}",
  syncQueue: "users/{userId}/syncQueue/{queueId}",
  reports: "reports/{cycleId}",
};

export function createFirebaseAdapter() {
  throw new Error(
    "Firebase is intentionally stubbed for the local demo. Add Firebase SDK initialization here when project credentials are available.",
  );
}
