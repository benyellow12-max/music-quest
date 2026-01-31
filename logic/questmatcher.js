/**
 * Validates if a recording matches quest criteria based on quest type and parameters
 * @param {Object} recording - The recording to check
 * @param {Object} quest - The quest with params and templateId
 * @param {Array} templates - Optional array of templates for type-aware matching
 * @param {Date} listenTime - The time when the song was listened to (for time-based quests)
 * @returns {boolean} True if recording matches quest criteria
 */
function recordingMatchesQuest(recording, quest, templates = [], listenTime = new Date()) {
  const params = quest.params || {};
  const questType = quest.templateId ? getQuestType(quest.templateId, templates) : null;

  // Artist match: use artist_ids array from data
  const recArtistIds = recording.artist_ids || recording.artistIds || [];
  if (params.artistId && !recArtistIds.includes(params.artistId)) {
    return false;
  }

  // Year window match
  const recYear = recording.year;
  if (params.startYear !== undefined && recYear < params.startYear) {
    return false;
  }

  if (params.endYear !== undefined && recYear > params.endYear) {
    return false;
  }

  // Genre match (if applicable)
  if (params.genreId) {
    const recGenreIds = recording.genre_ids || recording.genreIds || [];
    if (!recGenreIds.includes(params.genreId)) {
      return false;
    }
  }

  // Album match (if applicable)
  if (params.albumId) {
    const recAlbumId = recording.album_id || recording.albumId;
    if (recAlbumId !== params.albumId) {
      return false;
    }
  }

  // Time window match (if applicable) - check if listen time is within quest's time window
  if (params.startTime && params.endTime) {
    const currentTime = listenTime || new Date();
    const currentTimeStr = `${String(currentTime.getHours()).padStart(2, '0')}:${String(currentTime.getMinutes()).padStart(2, '0')}`;
    
    // Compare time strings (HH:MM format)
    if (currentTimeStr < params.startTime || currentTimeStr > params.endTime) {
      return false;
    }
  }

  return true;
}

/**
 * Get the quest type from a template ID
 * @param {string} templateId - The template ID
 * @param {Array} templates - Array of template objects
 * @returns {string|null} The quest type or null if not found
 */
function getQuestType(templateId, templates) {
  if (!templates || !Array.isArray(templates)) {
    return null;
  }
  const template = templates.find(t => t && t.id === templateId);
  return template ? template.type : null;
}


module.exports = {
  recordingMatchesQuest,
  getQuestType
};
