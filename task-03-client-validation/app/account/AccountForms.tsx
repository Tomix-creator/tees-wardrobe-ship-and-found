"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  cleanEmail,
  cleanFullName,
  cleanPhone,
  emailFormat,
  fullNameFormat,
  passwordRules,
  phoneFormat,
  requiredAdult,
  requiredEmail,
  requiredFullName,
  requiredPassword,
  requiredPhone,
  requiredTerms,
} from "@/lib/validation";

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

const baseInputStyle: React.CSSProperties = {
  width: "100%",
  padding: "var(--space-xs) var(--space-sm)",
  backgroundColor: "var(--color-role-surface)",
  color: "var(--color-role-on-surface)",
  borderRadius: "var(--space-xs)",
  fontSize: "var(--type-body-large-font-size)",
  fontFamily: "inherit",
};

/** Returns an input style with a valid or error border. */
function inputStyle(hasError: boolean): React.CSSProperties {
  return {
    ...baseInputStyle,
    border: hasError
      ? "1px solid var(--color-role-error)"
      : "1px solid var(--color-role-field-outline)",
  };
}

/**
 * Applied to every form-switching button ("Sign up", "Log in",
 * "Forgot password?"). Uses explicit token values so the size is consistent
 * regardless of what font the parent element carries.
 */
const linkBtnStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  padding: 0,
  cursor: "pointer",
  color: "inherit",
  textDecoration: "underline",
  fontFamily: "inherit",
  fontSize: "var(--type-body-small-font-size)",
  fontWeight: "var(--type-body-small-font-weight)",
  lineHeight: "var(--type-body-small-line-height)",
  letterSpacing: "var(--type-body-small-letter-spacing)",
};

// ---------------------------------------------------------------------------
// FieldError — renders a validation message under a field
// ---------------------------------------------------------------------------

function FieldError({ msg }: { msg: string | null }) {
  if (!msg) return null;
  return (
    <span
      className="type-body-small"
      style={{ color: "var(--color-role-error)" }}
    >
      {msg}
    </span>
  );
}

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
      signup: "Create account | Tee\u2019s Wardrobe",
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
      {form === "signup" && <SignupForm switchForm={switchForm} />}
      {form === "login" && <LoginForm switchForm={switchForm} />}
      {form === "reset" && <ResetForm switchForm={switchForm} />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sign-up form
// ---------------------------------------------------------------------------

type SignupErrors = {
  fullName: string | null;
  email: string | null;
  phone: string | null;
  password: string | null;
  agreedToTerms: string | null;
  isAdult: string | null;
};

const SIGNUP_ERRORS_CLEAR: SignupErrors = {
  fullName: null,
  email: null,
  phone: null,
  password: null,
  agreedToTerms: null,
  isAdult: null,
};

function SignupForm({ switchForm }: { switchForm: (f: FormKey) => void }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isAdult, setIsAdult] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<SignupErrors>(SIGNUP_ERRORS_CLEAR);
  // Track whether the user has typed at least one character in the email field.
  const [emailDirty, setEmailDirty] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  /** Run all validators for a single named field and return the result. */
  function validateField(field: keyof SignupErrors): string | null {
    switch (field) {
      case "fullName":
        return requiredFullName(fullName) ?? fullNameFormat(fullName);
      case "email":
        return requiredEmail(email) ?? emailFormat(email);
      case "phone":
        return requiredPhone(phone) ?? phoneFormat(phone);
      case "password":
        return requiredPassword(password) ?? passwordRules(password);
      case "agreedToTerms":
        return requiredTerms(agreedToTerms);
      case "isAdult":
        return requiredAdult(isAdult);
    }
  }

  /** Validate a text input field on blur and update its error. */
  function handleBlur(field: "fullName" | "email" | "phone" | "password") {
    setErrors((prev) => ({ ...prev, [field]: validateField(field) }));
  }

  /**
   * Email onChange: real-time validation after the first keystroke.
   * Before the first keystroke, no error is shown while the user types.
   */
  function handleEmailChange(value: string) {
    setEmail(value);
    const nowDirty = emailDirty || value.length > 0;
    if (!emailDirty && value.length > 0) setEmailDirty(true);
    if (nowDirty) {
      setErrors((prev) => ({
        ...prev,
        email: requiredEmail(value) ?? emailFormat(value),
      }));
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatusMessage(null);

    // Validate every field at once.
    const allErrors: SignupErrors = {
      fullName: requiredFullName(fullName) ?? fullNameFormat(fullName),
      email: requiredEmail(email) ?? emailFormat(email),
      phone: requiredPhone(phone) ?? phoneFormat(phone),
      password: requiredPassword(password) ?? passwordRules(password),
      agreedToTerms: requiredTerms(agreedToTerms),
      isAdult: requiredAdult(isAdult),
    };
    setErrors(allErrors);
    if (Object.values(allErrors).some(Boolean)) return;

    // All valid — build cleaned body. Password is intentionally excluded.
    const body = {
      fullName: cleanFullName(fullName),
      email: cleanEmail(email),
      phone: cleanPhone(phone) || null,
    };

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
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
        setShowPassword(false);
        setAgreedToTerms(false);
        setIsAdult(false);
        setErrors(SIGNUP_ERRORS_CLEAR);
        setEmailDirty(false);
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
        style={{
          backgroundColor: "var(--color-role-surface)",
          border: "1px solid var(--color-role-field-outline)",
          borderRadius: "var(--space-xs)",
          padding: "var(--space-lg)",
        }}
      >
        {/* Full name */}
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
            onBlur={() => handleBlur("fullName")}
            style={inputStyle(!!errors.fullName)}
          />
          <FieldError msg={errors.fullName} />
        </div>

        {/* Email */}
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
            onChange={(e) => handleEmailChange(e.target.value)}
            onBlur={() => handleBlur("email")}
            style={inputStyle(!!errors.email)}
          />
          <FieldError msg={errors.email} />
        </div>

        {/* Phone */}
        <div style={fieldStyle}>
          <label
            htmlFor="phone"
            className="type-label-large"
            style={{ color: "var(--color-role-on-surface)" }}
          >
            Phone number
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onBlur={() => handleBlur("phone")}
            style={inputStyle(!!errors.phone)}
          />
          <FieldError msg={errors.phone} />
        </div>

        {/* Password with show/hide toggle */}
        <div style={fieldStyle}>
          <label
            htmlFor="su-password"
            className="type-label-large"
            style={{ color: "var(--color-role-on-surface)" }}
          >
            Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              id="su-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => handleBlur("password")}
              style={{ ...inputStyle(!!errors.password), paddingRight: "4.5rem" }}
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((v) => !v)}
              style={{
                position: "absolute",
                right: "var(--space-sm)",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                padding: "0 var(--space-2xs)",
                cursor: "pointer",
                color: "var(--color-role-field-outline)",
                fontFamily: "inherit",
                fontSize: "var(--type-label-small-font-size)",
                fontWeight: "var(--type-label-small-font-weight)",
                lineHeight: 1,
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <FieldError msg={errors.password} />
        </div>

        {/* Checkboxes */}
        <div
          style={{
            marginBottom: "var(--space-md)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-sm)",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "var(--space-xs)",
              }}
            >
              <input
                id="agreedToTerms"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                style={{ marginTop: "0.2em", flexShrink: 0 }}
              />
              <label
                htmlFor="agreedToTerms"
                className="type-body-small"
                style={{ color: "var(--color-role-on-surface)", cursor: "pointer" }}
              >
                I agree to the{" "}
                <Link href="/terms" style={{ color: "inherit" }}>
                  Terms and Privacy Notice
                </Link>
              </label>
            </div>
            <FieldError msg={errors.agreedToTerms} />
          </div>

          <div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "var(--space-xs)",
              }}
            >
              <input
                id="isAdult"
                type="checkbox"
                checked={isAdult}
                onChange={(e) => setIsAdult(e.target.checked)}
                style={{ marginTop: "0.2em", flexShrink: 0 }}
              />
              <label
                htmlFor="isAdult"
                className="type-body-small"
                style={{ color: "var(--color-role-on-surface)", cursor: "pointer" }}
              >
                I am 18 or older
              </label>
            </div>
            <FieldError msg={errors.isAdult} />
          </div>
        </div>

        {/* Submit */}
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
        <button onClick={() => switchForm("login")} style={linkBtnStyle}>
          Log in
        </button>
      </p>
    </>
  );
}

