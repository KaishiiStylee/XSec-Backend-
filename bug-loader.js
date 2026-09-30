import bugsRegistry from './bugs/index.js';

let cached = null;

export function listBugs() {
  if (!cached) cached = bugsRegistry;
  return cached.map(b => ({ id: b.id, name: b.name }));
}

export function getBug(id) {
  if (!cached) cached = bugsRegistry;
  return cached.find(b => b.id === id) || null;
}
