# Firebase Integration Notes

This app ships as a local-first demo. When Firebase credentials are available,
replace `src/services/firebaseAdapter.js` with Firebase Auth and Firestore
clients while preserving the UI-facing service contracts.

## Suggested Collections

- `users/{userId}`: role, email, assignedAreaIds, displayName
- `areas/{areaId}`: tract, region, targetHouseholds, targetIndividuals
- `censusRecords/{recordId}`: submitted household record and captured metadata
- `users/{userId}/syncQueue/{queueId}`: optional per-user queue audit mirror
- `reports/{cycleId}`: generated aggregate report metadata

## Rules Sketch

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function signedIn() {
      return request.auth != null;
    }

    function profile() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data;
    }

    function isAdmin() {
      return signedIn() && profile().role in ['analyst', 'admin'];
    }

    function isEnumeratorFor(areaId) {
      return signedIn()
        && profile().role == 'enumerator'
        && areaId in profile().assignedAreaIds;
    }

    match /censusRecords/{recordId} {
      allow read: if isAdmin();
      allow create: if isAdmin()
        || (
          isEnumeratorFor(request.resource.data.areaId)
          && request.resource.data.submittedBy == request.auth.uid
        );
      allow update, delete: if isAdmin();
    }

    match /areas/{areaId} {
      allow read: if isAdmin() || isEnumeratorFor(areaId);
      allow write: if isAdmin();
    }

    match /users/{userId} {
      allow read: if isAdmin() || request.auth.uid == userId;
      allow write: if isAdmin();
    }

    match /reports/{cycleId} {
      allow read, write: if isAdmin();
    }
  }
}
```

Before production, add explicit field validation in rules or route writes
through Cloud Functions so PII scope, required fields, and data types are
enforced server-side.