// ---------------------------------------------------------------------------
// Login form
// ---------------------------------------------------------------------------

type LoginErrors = { email: string | null; password: string | null };

function LoginForm({ switchForm }: { switchForm: (f: FormKey) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({
    email: null,
    password: null,
  });

  // Blur: show only the empty-field error for login (format checked on submit).
  function handleBlur(field: "email" | "password") {
    if (field === "email") {
      setErrors((prev) => ({ ...prev, email: requiredEmail(email) }));
    } else {
      setErrors((prev) => ({ ...prev, password: requiredPassword(password) }));
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Email: required + format on submit. Password: required only.
    const emailErr = requiredEmail(email) ?? emailFormat(email);
    const passwordErr = requiredPassword(password);
    setErrors({ email: emailErr, password: passwordErr });
    if (emailErr || passwordErr) return;
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
            onBlur={() => handleBlur("email")}
            style={inputStyle(!!errors.email)}
          />
          <FieldError msg={errors.email} />
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
            onBlur={() => handleBlur("password")}
            style={inputStyle(!!errors.password)}
          />
          <FieldError msg={errors.password} />
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
            onClick={() => switchForm("reset")}
            style={linkBtnStyle}
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
        <button onClick={() => switchForm("signup")} style={linkBtnStyle}>
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
  const [errors, setErrors] = useState<{ email: string | null }>({
    email: null,
  });

  // Blur: show only the empty-field error (format checked on submit).
  function handleBlur() {
    setErrors({ email: requiredEmail(email) });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const emailErr = requiredEmail(email) ?? emailFormat(email);
    setErrors({ email: emailErr });
    if (emailErr) return;
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
            onBlur={handleBlur}
            style={inputStyle(!!errors.email)}
          />
          <FieldError msg={errors.email} />
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
        <button onClick={() => switchForm("login")} style={linkBtnStyle}>
          Log in
        </button>
      </p>
    </>
  );
}
