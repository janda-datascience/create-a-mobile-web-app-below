import { useState } from "react";
import { users } from "../data/demoData.js";
import { Button, Field, TextInput } from "./ui.jsx";

export default function AuthScreen({ onLogin }) {
  const [role, setRole] = useState("enumerator");
  const selectedUser = users.find((user) => user.role === role);
  const [email, setEmail] = useState(selectedUser.email);
  const [password, setPassword] = useState("demo-access");

  function handleRoleChange(nextRole) {
    const nextUser = users.find((user) => user.role === nextRole);
    setRole(nextRole);
    setEmail(nextUser.email);
  }

  function handleSubmit(event) {
    event.preventDefault();
    onLogin({
      ...selectedUser,
      email,
    });
  }

  return (
    <main className="auth-screen">
      <section className="auth-card" aria-labelledby="login-title">
        <div className="auth-mark">C</div>
        <h1 id="login-title">CensusOps</h1>
        <p>Secure internal census collection and reporting.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="segmented" role="group" aria-label="Demo role">
            <button
              className={role === "enumerator" ? "selected" : ""}
              onClick={() => handleRoleChange("enumerator")}
              type="button"
            >
              Enumerator
            </button>
            <button
              className={role === "analyst" ? "selected" : ""}
              onClick={() => handleRoleChange("analyst")}
              type="button"
            >
              Analyst
            </button>
          </div>

          <Field label="Email">
            <TextInput autoComplete="email" onChange={(event) => setEmail(event.target.value)} type="email" value={email} />
          </Field>
          <Field label="Password">
            <TextInput
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              value={password}
            />
          </Field>

          <Button className="full-width" type="submit">
            Sign In
          </Button>
        </form>
      </section>
    </main>
  );
}
