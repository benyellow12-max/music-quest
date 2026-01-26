function recordingMatchesQuest(recording, quest) {
  const params = quest.params || {};

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

  return true;
}

module.exports = {
  recordingMatchesQuest
};
