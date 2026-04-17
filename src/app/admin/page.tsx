"use client";

import { useState, useEffect } from "react";

interface Spruch {
  spruch: string;
  explanation: string | null;
  category: string | null;
  source: string | null;
  rating: number | null;
  id: number;
}

const API_URL = "/api/sponti/admin";

export default function Admin() {
  const [sprueche, setSprueche] = useState<Spruch[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<Spruch>>({});
  const [filter, setFilter] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSprueche();
  }, []);

  const fetchSprueche = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setSprueche(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!form.spruch) {
      setError("Spruch is required");
      return;
    }

    try {
      if (editId) {
        await fetch(API_URL + `?id=${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, id: editId }),
        });
      } else {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Failed to create");
      }
      setForm({});
      setEditId(null);
      fetchSprueche();
    } catch {
      setError("Failed to save");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this spruch?")) return;
    await fetch(API_URL + `?id=${id}`, { method: "DELETE" });
    fetchSprueche();
  };

  const handleEdit = (s: Spruch) => {
    setForm(s);
    setEditId(s.id);
  };

  const filtered = sprueche.filter(s => 
    s.spruch.toLowerCase().includes(filter.toLowerCase()) ||
    s.category?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 20, fontFamily: "system-ui" }}>
      <h1>Sponti Admin</h1>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: 20, padding: 20, background: "#f5f5f5", borderRadius: 8 }}>
        <div style={{ marginBottom: 10 }}>
          <label style={{ display: "block", marginBottom: 5 }}>Spruch *</label>
          <input
            value={form.spruch || ""}
            onChange={e => setForm({ ...form, spruch: e.target.value })}
            style={{ width: "100%", padding: 8, fontSize: 16 }}
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label style={{ display: "block", marginBottom: 5 }}>Explanation</label>
          <input
            value={form.explanation || ""}
            onChange={e => setForm({ ...form, explanation: e.target.value || null })}
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 10, display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: 5 }}>Category (comma-separated)</label>
            <input
              value={form.category || ""}
              onChange={e => setForm({ ...form, category: e.target.value || null })}
              style={{ width: "100%", padding: 8 }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: 5 }}>Source</label>
            <input
              value={form.source || ""}
              onChange={e => setForm({ ...form, source: e.target.value || null })}
              style={{ width: "100%", padding: 8 }}
            />
          </div>
          <div style={{ width: 80 }}>
            <label style={{ display: "block", marginBottom: 5 }}>Rating</label>
            <input
              type="number"
              min="1"
              max="5"
              value={form.rating || ""}
              onChange={e => setForm({ ...form, rating: e.target.value ? parseInt(e.target.value) : null })}
              style={{ width: "100%", padding: 8 }}
            />
          </div>
        </div>
        {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}
        <button type="submit" style={{ padding: "10px 20px", marginRight: 10 }}>
          {editId ? "Update" : "Add"}
        </button>
        {editId && (
          <button type="button" onClick={() => { setForm({}); setEditId(null); }} style={{ padding: "10px 20px" }}>
            Cancel
          </button>
        )}
      </form>

      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Filter..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{ padding: 8, width: 300 }}
        />
        <span style={{ marginLeft: 10 }}>{filtered.length} / {sprueche.length}</span>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", background: "#f5f5f5" }}>
            <th style={{ padding: 8 }}>ID</th>
            <th style={{ padding: 8 }}>Spruch</th>
            <th style={{ padding: 8 }}>Category</th>
            <th style={{ padding: 8 }}>Rating</th>
            <th style={{ padding: 8 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(s => (
            <tr key={s.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: 8 }}>{s.id}</td>
              <td style={{ padding: 8, maxWidth: 400 }}>{s.spruch}</td>
              <td style={{ padding: 8 }}>{s.category}</td>
              <td style={{ padding: 8 }}>{s.rating}</td>
              <td style={{ padding: 8 }}>
                <button onClick={() => handleEdit(s)} style={{ marginRight: 10 }}>Edit</button>
                <button onClick={() => handleDelete(s.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}