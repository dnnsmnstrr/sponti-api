"use client";

import { useState, useEffect } from "react";

export default function Docs() {
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [spruch, setSpruch] = useState<any>(null);
  const [sprueche, setSprueche] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");
  const [sources, setSources] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
    fetchCategories();
    fetchSources();
    testRandom();
  }, []);

  const fetchCategories = async () => {
    const res = await fetch("/api/sponti/categories");
    const data = await res.json();
    setCategories(data.categories);
  };

  const fetchSources = async () => {
    const res = await fetch("/api/sponti?all=true");
    const data = await res.json();
    const uniqueSources = [
      ...new Set(data.sprueche.map((s: any) => s.source).filter(Boolean)),
    ] as string[];
    setSources(uniqueSources.sort());
  };

  const testRandom = async () => {
    setLoading(true);
    const url = selectedCategory
      ? `/api/sponti?category=${encodeURIComponent(selectedCategory)}`
      : "/api/sponti";
    setCurrentUrl(url);
    const res = await fetch(url);
    const data = await res.json();
    setSpruch(data);
    setLoading(false);
  };

  const testAll = async () => {
    setLoading(true);
    const url = selectedCategory
      ? `/api/sponti?all=true&category=${encodeURIComponent(selectedCategory)}`
      : "/api/sponti?all=true";
    setCurrentUrl(url);
    const res = await fetch(url);
    const data = await res.json();
    setSprueche(data);
    setLoading(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getFullUrl = () =>
    `${typeof window !== "undefined" ? window.location.origin : ""}${currentUrl}`;
  const getCurl = () => `curl -s ${getFullUrl()}`;
  const getFetch = () =>
    `fetch('${currentUrl}').then(r => r.json()).then(console.log)`;

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: 20,
        fontFamily: "system-ui",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ margin: 0 }}>
          <a href="/">Sponti</a> API Docs
        </h1>
        <div style={{ display: "flex", gap: 8 }}>
          <a
            href="https://github.com/dnnsmnstrr/sponti-api"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "8px 16px",
              background: "#eee",
              borderRadius: 4,
              textDecoration: "none",
            }}
          >
            GitHub ↗
          </a>
          {mounted &&
            typeof window !== "undefined" &&
            window.location.hostname === "localhost" && (
              <a
                href="/admin"
                style={{
                  padding: "8px 16px",
                  background: "#eee",
                  borderRadius: 4,
                  textDecoration: "none",
                }}
              >
                Admin ↗
              </a>
            )}
        </div>
      </div>

      <section style={{ marginBottom: 30 }}>
        <h2>GET /api/sponti</h2>
        <p>Returns a random German quote (Spruch).</p>

        <div
          style={{
            background: "#f5f5f5",
            padding: 15,
            borderRadius: 8,
            marginBottom: 15,
          }}
        >
          <h3 style={{ marginTop: 0 }}>Parameters</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left" }}>
                <th style={{ padding: "8px 0" }}>Param</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "8px 0", fontFamily: "monospace" }}>
                  category
                </td>
                <td>Filter by category</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 0", fontFamily: "monospace" }}>
                  all
                </td>
                <td>Return all quotes (true)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Try it</h3>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 10,
            marginBottom: 15,
          }}
        >
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ padding: 8 }}
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <button
              onClick={testRandom}
              disabled={loading}
              style={{ padding: "8px 16px" }}
            >
              Random
            </button>
            <button
              onClick={testAll}
              disabled={loading}
              style={{ padding: "8px 16px" }}
            >
              All ({selectedCategory || "all"})
            </button>
          </div>

          {currentUrl && (
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => copyToClipboard(getFullUrl())}
                style={{ padding: "6px 12px" }}
              >
                Copy GET url
              </button>
              <button
                onClick={() => copyToClipboard(getCurl())}
                style={{ padding: "6px 12px" }}
              >
                Copy curl
              </button>
              <button
                onClick={() => copyToClipboard(getFetch())}
                style={{ padding: "6px 12px" }}
              >
                Copy fetch
              </button>
            </div>
          )}
        </div>

        {spruch && (
          <div style={{ background: "#e8f5e9", padding: 15, borderRadius: 8 }}>
            <h4 style={{ marginTop: 0 }}>Random Response</h4>
            <pre
              style={{
                margin: 0,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {JSON.stringify(spruch, null, 2)}
            </pre>
          </div>
        )}

        {sprueche && (
          <div
            style={{
              background: "#e8f5e9",
              padding: 15,
              borderRadius: 8,
              marginTop: 15,
            }}
          >
            <h4 style={{ marginTop: 0 }}>
              All Responses ({sprueche.count} quotes)
            </h4>
            <details>
              <summary style={{ cursor: "pointer" }}>
                Show all ({sprueche.sprueche.length} items)
              </summary>
              <pre style={{ maxHeight: 300, overflow: "auto", marginTop: 10 }}>
                {JSON.stringify(sprueche, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </section>

      <section style={{ marginBottom: 30 }}>
        <h2>GET /api/sponti/categories</h2>
        <p>Returns a list of all available categories.</p>

        <div style={{ background: "#f5f5f5", padding: 15, borderRadius: 8 }}>
          <h3 style={{ marginTop: 0 }}>Example Response</h3>
          <pre style={{ margin: 0 }}>
            {`{
  "categories": ["Arbeit ist doof", "Saufen", "Switcheroo", ...]
}`}
          </pre>
        </div>
      </section>

      <section>
        <h2>Categories ({categories.length})</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              style={{
                padding: "4px 8px",
                background: selectedCategory === c ? "#d0d0d0" : "#eee",
                border: "1px solid #ccc",
                borderRadius: 4,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2>Sources ({sources.length})</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {sources.map((s) => (
            <li key={s} style={{ marginBottom: 8 }}>
              <a
                href={s}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#0066cc" }}
              >
                {s.replace(/^https?:\/\/(www\.)?/, "").replace(/\/.*/, "")}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
