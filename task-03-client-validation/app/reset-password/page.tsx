"use client";

import React, { useState } from "react";
import Link from "next/link";

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

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    alert("Not built yet");
  }

  return (
    <div
      className="container"
      style={{ paddingTop: "var(--space-xl)", paddingBottom: "var(--space-2xl)" }}
    >
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
          Enter your email address and we'll send you a reset link.
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
            htmlFor="email"
            className="type-label-large"
            style={{ color: "var(--color-role-on-surface)" }}
          >
            Email address
          </label>
          <input
            id="email"
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
        <Link href="/login">Log in</Link>
      </p>
    </div>
  );
}

