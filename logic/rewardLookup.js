function questsThatGrantRecording(quests, recordingId) {
  return quests.filter(q =>
    q.rewards?.recordingIds?.includes(recordingId)
  );
}

module.exports = {
  questsThatGrantRecording
};
