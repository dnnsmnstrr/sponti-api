"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";

interface Spruch {
  spruch: string;
  category: string | null;
}

function QuotePage() {
  const searchParams = useSearchParams();
  const [quote, setQuote] = useState<Spruch | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchQuote = useCallback(() => {
    const category = searchParams.get("category");
    const url = category
      ? `/api/sponti?category=${encodeURIComponent(category)}`
      : "/api/sponti";
    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setQuote(data);
        setLoading(false);
      });
  }, [searchParams]);

  useEffect(() => {
    fetchQuote();
  }, [fetchQuote]);

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
              position: "absolute",
              bottom: "20px",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "10px",
            }}
          >
            {quote.category.split(",").map((cat) => {
              return (
                <a
                  style={{
                    // textDecoration: "none",
                    color: "#888",
                  }}
                  key={cat.trim()}
                  href={`/?category=${encodeURIComponent(cat.trim())}`}
                >
                  {cat.trim()}
                </a>
              );
            })}
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

export default function Home() {
  return (
    <Suspense
      fallback={
        <main
          style={{
            minHeight: "90dvh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Laden...
        </main>
      }
    >
      <QuotePage />
    </Suspense>
  );
}
