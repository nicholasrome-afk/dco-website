#!/usr/bin/env node
// Renders the homepage hero map: the latest positions of in situ ocean observing
// platforms reported to OceanOPS (WMO-IOC), drawn in the DCO-OO palette over
// Natural Earth land (public domain). Writes the image plus a small metadata
// file (date, counts per network) that the hero uses for its caption.
//
//   npm run map                               fetch from OceanOPS, then render
//   npm run map -- --input platforms.geojson  render from a saved GeoJSON file
//   npm run map -- --out /tmp/preview.jpg      write the image somewhere else
import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const OCEANOPS_QUERY = 'https://www.ocean-ops.org/arcgis/rest/services/OceanOPS/PtfLocations/MapServer/1/query';
const LAND_URL = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_land.geojson';

const args = process.argv.slice(2);
const arg = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
const OUT_IMAGE = arg('--out') ?? 'src/assets/images/site/hero-network-map.jpg';
const OUT_META = arg('--meta') ?? 'src/data/network-map.json';
const INPUT = arg('--input');

// Equirectangular, cropped to the latitudes where platforms operate.
const W = 2880;
const LAT_N = 80;
const LAT_S = -72;
const H = Math.round((W * (LAT_N - LAT_S)) / 360);
const x = (lon) => (((lon + 180) / 360) * W).toFixed(1);
const y = (lat) => (((LAT_N - lat) / (LAT_N - LAT_S)) * H).toFixed(1);

const BG = '#0A192F'; // abyss
const LAND = '#13294B'; // deep
const DOTS = ['#00A896', '#7FE0D3', '#E8EEF3', '#3CC7B4', '#AFC0D2', '#4FB3BF', '#C9F2EC', '#5E8DB8'];

// Only platforms that reported a position recently (≈ "operational").
const WINDOW_DAYS = 30;

// OceanOPS field that names the network (the first one present is used), and
// readable labels for the OceanOPS master programmes.
const NETWORK_FIELDS = ['master_program', 'MASTER_PROGRAM', 'network', 'NETWORK'];
const LABELS = {
  Argo: 'Argo profiling floats',
  DBCP: 'Drifting and moored buoys (DBCP)',
  SOT: 'Ships (SOT)',
  FVON: 'Fishing vessels (FVON)',
  OceanGliders: 'Gliders (OceanGliders)',
  AniBOS: 'Animal-borne sensors (AniBOS)',
  OceanSITES: 'Time-series sites (OceanSITES)',
};

async function getJson(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'DCO-OO website map renderer' } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json();
}

async function fetchOceanOps() {
  const since = new Date(Date.now() - WINDOW_DAYS * 864e5).toISOString().slice(0, 10);
  const features = [];
  const pageSize = 2000;
  for (let offset = 0; ; offset += pageSize) {
    const params = new URLSearchParams({
      where: `latest_loc_date >= DATE '${since}'`,
      outFields: 'master_program,ptf_family,latest_loc_date',
      returnGeometry: 'true',
      outSR: '4326',
      f: 'geojson',
      resultOffset: String(offset),
      resultRecordCount: String(pageSize),
    });
    const page = await getJson(`${OCEANOPS_QUERY}?${params}`);
    features.push(...(page.features ?? []));
    if (!page.features?.length || (page.features.length < pageSize && !page.properties?.exceededTransferLimit)) break;
  }
  return { type: 'FeatureCollection', features };
}

const ringPath = (ring) => `M${ring.map(([lon, lat]) => `${x(lon)},${y(lat)}`).join('L')}Z`;

function landPath(land) {
  return land.features
    .flatMap(({ geometry: g }) => (g.type === 'Polygon' ? [g.coordinates] : g.coordinates))
    .flatMap((polygon) => polygon.map(ringPath))
    .join('');
}

const platforms = INPUT ? JSON.parse(await readFile(INPUT, 'utf8')) : await fetchOceanOps();
const land = await getJson(LAND_URL);

const points = platforms.features.filter((f) => f.geometry?.type === 'Point');
if (!points.length) throw new Error('No platform positions found.');
const field = NETWORK_FIELDS.find((name) => name in (points[0].properties ?? {}));

const byNetwork = new Map();
for (const f of points) {
  const raw = (field && String(f.properties[field] ?? '').trim()) || '';
  const name = LABELS[raw] ?? 'Other';
  byNetwork.set(name, [...(byNetwork.get(name) ?? []), f.geometry.coordinates]);
}
// Largest networks first (drawn underneath), each with its own color.
const networks = [...byNetwork.entries()]
  .sort((a, b) => b[1].length - a[1].length)
  .map(([name, coords], i) => ({ name, coords, color: DOTS[i % DOTS.length] }));

const graticule = [-60, -30, 0, 30, 60]
  .map((lat) => `M0,${y(lat)}H${W}`)
  .concat([-120, -60, 0, 60, 120].map((lon) => `M${x(lon)},0V${H}`))
  .join('');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="100%" height="100%" fill="${BG}"/>
  <path d="${graticule}" stroke="#E8EEF3" stroke-opacity="0.06" stroke-width="1" fill="none"/>
  <path d="${landPath(land)}" fill="${LAND}" stroke="#2A4468" stroke-width="1"/>
  ${networks
    .map(
      ({ coords, color }) =>
        `<g fill="${color}" fill-opacity="0.85">${coords
          .filter(([, lat]) => lat <= LAT_N && lat >= LAT_S)
          .map(([lon, lat]) => `<circle cx="${x(lon)}" cy="${y(lat)}" r="3"/>`)
          .join('')}</g>`
    )
    .join('\n  ')}
</svg>`;

await sharp(Buffer.from(svg)).jpeg({ quality: 84, mozjpeg: true }).toFile(OUT_IMAGE);

const meta = {
  source: INPUT ? `File: ${INPUT}` : 'OceanOPS (WMO-IOC)',
  window: `Platforms reporting a position in the ${WINDOW_DAYS} days before retrieval`,
  sourceUrl: 'https://www.ocean-ops.org/board',
  land: 'Natural Earth (public domain)',
  retrieved: new Date().toISOString().slice(0, 10),
  total: points.length,
  networks: networks.map(({ name, coords, color }) => ({ name, count: coords.length, color })),
};
await writeFile(OUT_META, `${JSON.stringify(meta, null, 2)}\n`);

console.log(`Rendered ${points.length} platforms in ${networks.length} networks → ${OUT_IMAGE}`);
