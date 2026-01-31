const { recordingMatchesQuest } = require("./questmatcher");

function applyListenEvent(quest, recording, listenTime = new Date()) {
  if (quest.state.status !== "active") {
    return quest;
  }

  // Convert to Set on first use for O(1) lookups
  // Also rebuild if it's not actually a Set (e.g., loaded as {} from JSON)
  if (!quest.state.matchedRecordingIdsSet || !(quest.state.matchedRecordingIdsSet instanceof Set)) {
    quest.state.matchedRecordingIdsSet = new Set(quest.state.matchedRecordingIds);
  }

  // already counted
  const recId = recording.song_id || recording.id;
  if (quest.state.matchedRecordingIdsSet.has(recId)) {
    return quest;
  }

  // check constraints (pass listenTime for time-based quests)
  if (!recordingMatchesQuest(recording, quest, [], listenTime)) {
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
