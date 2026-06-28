import { useMemo, useState } from "react";
import { areas } from "../data/demoData.js";
import { hasErrors, validateDraft } from "../utils/validation.js";
import Icon from "./Icon.jsx";
import OfflineBanner from "./OfflineBanner.jsx";
import { Button, Field, Select, TextInput } from "./ui.jsx";

function FieldGrid({ children }) {
  return <div className="field-grid">{children}</div>;
}

export default function EnumeratorForm({
  activeArea,
  draft,
  isOnline,
  lastSavedAt,
  onDraftChange,
  onSubmit,
  onToggleOnline,
}) {
  const [submittedOnce, setSubmittedOnce] = useState(false);
  const errors = useMemo(() => validateDraft(draft), [draft]);
  const visibleErrors = submittedOnce ? errors : {};

  function update(name, value) {
    onDraftChange({ ...draft, [name]: value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSubmittedOnce(true);
    if (hasErrors(errors)) {
      return;
    }
    onSubmit();
    setSubmittedOnce(false);
  }

  return (
    <main className="screen-stack">
      <OfflineBanner isOnline={isOnline} onToggleOnline={onToggleOnline} />

      <form className="panel form-panel" onSubmit={handleSubmit}>
        <div className="panel-heading">
          <h2>Household Information</h2>
          <span className="save-state">
            <span className="checkmark">✓</span>
            Draft autosaved · {lastSavedAt}
          </span>
        </div>

        <Field label="HH ID (Auto)" error={visibleErrors.householdId}>
          <TextInput
            onChange={(event) => update("householdId", event.target.value)}
            value={draft.householdId}
          />
        </Field>

        <Field label="Address / Landmark" required error={visibleErrors.address}>
          <TextInput
            onChange={(event) => update("address", event.target.value)}
            value={draft.address}
          />
        </Field>

        <FieldGrid>
          <Field label="Dwelling Type" required>
            <Select
              onChange={(event) => update("dwellingType", event.target.value)}
              value={draft.dwellingType}
            >
              <option>Permanent</option>
              <option>Temporary</option>
              <option>Apartment</option>
              <option>Institution</option>
            </Select>
          </Field>
          <Field label="Occupied" required>
            <div className="segmented compact">
              {["Yes", "No"].map((value) => (
                <button
                  className={draft.occupied === value ? "selected" : ""}
                  key={value}
                  onClick={() => update("occupied", value)}
                  type="button"
                >
                  {value}
                </button>
              ))}
            </div>
          </Field>
        </FieldGrid>

        <FieldGrid>
          <Field label="No. of Members in Household" required error={visibleErrors.householdSize}>
            <TextInput
              inputMode="numeric"
              onChange={(event) => update("householdSize", event.target.value)}
              value={draft.householdSize}
            />
          </Field>
          <Field label="No. of Rooms" required error={visibleErrors.rooms}>
            <TextInput
              inputMode="numeric"
              onChange={(event) => update("rooms", event.target.value)}
              value={draft.rooms}
            />
          </Field>
        </FieldGrid>

        <section className="member-box" aria-labelledby="member-title">
          <div className="member-header">
            <h3 id="member-title">Individual Member 1</h3>
            <button type="button" className="remove-button">
              <Icon name="trash" size={17} />
              Remove
            </button>
          </div>

          <Field label="Full Name" required error={visibleErrors.memberName}>
            <TextInput
              onChange={(event) => update("memberName", event.target.value)}
              value={draft.memberName}
            />
          </Field>
          <Field label="Relationship to Head" required>
            <Select
              onChange={(event) => update("relationship", event.target.value)}
              value={draft.relationship}
            >
              <option>Head</option>
              <option>Spouse</option>
              <option>Child</option>
              <option>Parent</option>
              <option>Other relative</option>
            </Select>
          </Field>

          <FieldGrid>
            <Field label="Sex" required>
              <div className="segmented compact">
                {["Female", "Male"].map((value) => (
                  <button
                    className={draft.sex === value ? "selected" : ""}
                    key={value}
                    onClick={() => update("sex", value)}
                    type="button"
                  >
                    {value}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Age (years)" required error={visibleErrors.age} hint="0 - 120">
              <TextInput
                inputMode="numeric"
                onChange={(event) => update("age", event.target.value)}
                value={draft.age}
              />
            </Field>
          </FieldGrid>

          <Field label="Phone Number" error={visibleErrors.phone} hint="Valid phone number">
            <TextInput
              inputMode="tel"
              onChange={(event) => update("phone", event.target.value)}
              value={draft.phone}
            />
          </Field>

          <FieldGrid>
            <Field label="Marital Status" required>
              <Select
                onChange={(event) => update("maritalStatus", event.target.value)}
                value={draft.maritalStatus}
              >
                <option>Married</option>
                <option>Single</option>
                <option>Widowed</option>
                <option>Divorced</option>
              </Select>
            </Field>
            <Field label="Education Level" required>
              <Select
                onChange={(event) => update("educationLevel", event.target.value)}
                value={draft.educationLevel}
              >
                <option>Primary</option>
                <option>Secondary</option>
                <option>College</option>
                <option>Postgraduate</option>
                <option>None</option>
              </Select>
            </Field>
          </FieldGrid>
        </section>

        <Button className="full-width" icon="plus" variant="primary">
          Add Another Member
        </Button>
        <Button className="full-width submit-button" type="submit" variant="primary">
          {isOnline ? `Submit to ${activeArea.tract}` : "Save to Offline Queue"}
        </Button>
      </form>

      <section className="panel compact-panel">
        <div className="panel-heading">
          <h2>Field Assignment</h2>
          <span>{activeArea.region}</span>
        </div>
        <div className="assignment-row">
          <span>{areas.find((area) => area.id === activeArea.id)?.label}</span>
          <strong>{activeArea.targetHouseholds} households</strong>
        </div>
      </section>
    </main>
  );
}
