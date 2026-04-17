# Sponti

Simple Next.js 14 API project serving random German quotes ("Sprueche").

## Commands

- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npm run lint` - Run ESLint

No typecheck or test scripts configured.

## Data

- `sprueche.json` - Main data source (~300KB, ~600 quotes)
- `sponti.csv` - CSV backup of quotes
- `server.js` - Standalone Node.js server (alternative to Next.js, runs on port 3000)

## API

`GET /api/sponti`
- No params: random quote
- `?category=X`: filter by category
- `?all=true`: return all quotes with count
- `?categories=true`: return list of available categories

## Development

After running a build to verify changes, ensure the dev server is restarted, so the user can reload the current page