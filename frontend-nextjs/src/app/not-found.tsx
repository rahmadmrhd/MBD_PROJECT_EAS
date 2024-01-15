import React from "react";

function NotFound() {
  return (
    <div
      style={{
        display: "grid",
        paddingLeft: "1rem",
        paddingRight: "1rem",
        placeContent: "center",
        height: "100vh",
        backgroundColor: "#ffffff",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1
          style={{
            fontSize: "8rem",
            lineHeight: 1,
            fontWeight: 900,
            color: "#E5E7EB",
          }}
        >
          404
        </h1>

        <p
          style={{
            fontSize: "1.5rem",
            lineHeight: "2rem",
            fontWeight: 700,
            letterSpacing: "-0.025em",
            color: "#111827",
          }}
        >
          Not Found
        </p>

        <p style={{ marginTop: "1rem", color: "#6B7280" }}>
          This page could not be found.
        </p>
      </div>
    </div>
  );
}

export default NotFound;
