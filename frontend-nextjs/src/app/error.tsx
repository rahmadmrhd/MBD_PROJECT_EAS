"use client";

import { useRouter } from "next/navigation";

type ErrorProps = {
  error: Error;
  reset: () => void;
};
// eslint-disable-next-line no-unused-vars
export default function GlobalError({ error, reset }: ErrorProps) {
  const router = useRouter();
  // console.log(error);
  const errorData = error.message.split("|");
  if (errorData.length <= 1) {
    return (
      <html>
        <body>
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
              <p style={{ marginTop: "1rem", color: "#6B7280" }}>
                {error.message}
              </p>
              <button
                onClick={() => {
                  reset();
                  router.refresh();
                }}
                type='button'
                style={{
                  display: "inline-block",
                  paddingTop: "0.75rem",
                  paddingBottom: "0.75rem",
                  paddingLeft: "1.25rem",
                  paddingRight: "1.25rem",
                  marginTop: "1.5rem",
                  borderRadius: "0.25rem",
                  fontSize: "0.875rem",
                  lineHeight: "1.25rem",
                  fontWeight: 500,
                  color: "#ffffff",
                  backgroundColor: "#4F46E5",
                }}
              >
                Try Again
              </button>
            </div>
          </div>
        </body>
      </html>
    );
  }
  return (
    <html>
      <body>
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
              {errorData[0]}
            </h1>

            {errorData[1] && (
              <p
                style={{
                  fontSize: "1.5rem",
                  lineHeight: "2rem",
                  fontWeight: 700,
                  letterSpacing: "-0.025em",
                  color: "#111827",
                }}
              >
                {errorData[1]}
              </p>
            )}

            {errorData[2] && (
              <p style={{ marginTop: "1rem", color: "#6B7280" }}>
                {errorData[2]}
              </p>
            )}

            <button
              onClick={() => {
                reset();
                router.refresh();
              }}
              type='button'
              style={{
                display: "inline-block",
                paddingTop: "0.75rem",
                paddingBottom: "0.75rem",
                paddingLeft: "1.25rem",
                paddingRight: "1.25rem",
                marginTop: "1.5rem",
                borderRadius: "0.25rem",
                fontSize: "0.875rem",
                lineHeight: "1.25rem",
                fontWeight: 500,
                color: "#ffffff",
                backgroundColor: "#4F46E5",
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
