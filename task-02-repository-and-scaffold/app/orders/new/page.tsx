"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function NewOrderPage() {
  const [customerName, setCustomerName] = useState("");
  const [garment, setGarment] = useState("");
  const [priceNaira, setPriceNaira] = useState("");
  const [deliveryFeeNaira, setDeliveryFeeNaira] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    const trimmedCustomerName = customerName.trim();
    const trimmedGarment = garment.trim();
    const trimmedPrice = priceNaira.trim();
    const trimmedDelivery = deliveryFeeNaira.trim();

    const parsedPrice = /^\d+$/.test(trimmedPrice)
      ? parseInt(trimmedPrice, 10)
      : trimmedPrice;

    const parsedDelivery =
      trimmedDelivery === ""
        ? null
        : /^\d+$/.test(trimmedDelivery)
        ? parseInt(trimmedDelivery, 10)
        : trimmedDelivery;

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: trimmedCustomerName,
          garment: trimmedGarment,
          priceNaira: parsedPrice,
          deliveryFeeNaira: parsedDelivery,
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.status === 201 && data && typeof data.id === "number") {
        setStatusMessage({
          type: "success",
          text: `Order saved (#${data.id})`,
        });
      } else {
        const errorText =
          data && typeof data.error === "string"
            ? data.error
            : "Could not save the order";
        setStatusMessage({
          type: "error",
          text: errorText,
        });
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

  return (
    <div className="container" style={{ paddingTop: "var(--space-xl)", paddingBottom: "var(--space-2xl)" }}>
      <nav style={{ marginBottom: "var(--space-lg)" }}>
        <Link
          href="/"
          className="type-label-medium"
          style={{
            color: "var(--color-role-on-surface)",
            textDecoration: "underline",
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--space-3xs)",
          }}
        >
          &larr; Back to home
        </Link>
      </nav>

      <header style={{ marginBottom: "var(--space-lg)" }}>
        <h1
          className="type-headline-large"
          style={{
            margin: 0,
            color: "var(--color-role-on-surface)",
            letterSpacing: "var(--type-headline-large-letter-spacing)",
          }}
        >
          New order
        </h1>
        <p
          className="type-body-small"
          style={{
            margin: 0,
            marginTop: "var(--space-3xs)",
            color: "var(--color-role-field-outline)",
          }}
        >
          Record a new customer order for Tee’s Wardrobe
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
          <label htmlFor="customerName" className="type-label-large" style={{ color: "var(--color-role-on-surface)" }}>
            Customer name
          </label>
          <input
            id="customerName"
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label htmlFor="garment" className="type-label-large" style={{ color: "var(--color-role-on-surface)" }}>
            Garment
          </label>
          <input
            id="garment"
            type="text"
            value={garment}
            onChange={(e) => setGarment(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label htmlFor="priceNaira" className="type-label-large" style={{ color: "var(--color-role-on-surface)" }}>
            Price (₦)
          </label>
          <input
            id="priceNaira"
            type="text"
            inputMode="numeric"
            value={priceNaira}
            onChange={(e) => setPriceNaira(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label htmlFor="deliveryFeeNaira" className="type-label-large" style={{ color: "var(--color-role-on-surface)" }}>
            Delivery fee (leave blank if not quoted yet)
          </label>
          <input
            id="deliveryFeeNaira"
            type="text"
            inputMode="numeric"
            value={deliveryFeeNaira}
            onChange={(e) => setDeliveryFeeNaira(e.target.value)}
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
            {isSubmitting ? "Saving…" : "Save order"}
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
    </div>
  );
}

