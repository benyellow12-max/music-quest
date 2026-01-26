const { recordingMatchesQuest } = require("./questmatcher");

function applyListenEvent(quest, recording) {
  if (quest.state.status !== "active") {
    return quest;
  }

  // Convert to Set on first use for O(1) lookups
  if (!quest.state.matchedRecordingIdsSet) {
    quest.state.matchedRecordingIdsSet = new Set(quest.state.matchedRecordingIds);
  }

  // already counted
  const recId = recording.song_id || recording.id;
  if (quest.state.matchedRecordingIdsSet.has(recId)) {
    return quest;
  }

  // check constraints
  if (!recordingMatchesQuest(recording, quest)) {
    return quest;
  }

  // record progress
  quest.state.matchedRecordingIds.push(recId);
  quest.state.matchedRecordingIdsSet.add(recId);

  const required = (quest.params && quest.params.requiredCount) || 1;

  if (quest.state.matchedRecordingIds.length >= required) {
    quest.state.status = "completed";
  }

  return quest;
}

module.exports = {
  applyListenEvent
};
