"use client";

import { useEffect, useState } from "react";

interface Spruch {
  spruch: string;
  category: string | null;
}

export default function Home() {
  const [quote, setQuote] = useState<Spruch | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchQuote = async () => {
    setLoading(true);
    const res = await fetch("/api/sponti");
    const data = await res.json();
    setQuote(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <main
      onClick={fetchQuote}
      style={{
        minHeight: "90dvh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        fontFamily: "Georgia, serif",
        padding: "20px",
        textAlign: "center",
      }}
    >
      {loading ? (
        <p style={{ color: "#666" }}>Laden...</p>
      ) : (
        <>
          <p
            style={{
              fontSize: "1.5rem",
              color: "#333",
              maxWidth: "800px",
              lineHeight: 1.6,
            }}
          >
            {quote?.spruch}
          </p>
        </>
      )}

      <footer>
        {quote?.category && (
          <p
            style={{
              fontSize: "0.9rem",
              color: "#888",
              textDecoration: "none",
              position: "absolute",
              bottom: "20px",
              transform: "translateX(-50%)",
            }}
          >
            {quote.category}
          </p>
        )}
        <a
          href="/docs"
          style={{
            color: "#aaa",
            fontSize: "0.8rem",
            textDecoration: "none",
            position: "absolute",
            top: "20px",
            right: "20px",
            transform: "translateX(-50%)",
          }}
        >
          api
        </a>
      </footer>
    </main>
  );
}
