const fs = require("fs");
const path = require("path");

const loadData = (file) => JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/" + file), "utf-8")
);

const songs = loadData("songs.json");
const artists = loadData("artists.json");
const albums = loadData("albums.json");
const platforms = loadData("platforms.json");
const questTemplates = loadData("questTemplates.json");
const quests = loadData("quests.json");

let errors = 0;
const artistIds = new Set(artists.map(a => a.id));
const albumIds = new Set(albums.map(a => a.id));

songs.forEach(song => {
  if (!song.id.startsWith("rec_")) {
    console.log(`❌ Song ID invalid: ${song.id}`);
    errors++;
  }

  song.artistIds?.forEach(artistId => {
    if (!artistIds.has(artistId)) {
      console.log(`❌ Song ${song.id} references missing artist ${artistId}`);
      errors++;
    }
  });

  song.albumIds?.forEach(albumId => {
    if (!albumIds.has(albumId)) {
      console.log(`❌ Recording ${song.id} references missing album ${albumId}`);
      errors++;
    }
  });
});

const validEntityIds = new Set([
  ...artists.map(a => a.id),
  ...songs.map(s => s.id)
]);

platforms.forEach(link => {
  if (!validEntityIds.has(link.entityId)) {
    console.log(`❌ Platform link ${link.id} references missing entity ${link.entityId}`);
    errors++;
  }
});

const templateMap = new Map(questTemplates.map(t => [t.id, t]));

quests.forEach(quest => {
  const template = templateMap.get(quest.templateId);

  if (!template) {
    console.log(`❌ Quest ${quest.id} references missing template`);
    errors++;
    return;
  }

  Object.keys(template.params).forEach(param => {
    if (!(param in quest.params)) {
      console.log(`❌ Quest ${quest.id} missing parameter "${param}"`);
      errors++;
    }
  });
});

if (errors === 0) {
  console.log("✅ Data is clean");
} else {
  console.log(`⚠️ Found ${errors} issue(s)`);
}
