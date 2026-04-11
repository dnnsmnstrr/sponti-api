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

export async function GET() {
  const data = loadSprueche();
  const randomIndex = Math.floor(Math.random() * data.length);
  const randomSpruch = data[randomIndex];
  
  return NextResponse.json(randomSpruch);
}