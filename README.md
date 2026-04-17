# Sponti API

Random German quotes ("Sprueche") API.

## Sources

- https://www-backend.fh-muenster.de/ciw/downloads-ciw/personenprofile/juestel/science-and-fun/Sponti-Sprueche.pdf
- https://wolfgang-naeser-marburg.lima-city.de/htm/sponti.htm

## API Endpoints

### GET /api/sponti

Returns a random quote.

| Param | Description |
|-------|-------------|
| `?category=X` | Filter by category |
| `?all=true` | Return all quotes with count |
| `?categories=true` | Return list of available categories |

### GET /api/sponti/admin

Full CRUD operations (local only):

- `GET` - List all
- `POST` - Create new
- `PUT` - Update (body includes `id`)
- `DELETE` - Delete (`?id=X`)

## Admin UI

Run locally and navigate to: http://localhost:3000/admin

All data changes are saved to `sprueche.json`.

## Development

```bash
npm run dev    # Start dev server
npm run build  # Production build
npm run start  # Run production server
```