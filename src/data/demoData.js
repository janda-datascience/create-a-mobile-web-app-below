export const areas = [
  {
    id: "ward-12",
    label: "Ward 12, Block 045",
    tract: "12-045",
    targetHouseholds: 25,
    targetIndividuals: 100,
    region: "North District",
  },
  {
    id: "ward-08",
    label: "Ward 8, Block 021",
    tract: "08-021",
    targetHouseholds: 31,
    targetIndividuals: 124,
    region: "Central District",
  },
  {
    id: "ward-15",
    label: "Ward 15, Block 102",
    tract: "15-102",
    targetHouseholds: 18,
    targetIndividuals: 72,
    region: "East District",
  },
];

export const users = [
  {
    id: "enum-aisha",
    name: "Aisha Khan",
    email: "enumerator@census.gov",
    role: "enumerator",
    assignedAreaIds: ["ward-12"],
  },
  {
    id: "analyst-samir",
    name: "Samir Patel",
    email: "analyst@census.gov",
    role: "analyst",
    assignedAreaIds: areas.map((area) => area.id),
  },
];

export const defaultDraft = {
  householdId: "12-045-0007",
  areaId: "ward-12",
  address: "23 Unity Street, Near Community Center",
  dwellingType: "Permanent",
  occupied: "Yes",
  householdSize: "4",
  rooms: "3",
  memberName: "Aisha Khan",
  relationship: "Head",
  sex: "Female",
  age: "34",
  phone: "0712 345 678",
  maritalStatus: "Married",
  educationLevel: "Secondary",
};

const names = [
  ["Aisha Khan", "Female", 34],
  ["Rafiq Malik", "Male", 41],
  ["Mina Das", "Female", 12],
  ["Jon Bell", "Male", 28],
  ["Leila Ahmed", "Female", 63],
  ["Nora Singh", "Female", 6],
  ["Omar Rahman", "Male", 46],
  ["Grace Lee", "Female", 23],
  ["Daniel Cruz", "Male", 52],
  ["Iris Novak", "Female", 17],
  ["Mateo Silva", "Male", 38],
  ["Amara Cole", "Female", 59],
];

export const demoRecords = Array.from({ length: 17 }, (_, index) => {
  const [memberName, sex, age] = names[index % names.length];
  const area = areas[index % areas.length];
  const householdNumber = String(index + 1).padStart(4, "0");
  const memberCount = 2 + (index % 5);

  return {
    id: `${area.tract}-${householdNumber}`,
    householdId: `${area.tract}-${householdNumber}`,
    areaId: area.id,
    tract: area.tract,
    address: `${18 + index} Unity Street`,
    dwellingType: index % 4 === 0 ? "Apartment" : "Permanent",
    occupied: index % 8 === 0 ? "No" : "Yes",
    householdSize: memberCount,
    rooms: 2 + (index % 4),
    memberName,
    relationship: index % 3 === 0 ? "Head" : "Member",
    sex,
    age,
    phone: `0712 34${String(560 + index).padStart(3, "0")}`,
    maritalStatus: age > 25 ? "Married" : "Single",
    educationLevel: age < 18 ? "Primary" : index % 2 === 0 ? "Secondary" : "College",
    status: index % 9 === 0 ? "Review" : index % 7 === 0 ? "In Progress" : "Completed",
    capturedAt: new Date(Date.now() - index * 36 * 60 * 1000).toISOString(),
    processingSeconds: 610 + index * 17,
  };
});

export const demoQueue = Array.from({ length: 7 }, (_, index) => {
  const householdNumber = String(index + 7).padStart(4, "0");
  return {
    id: `queue-${index + 1}`,
    householdId: `12-045-${householdNumber}`,
    areaId: "ward-12",
    capturedAt: new Date(Date.now() - (55 - index * 3) * 60 * 1000).toISOString(),
    sizeKb: Number((1.6 + index * 0.15).toFixed(1)),
    status: "Pending",
  };
});

export const ageBuckets = [
  { label: "0-4", min: 0, max: 4 },
  { label: "5-14", min: 5, max: 14 },
  { label: "15-24", min: 15, max: 24 },
  { label: "25-34", min: 25, max: 34 },
  { label: "35-44", min: 35, max: 44 },
  { label: "45-59", min: 45, max: 59 },
  { label: "60+", min: 60, max: Infinity },
];
