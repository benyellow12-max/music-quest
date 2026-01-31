# Quest Template System - Quick Reference

## 🚀 Quick Start

### Server-Side Template Operations
```javascript
const { getTemplate, validateQuestParams } = require('./lib/templateUtils');

// Get a template
const template = getTemplate('qtpl_0001', questTemplates);

// Validate quest parameters
const validation = validateQuestParams(
  { requiredCount: 50, artistId: 'art_0001' },
  template
);

if (!validation.valid) {
  console.log('Validation errors:', validation.errors);
}
```

### Client-Side Template Operations
```javascript
// Get template for current quest
const template = getTemplateForQuest(quest);

// Render user-friendly description
const description = renderTemplateDescription(template, quest.params);

// Get what criteria this quest checks
const criteria = getTemplateMatchCriteria(template);
```

### API Endpoints Quick Reference
```
GET /quest-templates           - All templates
GET /quest-templates/:id       - Template details (with criteria, schema)
GET /quest-templates/type/:type - Templates by type
GET /quests/:id                - Quest with template and validation
POST /validate-quest-params    - Validate parameters before creating
```

## 📋 Template Types at a Glance

| Type | Purpose | Key Parameters |
|------|---------|-----------------|
| `listen_count` | Listen to N songs by artist | requiredCount, artistId |
| `listen_minutes` | Listen for X minutes | minutes, artistId |
| `listen_by_year` | Listen from year range | startYear, endYear, artistId |
| `listen_by_genre` | Listen to genre | genreId, artistId |
| `listen_between_time` | Listen during time window | startTime, endTime, artistId |
| `travel_amount` | Visit N locations | number |
| `listen_to_album` | Listen to N songs from album | songs, albumId, artistId |
| `connect_account` | Link external account | accountType |
| `location_checkin` | Check in at location type | number, locationtype |
| `streak_app` | Open app N consecutive days | days |

## 🔍 Common Operations

### Validate Before Creating a Quest
```javascript
// Server
POST /validate-quest-params
{
  "templateId": "qtpl_0001",
  "params": {
    "requiredCount": 50,
    "artistId": "art_0001"
  }
}
```

### Check if Recording Matches Quest
```javascript
// Client or Server
const matches = recordingMatchesQuestParams(recording, quest.params);
if (matches) {
  // Recording satisfies quest criteria
}
```

### Display Quest Title
```javascript
// Client
const title = renderQuestTitle(quest);
// Returns: "Listen to 50 songs by The Beatles"
```

### Get Quest Matching Criteria
```javascript
// Server
const criteria = getTemplateMatchCriteria(template);
// Returns: ["artist", "year"] for listen_by_year type
```

## 📝 Parameter Types

```javascript
// Type validation rules
number    // Any numeric value: 1, 50, 1990
string    // Text value: "Spotify", "venue"
art_id    // Artist ID: "art_0001"
gen_id    // Genre ID: "gen_0002"
alb_id    // Album ID: "alb_0005"
time      // HH:MM or HH:MM:SS format: "14:30"
```

## 🎯 Matching Criteria

Quest matching checks these constraints in order:

1. **Artist Match** (if artistId in params)
   - Recording artist_ids must include the quest artistId
2. **Genre Match** (if genreId in params)
   - Recording genre_ids must include the quest genreId
3. **Album Match** (if albumId in params)
   - Recording album_id must match the quest albumId
4. **Year Range** (if startYear/endYear in params)
   - Recording year must be within [startYear, endYear]

## 🛠️ File Locations

| File | Purpose |
|------|---------|
| `lib/templateUtils.js` | Server-side template functions |
| `logic/questmatcher.js` | Recording-quest matching logic |
| `index.js` | API endpoints (lines ~10-20 imports, ~540-600 endpoints) |
| `public/app.js` | Client-side template functions (lines ~225-360) |
| `data/questTemplates.json` | Template definitions |
| `data/quests.json` | Quest instances |

## ✅ Validation Example

```javascript
const { validateQuestParams, getTemplate } = require('./lib/templateUtils');

const template = getTemplate('qtpl_0001', questTemplates);

// Valid parameters
const valid = validateQuestParams(
  { requiredCount: 50, artistId: "art_0001" },
  template
);
// Result: { valid: true, errors: [] }

// Invalid parameters (artistId is not a string)
const invalid = validateQuestParams(
  { requiredCount: 50, artistId: 123 },
  template
);
// Result: { valid: false, errors: ["Parameter 'artistId' must be an artist ID..."] }
```

## 🔗 Template Data Flow

```
questTemplates.json
    ↓
loadDataFile() in index.js
    ↓
GET /quest-templates endpoint
    ↓
app.js: allQuestTemplates
    ↓
getTemplateForQuest(quest)
    ↓
renderQuestTitle(), renderTemplateDescription()
```

## 📊 Quest State Progression

```javascript
{
  state: {
    status: "active",                    // Start state
    matchedRecordingIds: [],             // Tracks matched songs
  }
}

// When song matches:
matchedRecordingIds.push(song.song_id);

// When completed:
if (matchedRecordingIds.length >= params.requiredCount) {
  status = "completed";  // End state
}
```

## 🐛 Debugging

### Check Template Loading
```javascript
console.log('Loaded templates:', allQuestTemplates.length);
console.log('Template types:', groupTemplatesByType(allQuestTemplates));
```

### Check Quest Validation
```javascript
const template = getTemplate(quest.templateId, questTemplates);
const validation = validateQuestParams(quest.params, template);
console.log('Quest valid:', validation.valid, validation.errors);
```

### Check Recording Matching
```javascript
const matches = recordingMatchesQuestParams(recording, quest.params);
console.log('Recording matches quest:', matches);
```

## 📚 Documentation Files

- `TEMPLATE_SYSTEM.md` - Complete system documentation
- `TEMPLATE_IMPLEMENTATION.md` - Implementation details and testing

## 🔑 Key Concepts

**Template**: Blueprint for a quest type (like a schema)
**Quest**: Concrete instance using a template with specific parameters
**Matching**: Process of checking if a recording satisfies quest criteria
**Validation**: Checking quest parameters conform to template schema
**Rendering**: Converting template + parameters into user-friendly text
