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

let sprueche: Spruch[] = [];

function loadSprueche() {
  if (sprueche.length > 0) return sprueche;
  
  const jsonPath = path.join(process.cwd(), "sprueche.json");
  const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
  
  sprueche = data;
  return sprueche;
}

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const all = searchParams.get('all');
  const categories = searchParams.get('categories');
  
  const data = loadSprueche();
  
  if (categories === 'true') {
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
  
  let filtered = data;
  
  if (category) {
    const catLower = category.toLowerCase();
    filtered = data.filter(s => 
      s.category?.split(',').map(c => c.trim().toLowerCase()).includes(catLower)
    );
  }
  
  if (all === 'true') {
    return NextResponse.json({
      sprueche: filtered,
      count: filtered.length
    });
  }
  
  const randomIndex = Math.floor(Math.random() * filtered.length);
  const randomSpruch = filtered[randomIndex];
  
  return NextResponse.json(randomSpruch);
}