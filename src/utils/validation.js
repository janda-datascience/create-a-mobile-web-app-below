const PHONE_RE = /^\+?[0-9\s().-]{7,18}$/;

export function validateDraft(draft) {
  const errors = {};

  if (!draft.householdId?.trim()) {
    errors.householdId = "Household ID is required.";
  }

  if (!draft.address?.trim()) {
    errors.address = "Address or landmark is required.";
  }

  const householdSize = Number(draft.householdSize);
  if (!Number.isInteger(householdSize) || householdSize <= 0) {
    errors.householdSize = "Enter a positive whole number.";
  }

  const rooms = Number(draft.rooms);
  if (!Number.isInteger(rooms) || rooms <= 0) {
    errors.rooms = "Rooms must be a positive whole number.";
  }

  if (!draft.memberName?.trim()) {
    errors.memberName = "Full name is required.";
  }

  const age = Number(draft.age);
  if (!Number.isInteger(age) || age < 0 || age > 120) {
    errors.age = "Age must be a whole number from 0 to 120.";
  }

  if (!PHONE_RE.test(draft.phone || "")) {
    errors.phone = "Enter a valid phone number.";
  }

  return errors;
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}
