import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const BASE_URL = 'http://localhost:3000';

test('Full Squads: First League (FNL) teams have complete rosters of at least 18-20 players with all positions', () => {
  const raw = fs.readFileSync('data/db.json', 'utf8');
  const db = JSON.parse(raw);

  const fnlTeams = db.teams.filter((t: any) => t.comp === 'fnl');
  assert.equal(fnlTeams.length, 18, 'First League must contain 18 teams');

  for (const t of fnlTeams) {
    const squadIds = db.squads[t.id] || [];
    assert.ok(squadIds.length >= 18, `Team ${t.name} (FNL) must have at least 18 players, got ${squadIds.length}`);
    const players = squadIds.map((id: string) => db.players.find((p: any) => p.id === id)).filter(Boolean);
    assert.equal(players.length, squadIds.length, `All players in squad of ${t.name} must exist in db.players`);

    const gks = players.filter((p: any) => p.pos === 'ВР');
    const defs = players.filter((p: any) => ['ЦЗ', 'ЛЗ', 'ПЗ'].includes(p.pos));
    const mids = players.filter((p: any) => ['ОП', 'ЦП', 'АП'].includes(p.pos));
    const fwds = players.filter((p: any) => ['ЛВ', 'ПВ', 'ЦФ'].includes(p.pos));

    assert.ok(gks.length >= 1, `Team ${t.name} must have at least 1 goalkeeper`);
    assert.ok(defs.length >= 4, `Team ${t.name} must have at least 4 defenders`);
    assert.ok(mids.length >= 4, `Team ${t.name} must have at least 4 midfielders`);
    assert.ok(fwds.length >= 2, `Team ${t.name} must have at least 2 forwards`);
  }
});

test('Full Squads: Second League A (Gold & Silver) teams have complete rosters', () => {
  const raw = fs.readFileSync('data/db.json', 'utf8');
  const db = JSON.parse(raw);

  const teams2la = db.teams.filter((t: any) => t.comp === '2la_gold' || t.comp === '2la_silver');
  assert.ok(teams2la.length >= 17, 'Second League A must have at least 17 teams (Gold + Silver)');

  for (const t of teams2la) {
    const squadIds = db.squads[t.id] || [];
    assert.ok(squadIds.length >= 18, `Team ${t.name} (2LA) must have at least 18 players, got ${squadIds.length}`);
    const players = squadIds.map((id: string) => db.players.find((p: any) => p.id === id)).filter(Boolean);
    assert.ok(players.some((p: any) => p.pos === 'ВР'), `${t.name} must have a goalkeeper`);
    assert.ok(t.city && t.city.length > 0, `${t.name} must have a designated city`);
    assert.ok(t.lat != null && t.lon != null, `${t.name} must have geographical coordinates`);
  }
});

test('Full Squads: Second League B (Groups 1, 2, 3, 4) teams have complete rosters', () => {
  const raw = fs.readFileSync('data/db.json', 'utf8');
  const db = JSON.parse(raw);

  const teams2lb = db.teams.filter((t: any) => String(t.comp || '').startsWith('2lb'));
  assert.ok(teams2lb.length >= 50, 'Second League B must have all regional group teams');

  for (const t of teams2lb) {
    const squadIds = db.squads[t.id] || [];
    assert.ok(squadIds.length >= 18, `Team ${t.name} (${t.comp}) must have at least 18 players, got ${squadIds.length}`);
    assert.ok(t.city, `${t.name} must have a city`);
    assert.ok(t.stadium, `${t.name} must have a home stadium`);
  }
});

test('Full Squads: Media League (Media & Div 2) teams have complete rosters including iconic media stars', () => {
  const raw = fs.readFileSync('data/db.json', 'utf8');
  const db = JSON.parse(raw);

  const mediaTeams = db.teams.filter((t: any) => t.comp === 'media' || t.comp === 'media_div2');
  assert.ok(mediaTeams.length >= 20, 'Media League must have all clubs');

  for (const t of mediaTeams) {
    const squadIds = db.squads[t.id] || [];
    assert.ok(squadIds.length >= 18, `Team ${t.name} (Media) must have at least 18 players, got ${squadIds.length}`);
  }

  // Verify famous players exist in 2Drots, Amkal, FC 10
  const allMediaPlayers = db.players.filter((p: any) => {
    const t = db.teams.find((tm: any) => tm.id === p.teamId);
    return t && (t.comp === 'media' || t.comp === 'media_div2');
  });
  const names = allMediaPlayers.map((p: any) => p.name);
  assert.ok(names.some((n: string) => n.includes('Сычёв') || n.includes('Крап') || n.includes('Слон')), '2Drots stars must be present');
  assert.ok(names.some((n: string) => n.includes('Швагирев') || n.includes('Прокоп') || n.includes('Маврин')), 'Amkal stars must be present');
});

test('Weather Database: db.json stores climate statistics for all football cities', () => {
  const raw = fs.readFileSync('data/db.json', 'utf8');
  const db = JSON.parse(raw);

  assert.ok(db.cityClimates, 'db.cityClimates must exist in the database');
  const climateCities = Object.keys(db.cityClimates);
  assert.ok(climateCities.length >= 10, 'Climate database must contain multi-month climate norms');

  // Verify Moscow, SPb, Krasnodar, Kazan, Sochi have 12 months data
  for (const city of ['Москва', 'Санкт-Петербург', 'Краснодар', 'Казань', 'Сочи']) {
    const c = db.cityClimates[city];
    assert.ok(c, `City ${city} must be in climate database`);
    assert.equal(c.months.length, 12, `${city} must have 12 months climate stats`);
    assert.ok(c.months[6].tDay > c.months[0].tDay, `July daytime temp in ${city} must be warmer than January`);
  }
});

test('Weather Integration: Every fixture in db.fixtures has weather assigned and persisted', () => {
  const raw = fs.readFileSync('data/db.json', 'utf8');
  const db = JSON.parse(raw);

  assert.ok(db.fixtures.length > 0, 'Fixtures must exist');
  for (const f of db.fixtures) {
    assert.ok(f.weather, `Fixture ${f.id} (${f.label}) must have weather string`);
    assert.ok(f.weather.includes('°C'), `Fixture ${f.id} weather must contain temperature: "${f.weather}"`);
    assert.ok(f.weatherDetails, `Fixture ${f.id} must have weatherDetails object`);
    assert.equal(typeof f.weatherDetails.temp, 'number', `Weather temp must be a number in fixture ${f.id}`);
    assert.ok(f.weatherDetails.condition, `Weather condition must be specified in fixture ${f.id}`);
  }
});

test('Weather API: /api/weather/cities and /api/weather/city/:cityName endpoints return accurate climate data', async () => {
  const citiesRes = await fetch(`${BASE_URL}/api/weather/cities`);
  assert.equal(citiesRes.status, 200);
  const cities = await citiesRes.json();
  assert.ok(Array.isArray(cities));
  assert.ok(cities.length >= 10, 'Cities list should contain multiple regions');

  const moscowRes = await fetch(`${BASE_URL}/api/weather/city/Москва?date=2026-07-15&time=19:00`);
  assert.equal(moscowRes.status, 200);
  const moscowWeather = await moscowRes.json();
  assert.equal(moscowWeather.city, 'Москва');
  assert.equal(typeof moscowWeather.temp, 'number');
  assert.ok(moscowWeather.temp >= 15 && moscowWeather.temp <= 36, `July Moscow evening temp should be realistic, got ${moscowWeather.temp}°C`);
  assert.ok(moscowWeather.pitch, 'Must specify pitch state');
});
