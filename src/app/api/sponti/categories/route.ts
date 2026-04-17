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

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = loadSprueche();
  const cats = new Set<string>();
  
  data.forEach(s => {
    if (s.category) {
      s.category.split(',').forEach(c => cats.add(c.trim()));
    }
  });
  
  return NextResponse.json({
    categories: Array.from(cats).sort()
  });
}