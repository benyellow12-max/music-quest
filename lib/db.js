const fs = require("fs");
const path = require("path");

const cache = new Map();
const indexCache = new Map(); // Store id-based lookups

function loadTable(name) {
  if (cache.has(name)) {
    return cache.get(name);
  }
  const filePath = path.join(__dirname, "..", "data", `${name}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  cache.set(name, data);
  
  // Create index for fast lookups immediately
  const idMap = new Map(data.map(item => [item.id, item]));
  indexCache.set(name, idMap);
  
  return data;
}

function findById(tableName, id) {
  // Index should always exist after loadTable; no need to recreate
  const idMap = indexCache.get(tableName);
  if (!idMap) {
    // Fallback: ensure table is loaded
    loadTable(tableName);
    return indexCache.get(tableName)?.get(id) || null;
  }
  return idMap.get(id);
}

module.exports = {
  loadTable,
  findById,
  clearCache: () => {
    cache.clear();
    indexCache.clear();
  }
};
