"use client";

import { useState, useEffect } from "react";

export default function Docs() {
  const [categories, setCategories] = useState<string[]>([]);
  const [spruch, setSpruch] = useState<any>(null);
  const [sprueche, setSprueche] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    fetchCategories();
    testRandom();
  }, []);

  const fetchCategories = async () => {
    const res = await fetch("/api/sponti?categories=true");
    const data = await res.json();
    setCategories(data.categories);
  };

  const testRandom = async () => {
    setLoading(true);
    const url = selectedCategory 
      ? `/api/sponti?category=${encodeURIComponent(selectedCategory)}`
      : "/api/sponti";
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
    const res = await fetch(url);
    const data = await res.json();
    setSprueche(data);
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20, fontFamily: "system-ui" }}>
      <h1>Sponti API Docs</h1>

      <section style={{ marginBottom: 30 }}>
        <h2>GET /api/sponti</h2>
        <p>Returns a random German quote (Spruch).</p>

        <div style={{ background: "#f5f5f5", padding: 15, borderRadius: 8, marginBottom: 15 }}>
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
                <td style={{ padding: "8px 0", fontFamily: "monospace" }}>category</td>
                <td>Filter by category</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 0", fontFamily: "monospace" }}>all</td>
                <td>Return all quotes (true)</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 0", fontFamily: "monospace" }}>categories</td>
                <td>Return list of available categories (true)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Try it</h3>
        <div style={{ display: "flex", gap: 10, marginBottom: 15, flexWrap: "wrap" }}>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            style={{ padding: 8 }}
          >
            <option value="">All categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button onClick={testRandom} disabled={loading} style={{ padding: "8px 16px" }}>
            Random
          </button>
          <button onClick={testAll} disabled={loading} style={{ padding: "8px 16px" }}>
            All ({selectedCategory || "all"})
          </button>
        </div>

        {spruch && (
          <div style={{ background: "#e8f5e9", padding: 15, borderRadius: 8 }}>
            <h4 style={{ marginTop: 0 }}>Random Response</h4>
            <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              {JSON.stringify(spruch, null, 2)}
            </pre>
          </div>
        )}

        {sprueche && (
          <div style={{ background: "#e8f5e9", padding: 15, borderRadius: 8, marginTop: 15 }}>
            <h4 style={{ marginTop: 0 }}>
              All Responses ({sprueche.count} quotes)
            </h4>
            <details>
              <summary style={{ cursor: "pointer" }}>Show all ({sprueche.sprueche.length} items)</summary>
              <pre style={{ maxHeight: 300, overflow: "auto", marginTop: 10 }}>
                {JSON.stringify(sprueche, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </section>

      <section>
        <h2>Categories ({categories.length})</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {categories.map(c => (
            <span
              key={c}
              style={{
                padding: "4px 8px",
                background: "#eee",
                borderRadius: 4,
                fontSize: 14,
              }}
            >
              {c}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}