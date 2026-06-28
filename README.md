# CensusOps Mobile Web App

Mobile-first internal census operations demo for field data entry, offline queue
simulation, analyst dashboards, and CSV/PDF exports.

## Stack

- React + Vite
- Local-first demo storage with `localStorage`
- Firebase adapter seams for future Auth and Firestore integration
- Vercel-ready static deployment

## Local Development

```bash
npm install
npm run dev
```

## Validation

```bash
npm run build
npm audit
```

Firebase production notes and a Firestore security-rules sketch are in
`docs/firebase-security-rules.md`.
