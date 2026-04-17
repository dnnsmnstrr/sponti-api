import request from 'supertest';

describe('GET /api/sponti', () => {
  const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000';

  it('returns a random spruch', async () => {
    const res = await request(baseUrl).get('/api/sponti');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('spruch');
    expect(res.body).toHaveProperty('id');
  });

  it('returns all sprueche with count when all=true', async () => {
    const res = await request(baseUrl).get('/api/sponti?all=true');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('sprueche');
    expect(res.body).toHaveProperty('count');
    expect(Array.isArray(res.body.sprueche)).toBe(true);
    expect(res.body.count).toBe(res.body.sprueche.length);
  });

  it('filters by category', async () => {
    const res = await request(baseUrl).get('/api/sponti?category=Saufen');
    expect(res.status).toBe(200);
    if (res.body.spruch) {
      const hasCategory = res.body.category?.toLowerCase().includes('saufen');
      expect(hasCategory).toBe(true);
    }
  });
});

describe('GET /api/sponti/categories', () => {
  const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000';

  it('returns list of categories', async () => {
    const res = await request(baseUrl).get('/api/sponti/categories');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('categories');
    expect(Array.isArray(res.body.categories)).toBe(true);
    expect(res.body.categories.length).toBeGreaterThan(0);
  });

  it('categories are sorted alphabetically', async () => {
    const res = await request(baseUrl).get('/api/sponti/categories');
    const categories = res.body.categories;
    const sorted = [...categories].sort();
    expect(categories).toEqual(sorted);
  });
});