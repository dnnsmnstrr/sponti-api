import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface Spruch {
  spruch: string;
  explanation: string | null;
  category: string | null;
  source: string | null;
  rating: number | null;
  id: number;
}

const DATA_FILE = path.join(process.cwd(), "sprueche.json");

function loadSprueche(): Spruch[] {
  const data = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(data);
}

function saveSprueche(data: Spruch[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categories = searchParams.get('categories');
  
  const data = loadSprueche();
  
  if (categories === 'true') {
    const cats = new Set<string>();
    data.forEach(s => {
      if (s.category) {
        s.category.split(',').forEach(c => cats.add(c.trim()));
      }
    });
    return NextResponse.json({ categories: Array.from(cats).sort() });
  }
  
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body: Spruch = await request.json();
  const data = loadSprueche();
  
  const maxId = data.reduce((max, s) => Math.max(max, s.id), 0);
  body.id = maxId + 1;
  
  data.push(body);
  saveSprueche(data);
  
  return NextResponse.json(body, { status: 201 });
}

export async function PUT(request: Request) {
  const body: Spruch = await request.json();
  const data = loadSprueche();
  
  const index = data.findIndex(s => s.id === body.id);
  if (index === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  
  data[index] = body;
  saveSprueche(data);
  
  return NextResponse.json(body);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = parseInt(searchParams.get('id') || '');
  
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  
  const data = loadSprueche();
  const filtered = data.filter(s => s.id !== id);
  
  if (filtered.length === data.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  
  saveSprueche(filtered);
  
  return NextResponse.json({ success: true });
}