"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type FormKey = "signup" | "login" | "reset";

function isFormKey(value: string | null): value is FormKey {
  return value === "signup" || value === "login" || value === "reset";
}

// ---------------------------------------------------------------------------
// Shared styles (mirrors /orders/new exactly)
// ---------------------------------------------------------------------------

const fieldStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-3xs)",
  marginBottom: "var(--space-md)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "var(--space-xs) var(--space-sm)",
  backgroundColor: "var(--color-role-surface)",
  color: "var(--color-role-on-surface)",
  border: "1px solid var(--color-role-field-outline)",
  borderRadius: "var(--space-xs)",
  fontSize: "var(--type-body-large-font-size)",
  fontFamily: "inherit",
};

// ---------------------------------------------------------------------------
// Main client component
// ---------------------------------------------------------------------------

export default function AccountForms() {
  const searchParams = useSearchParams();
  const raw = searchParams.get("form");
  const initial: FormKey = isFormKey(raw) ? raw : "login";

  const [form, setForm] = useState<FormKey>(initial);

  // Keep form in sync with the URL when the user presses Back / Forward.
  useEffect(() => {
    function onPopState() {
      const params = new URLSearchParams(window.location.search);
      const next = params.get("form");
      setForm(isFormKey(next) ? next : "login");
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Update document.title on each form change.
  useEffect(() => {
    const titles: Record<FormKey, string> = {
      signup: "Create account | Tee's Wardrobe",
      login: "Log in | Tee\u2019s Wardrobe",
      reset: "Reset password | Tee\u2019s Wardrobe",
    };
    document.title = titles[form];
  }, [form]);

  // Switch form: update URL via pushState (no server request) and local state.
  const switchForm = useCallback((next: FormKey) => {
    window.history.pushState(null, "", `/account?form=${next}`);
    setForm(next);
  }, []);

  return (
    <div
      className="container"
      style={{ paddingTop: "var(--space-xl)", paddingBottom: "var(--space-2xl)" }}
    >
      {form === "signup" && (
        <SignupForm switchForm={switchForm} />
      )}
      {form === "login" && (
        <LoginForm switchForm={switchForm} />
      )}
      {form === "reset" && (
        <ResetForm switchForm={switchForm} />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sign-up form
// ---------------------------------------------------------------------------

function SignupForm({ switchForm }: { switchForm: (f: FormKey) => void }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    // password and confirmPassword are intentionally not sent to the server.
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim() || null,
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.status === 201 && data && typeof data.id === "number") {
        setStatusMessage({
          type: "success",
          text: `Account created! Your customer ID is #${data.id}.`,
        });
        setFullName("");
        setEmail("");
        setPhone("");
        setPassword("");
        setConfirmPassword("");
      } else {
        const errorText =
          data && typeof data.error === "string"
            ? data.error
            : "Could not create your account. Please try again.";
        setStatusMessage({ type: "error", text: errorText });
      }
    } catch {
      setStatusMessage({
        type: "error",
        text: "Could not reach the server. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <header style={{ marginBottom: "var(--space-lg)" }}>
        <h1
          className="type-headline-large"
          style={{
            margin: 0,
            color: "var(--color-role-on-surface)",
            letterSpacing: "var(--type-headline-large-letter-spacing)",
          }}
        >
          Create an account
        </h1>
        <p
          className="type-body-small"
          style={{
            margin: 0,
            marginTop: "var(--space-3xs)",
            color: "var(--color-role-field-outline)",
          }}
        >
          Sign up to track your order balance with Tee&rsquo;s Wardrobe.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="shadow-soft"
        style={{
          backgroundColor: "var(--color-role-surface)",
          border: "1px solid var(--color-role-field-outline)",
          borderRadius: "var(--space-xs)",
          padding: "var(--space-lg)",
        }}
      >
        <div style={fieldStyle}>
          <label
            htmlFor="fullName"
            className="type-label-large"
            style={{ color: "var(--color-role-on-surface)" }}
          >
            Full name
          </label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label
            htmlFor="su-email"
            className="type-label-large"
            style={{ color: "var(--color-role-on-surface)" }}
          >
            Email address
          </label>
          <input
            id="su-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label
            htmlFor="phone"
            className="type-label-large"
            style={{ color: "var(--color-role-on-surface)" }}
          >
            Phone number{" "}
            <span
              className="type-label-small"
              style={{ color: "var(--color-role-field-outline)" }}
            >
              (optional)
            </span>
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label
            htmlFor="su-password"
            className="type-label-large"
            style={{ color: "var(--color-role-on-surface)" }}
          >
            Password
          </label>
          <input
            id="su-password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label
            htmlFor="confirmPassword"
            className="type-label-large"
            style={{ color: "var(--color-role-on-surface)" }}
          >
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ marginTop: "var(--space-lg)" }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
            style={{
              opacity: isSubmitting ? 0.7 : 1,
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
          >
            {isSubmitting ? "Creating account\u2026" : "Create account"}
          </button>
        </div>

        {statusMessage && (
          <div
            role={statusMessage.type === "success" ? "status" : "alert"}
            className="type-body-medium"
            style={{
              marginTop: "var(--space-md)",
              padding: "var(--space-sm) var(--space-md)",
              borderRadius: "var(--space-xs)",
              border: "1px solid",
              borderColor:
                statusMessage.type === "success"
                  ? "var(--color-role-success)"
                  : "var(--color-role-error)",
              color:
                statusMessage.type === "success"
                  ? "var(--color-role-success)"
                  : "var(--color-role-error)",
              backgroundColor: "var(--color-role-surface)",
            }}
          >
            {statusMessage.text}
          </div>
        )}
      </form>

      <p
        className="type-body-small"
        style={{
          marginTop: "var(--space-md)",
          color: "var(--color-role-field-outline)",
          textAlign: "center",
        }}
      >
        Already have an account?{" "}
        <button
          className="type-body-small"
          onClick={() => switchForm("login")}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            color: "inherit",
            textDecoration: "underline",
            font: "inherit",
          }}
        >
          Log in
        </button>
      </p>
    </>
  );
}

// ---------------------------------------------------------------------------
// Login form
// ---------------------------------------------------------------------------

function LoginForm({ switchForm }: { switchForm: (f: FormKey) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    alert("Not built yet");
  }

  return (
    <>
      <header style={{ marginBottom: "var(--space-lg)" }}>
        <h1
          className="type-headline-large"
          style={{
            margin: 0,
            color: "var(--color-role-on-surface)",
            letterSpacing: "var(--type-headline-large-letter-spacing)",
          }}
        >
          Log in
        </h1>
        <p
          className="type-body-small"
          style={{
            margin: 0,
            marginTop: "var(--space-3xs)",
            color: "var(--color-role-field-outline)",
          }}
        >
          Sign in to view your order balance with Tee&rsquo;s Wardrobe.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="shadow-soft"
        style={{
          backgroundColor: "var(--color-role-surface)",
          border: "1px solid var(--color-role-field-outline)",
          borderRadius: "var(--space-xs)",
          padding: "var(--space-lg)",
        }}
      >
        <div style={fieldStyle}>
          <label
            htmlFor="li-email"
            className="type-label-large"
            style={{ color: "var(--color-role-on-surface)" }}
          >
            Email address
          </label>
          <input
            id="li-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label
            htmlFor="li-password"
            className="type-label-large"
            style={{ color: "var(--color-role-on-surface)" }}
          >
            Password
          </label>
          <input
            id="li-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div
          style={{
            marginTop: "var(--space-xs)",
            marginBottom: "var(--space-lg)",
            textAlign: "right",
          }}
        >
          <button
            type="button"
            className="type-body-small"
            onClick={() => switchForm("reset")}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              color: "inherit",
              textDecoration: "underline",
              font: "inherit",
            }}
          >
            Forgot password?
          </button>
        </div>

        <button type="submit" className="btn btn-primary">
          Log in
        </button>
      </form>

      <p
        className="type-body-small"
        style={{
          marginTop: "var(--space-md)",
          color: "var(--color-role-field-outline)",
          textAlign: "center",
        }}
      >
        Don&rsquo;t have an account?{" "}
        <button
          className="type-body-small"
          onClick={() => switchForm("signup")}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            color: "inherit",
            textDecoration: "underline",
            font: "inherit",
          }}
        >
          Sign up
        </button>
      </p>
    </>
  );
}

// ---------------------------------------------------------------------------
// Reset-password form
// ---------------------------------------------------------------------------

function ResetForm({ switchForm }: { switchForm: (f: FormKey) => void }) {
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    alert("Not built yet");
  }

  return (
    <>
      <header style={{ marginBottom: "var(--space-lg)" }}>
        <h1
          className="type-headline-large"
          style={{
            margin: 0,
            color: "var(--color-role-on-surface)",
            letterSpacing: "var(--type-headline-large-letter-spacing)",
          }}
        >
          Reset password
        </h1>
        <p
          className="type-body-small"
          style={{
            margin: 0,
            marginTop: "var(--space-3xs)",
            color: "var(--color-role-field-outline)",
          }}
        >
          Enter your email address and we&rsquo;ll send you a reset link.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="shadow-soft"
        style={{
          backgroundColor: "var(--color-role-surface)",
          border: "1px solid var(--color-role-field-outline)",
          borderRadius: "var(--space-xs)",
          padding: "var(--space-lg)",
        }}
      >
        <div style={fieldStyle}>
          <label
            htmlFor="rp-email"
            className="type-label-large"
            style={{ color: "var(--color-role-on-surface)" }}
          >
            Email address
          </label>
          <input
            id="rp-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ marginTop: "var(--space-lg)" }}>
          <button type="submit" className="btn btn-primary">
            Send reset link
          </button>
        </div>
      </form>

      <p
        className="type-body-small"
        style={{
          marginTop: "var(--space-md)",
          color: "var(--color-role-field-outline)",
          textAlign: "center",
        }}
      >
        Remembered your password?{" "}
        <button
          className="type-body-small"
          onClick={() => switchForm("login")}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            color: "inherit",
            textDecoration: "underline",
            font: "inherit",
          }}
        >
          Log in
        </button>
      </p>
    </>
  );
}

