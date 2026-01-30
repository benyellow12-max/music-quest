/**
 * Test script to verify genre hierarchy expansion
 */

const { expandAllSongsGenres, getParentGenres } = require('./lib/genreHierarchy');
const fs = require('fs');
const path = require('path');

// Load test data
const songs = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'songs.json'), 'utf-8'));
const genres = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'genres.json'), 'utf-8'));

console.log('=== Genre Hierarchy Test ===\n');

// Test 1: Check genre hierarchy
console.log('Test 1: Genre Hierarchy');
console.log('-'.repeat(50));

// Find "Omaha Stylee" (gen_0010) which should have parent "Alternative Rock" (gen_0011)
const omahaStylee = genres.find(g => g.id === 'gen_0010');
console.log(`Genre: ${omahaStylee.name} (${omahaStylee.id})`);
console.log(`Direct Parent: ${omahaStylee.parentId}`);

const parents = getParentGenres('gen_0010', genres);
console.log(`All Parent Genres: ${parents.join(', ')}`);
const parentNames = parents.map(id => {
  const g = genres.find(gen => gen.id === id);
  return g ? `${g.name} (${id})` : id;
});
console.log(`Parent Names: ${parentNames.join(' <- ')}`);

// Test 2: Find a song that should inherit parent genres
console.log('\n\nTest 2: Song Genre Expansion');
console.log('-'.repeat(50));

const testSong = songs.find(s => s.genre_ids.includes('gen_0010'));
if (testSong) {
  console.log(`Song: "${testSong.title}" by ${testSong.artist_ids[0]}`);
  console.log(`Original genre_ids: ${testSong.genre_ids.join(', ')}`);
  const genreNames = testSong.genre_ids.map(id => {
    const g = genres.find(gen => gen.id === id);
    return g ? `${g.name} (${id})` : id;
  });
  console.log(`Original genres: ${genreNames.join(', ')}`);
}

// Test 3: Expand all songs and check results
console.log('\n\nTest 3: Expanding All Songs');
console.log('-'.repeat(50));

const expandedSongs = expandAllSongsGenres(songs, genres);

// Check the same song again
const expandedTestSong = expandedSongs.find(s => s.song_id === testSong.song_id);
console.log(`Song: "${expandedTestSong.title}" by ${expandedTestSong.artist_ids[0]}`);
console.log(`Expanded genre_ids: ${expandedTestSong.genre_ids.join(', ')}`);
const expandedGenreNames = expandedTestSong.genre_ids.map(id => {
  const g = genres.find(gen => gen.id === id);
  return g ? `${g.name} (${id})` : id;
});
console.log(`Expanded genres: ${expandedGenreNames.join(', ')}`);

// Test 4: Check a multi-level hierarchy
console.log('\n\nTest 4: Multi-Level Hierarchy');
console.log('-'.repeat(50));

// Find "Emo Pop" (gen_0028) which has parents ["gen_0027", "gen_0005"]
// gen_0027 (Emocore) -> gen_0026 (Post-Hardcore) -> gen_0025 (Hardcore Punk) -> gen_0024 (Punk) -> gen_0001 (Rock)
// gen_0005 (Pop) has no parent
const emoPop = genres.find(g => g.id === 'gen_0028');
console.log(`Genre: ${emoPop.name} (${emoPop.id})`);
console.log(`Direct Parents: ${emoPop.parentId.join(', ')}`);

const emoPopParents = getParentGenres('gen_0028', genres);
console.log(`All Parent Genres (count): ${emoPopParents.length}`);
const emoPopParentNames = emoPopParents.map(id => {
  const g = genres.find(gen => gen.id === id);
  return g ? `${g.name} (${id})` : id;
});
console.log(`All Parents: ${emoPopParentNames.join(', ')}`);

// Test 5: Statistics
console.log('\n\nTest 5: Statistics');
console.log('-'.repeat(50));

let totalGenresAdded = 0;
let songsWithExpandedGenres = 0;

for (let i = 0; i < songs.length; i++) {
  const original = songs[i];
  const expanded = expandedSongs[i];
  
  const originalCount = original.genre_ids ? original.genre_ids.length : 0;
  const expandedCount = expanded.genre_ids ? expanded.genre_ids.length : 0;
  
  if (expandedCount > originalCount) {
    songsWithExpandedGenres++;
    totalGenresAdded += expandedCount - originalCount;
  }
}

console.log(`Total songs: ${songs.length}`);
console.log(`Songs with expanded genres: ${songsWithExpandedGenres}`);
console.log(`Total genres added: ${totalGenresAdded}`);
console.log(`Average genres added per expanded song: ${(totalGenresAdded / songsWithExpandedGenres).toFixed(2)}`);

console.log('\n=== Test Complete ===');
