"use client";

import type { Metadata } from "next";
import React, { useState } from "react";
import Link from "next/link";

// Note: metadata export is ignored in client components; title is set via the
// browser <title> tag through layout.tsx's template.

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

export default function SignupPage() {
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
          Sign up to track your order balance with Tee's Wardrobe.
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
            htmlFor="password"
            className="type-label-large"
            style={{ color: "var(--color-role-on-surface)" }}
          >
            Password
          </label>
          <input
            id="password"
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
            {isSubmitting ? "Creating account…" : "Create account"}
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
        <Link href="/login">Log in</Link>
      </p>
    </div>
  );
}

