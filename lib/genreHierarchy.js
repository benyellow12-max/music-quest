/**
 * Genre Hierarchy Utilities
 * Handles automatic expansion of songs to include parent genres
 */

/**
 * Recursively finds all parent genres for a given genre
 * @param {string} genreId - The genre ID to find parents for
 * @param {Array} allGenres - The complete list of all genres
 * @param {Set} visited - Set to track visited genres (prevents infinite loops)
 * @returns {Array} Array of all parent genre IDs (not including the original genre)
 */
function getParentGenres(genreId, allGenres, visited = new Set()) {
  // Prevent infinite loops
  if (visited.has(genreId)) {
    return [];
  }
  visited.add(genreId);

  const genre = allGenres.find(g => g && g.id === genreId);
  if (!genre || !genre.parentId) {
    return [];
  }

  // Handle both single parent and multiple parents (array)
  const parentIds = Array.isArray(genre.parentId) ? genre.parentId : [genre.parentId];
  let allParents = [...parentIds];

  // Recursively add grandparent genres
  for (const parentId of parentIds) {
    const grandparents = getParentGenres(parentId, allGenres, visited);
    allParents = allParents.concat(grandparents);
  }

  // Remove duplicates
  return [...new Set(allParents)];
}

/**
 * Expands a song's genre_ids to include all parent genres
 * @param {Object} song - The song object with genre_ids array
 * @param {Array} allGenres - The complete list of all genres
 * @returns {Object} The song object with expanded genre_ids
 */
function expandSongGenres(song, allGenres) {
  if (!song.genre_ids || !Array.isArray(song.genre_ids)) {
    return song;
  }

  const expandedGenreIds = new Set(song.genre_ids);

  // For each genre the song belongs to, add all parent genres
  for (const genreId of song.genre_ids) {
    const parents = getParentGenres(genreId, allGenres);
    parents.forEach(parentId => expandedGenreIds.add(parentId));
  }

  return {
    ...song,
    genre_ids: Array.from(expandedGenreIds)
  };
}

/**
 * Expands all songs to include parent genres
 * @param {Array} songs - Array of song objects
 * @param {Array} genres - Array of genre objects
 * @returns {Array} Array of songs with expanded genre_ids
 */
function expandAllSongsGenres(songs, genres) {
  return songs.map(song => expandSongGenres(song, genres));
}

module.exports = {
  getParentGenres,
  expandSongGenres,
  expandAllSongsGenres
};
