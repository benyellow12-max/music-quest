# Quest Template System Documentation

## Overview

The Quest Template System provides a structured way to define, validate, and manage different types of quests in Music Quest. Templates define the schema and matching criteria for quests, allowing for flexible quest creation and type-safe parameter validation.

## Architecture

### Core Components

1. **Quest Templates** (`data/questTemplates.json`)
   - Defines 10+ quest types with parameter schemas
   - Each template specifies required parameters and their types
   - Templates include user-friendly descriptions with placeholders

2. **Quest Instances** (`data/quests.json`)
   - Concrete quests that reference templates via `templateId`
   - Provide specific parameters for each template
   - Track progress and state independently

3. **Template Utilities** (`lib/templateUtils.js`)
   - Server-side helper functions for template operations
   - Parameter validation against schema
   - Description rendering with parameter substitution
   - Template grouping and filtering

4. **Quest Matching** (`logic/questmatcher.js`)
   - Validates if a recording matches quest criteria
   - Supports type-aware matching based on templates
   - Checks artist, year, genre, album constraints

## Template Types

### 1. `listen_count`
Listen to a specific number of songs by an artist.

**Parameters:**
- `requiredCount` (number): Number of songs to listen to
- `artistId` (art_id): Optional artist constraint

**Description:** "Listen to {{count}} recordings by {{artistId}}"

**Example:**
```json
{
  "templateId": "qtpl_0001",
  "params": {
    "requiredCount": 50,
    "artistId": "art_0001"
  }
}
```

### 2. `listen_minutes`
Listen to an artist's music for a specified duration.

**Parameters:**
- `minutes` (number): Duration in minutes
- `artistId` (art_id): Artist constraint

**Description:** "Listen to {{artistId}} for {{minutes}} minutes"

### 3. `listen_by_year`
Listen to songs from a specific year range by an artist.

**Parameters:**
- `requiredCount` (number): Number of songs to listen to
- `startYear` (number): Start of year range
- `endYear` (number): End of year range
- `artistId` (art_id): Artist constraint

**Description:** "Listen to any song released between {{startYear}} and {{endYear}} by {{artistId}}"

**Example:**
```json
{
  "templateId": "qtpl_0004",
  "params": {
    "requiredCount": 1,
    "startYear": 1990,
    "endYear": 1992,
    "artistId": "art_0001"
  }
}
```

### 4. `listen_by_genre`
Listen to songs in a specific genre by an artist.

**Parameters:**
- `requiredCount` (number): Number of songs to listen to
- `genreId` (gen_id): Genre constraint
- `artistId` (art_id): Artist constraint

**Description:** "Listen to any song in the {{genreId}} genre by {{artistId}}"

### 5. `listen_between_time`
Listen to songs during a specific time window.

**Parameters:**
- `requiredCount` (number): Number of songs to listen to
- `artistId` (art_id): Artist constraint
- `startTime` (time): Start time (HH:MM or HH:MM:SS)
- `endTime` (time): End time (HH:MM or HH:MM:SS)

**Description:** "Listen to any song by {{artistId}} between {{startTime}} and {{endTime}}"

### 6. `travel_amount`
Check in at a specific number of locations.

**Parameters:**
- `number` (number): Number of locations

**Description:** "Check in at {{number}} locations"

### 7. `listen_to_album`
Listen to a specific number of songs from an album.

**Parameters:**
- `songs` (number): Number of songs to listen to from the album
- `albumId` (alb_id): Album constraint
- `artistId` (art_id): Artist constraint

**Description:** "Listen to {{songs}} songs from the album {{albumId}} by {{artistId}}"

### 8. `connect_account`
Connect an external account (Spotify, Apple Music, etc.).

**Parameters:**
- `accountType` (string): Type of account to connect

**Description:** "Connect {{accountType}} to your Music Quest account"

### 9. `location_checkin`
Check in at a specific type of location.

**Parameters:**
- `number` (number): Number of locations
- `locationtype` (string): Type of location

**Description:** "Check in at {{number}} {{locationtype}}"

### 10. `streak_app`
Open the app for consecutive days.

**Parameters:**
- `days` (number): Number of consecutive days

**Description:** "Open the app for {{days}} consecutive days"

## API Endpoints

### Get All Templates
```
GET /quest-templates
```

Returns all available quest templates.

### Get Template by ID
```
GET /quest-templates/:id
```

Returns detailed information about a specific template including:
- Template metadata
- Parameter schema
- Match criteria
- Required parameters

**Response:**
```json
{
  "id": "qtpl_0001",
  "type": "listen_count",
  "description": "Listen to {{count}} recordings by {{artistId}}",
  "params": {
    "count": "number",
    "artistId": "art_id"
  },
  "criteria": ["artist"],
  "requiredParams": ["count", "artistId"],
  "paramSchema": { ... }
}
```

### Get Templates by Type
```
GET /quest-templates/type/:type
```

Returns all templates of a specific type.

### Get Quest with Template Info
```
GET /quests/:id
```

Returns a quest with its associated template and validation status.

**Response:**
```json
{
  "id": "qst_0001",
  "templateId": "qtpl_0001",
  "params": { ... },
  "state": { ... },
  "reward": { ... },
  "template": { ... },
  "validation": {
    "isValid": true,
    "errors": []
  }
}
```

### Validate Quest Parameters
```
POST /validate-quest-params
Content-Type: application/json

{
  "templateId": "qtpl_0001",
  "params": {
    "requiredCount": 50,
    "artistId": "art_0001"
  }
}
```

Returns validation results:
```json
{
  "templateId": "qtpl_0001",
  "template": { ... },
  "validation": {
    "valid": true,
    "errors": []
  },
  "criteria": ["artist"],
  "requiredParams": ["count", "artistId"]
}
```

## Server-Side Functions (`lib/templateUtils.js`)

### getTemplate(templateId, templates)
Find a template by ID.

```javascript
const template = getTemplate("qtpl_0001", questTemplates);
```

### validateQuestParams(questParams, template)
Validate quest parameters against template schema.

```javascript
const validation = validateQuestParams(params, template);
if (!validation.valid) {
  console.log('Errors:', validation.errors);
}
```

### getTemplateMatchCriteria(template)
Get the matching criteria for a template type.

```javascript
const criteria = getTemplateMatchCriteria(template);
// Returns: ["artist", "year"] for listen_by_year
```

### renderTemplateDescription(template, questParams, lookupMaps)
Render template description with parameters substituted.

```javascript
const description = renderTemplateDescription(
  template,
  params,
  {
    getArtist: (id) => artistsMap.get(id),
    getGenre: (id) => genresMap.get(id),
    getAlbum: (id) => albumsMap.get(id)
  }
);
```

### getTemplateRequiredParams(template)
Get required parameter names for a template.

```javascript
const required = getTemplateRequiredParams(template);
// Returns: ["count", "artistId"]
```

### canCreateQuestFromTemplate(questParams, template)
Check if a quest can be created from a template.

```javascript
if (canCreateQuestFromTemplate(params, template)) {
  // Create the quest
}
```

### groupTemplatesByType(templates)
Group templates by their type.

```javascript
const grouped = groupTemplatesByType(questTemplates);
// Returns: { listen_count: [...], listen_by_year: [...], ... }
```

### getTemplatesRequiringEntities(templates, entityTypes)
Filter templates that require specific entity types.

```javascript
const artistTemplates = getTemplatesRequiringEntities(
  questTemplates,
  ["artist"]
);
```

## Client-Side Functions (`public/app.js`)

### getTemplateForQuest(quest)
Get the template associated with a quest.

```javascript
const template = getTemplateForQuest(quest);
```

### renderTemplateDescription(template, questParams)
Render template description with parameters on the client.

```javascript
const desc = renderTemplateDescription(template, quest.params);
```

### getTemplateMatchCriteria(template)
Get matching criteria for a template on the client.

```javascript
const criteria = getTemplateMatchCriteria(template);
```

### renderQuestTitle(quest)
Render human-readable quest title based on template and parameters.

```javascript
const title = renderQuestTitle(quest);
// Returns: "Listen to 50 songs by The Beatles (1990–1992)"
```

## Recording Matching Logic

The quest matching system checks if a recording satisfies quest criteria:

### Supported Matching Criteria

1. **Artist Match** - Recording artist must match quest artist constraint
2. **Year Match** - Recording year must be within quest year range
3. **Genre Match** - Recording must include quest genre
4. **Album Match** - Recording must be from quest album

### Example Matching

```javascript
const recording = {
  song_id: "rec_0001",
  title: "Song Name",
  artist_ids: ["art_0001"],
  year: 1991,
  genre_ids: ["gen_0002"]
};

const quest = {
  templateId: "qtpl_0004",
  params: {
    requiredCount: 1,
    startYear: 1990,
    endYear: 1992,
    artistId: "art_0001"
  }
};

// Check if recording matches quest
const matches = recordingMatchesQuestParams(recording, quest.params);
// Returns: true
```

## Quest Progression

Quests progress through states based on matching recordings:

```javascript
{
  "state": {
    "status": "active",  // or "completed"
    "matchedRecordingIds": ["rec_0001", "rec_0002", ...],
    "matchedRecordingIdsSet": {}
  }
}
```

A quest is completed when:
```
matchedRecordingIds.length >= params.requiredCount
```

## Usage Examples

### Creating a New Quest from a Template

```javascript
// Server-side
const template = getTemplate("qtpl_0001", questTemplates);
const params = {
  requiredCount: 25,
  artistId: "art_0005"
};

const validation = validateQuestParams(params, template);
if (!validation.valid) {
  return res.status(400).json({ errors: validation.errors });
}

const newQuest = {
  id: generateQuestId(),
  templateId: "qtpl_0001",
  params,
  state: {
    status: "active",
    matchedRecordingIds: [],
    matchedRecordingIdsSet: {}
  },
  reward: { type: "song", entityId: "rec_0001" }
};
```

### Checking Quest Progress

```javascript
// Client-side
const quest = activeQuests.find(q => q.id === "qst_0001");
const progress = (quest.state.matchedRecordingIds.length / quest.params.requiredCount) * 100;

console.log(`Progress: ${progress}%`);
console.log(`Completed: ${renderQuestProgress(quest)}`);
```

### Displaying Quest Information

```javascript
// Client-side
const quest = activeQuests[0];
const template = getTemplateForQuest(quest);

console.log(`Title: ${renderQuestTitle(quest)}`);
console.log(`Description: ${renderTemplateDescription(template, quest.params)}`);
console.log(`Criteria: ${getTemplateMatchCriteria(template).join(", ")}`);
```

## Parameter Types

### Parameter Type Schema

| Type | Description | Example |
|------|-------------|---------|
| `number` | Numeric value | `50`, `1990` |
| `string` | Text value | `"Spotify"`, `"venue"` |
| `art_id` | Artist identifier | `"art_0001"` |
| `gen_id` | Genre identifier | `"gen_0002"` |
| `alb_id` | Album identifier | `"alb_0005"` |
| `time` | Time in HH:MM or HH:MM:SS format | `"14:30"`, `"14:30:00"` |

## Best Practices

1. **Template Validation** - Always validate parameters against templates before creating quests
2. **Consistent Matching** - Use the same matching logic on both client and server
3. **Entity Lookups** - Use lookup maps (artistsMap, etc.) for O(1) entity access
4. **Description Rendering** - Use template descriptions instead of hardcoding quest titles
5. **Type Safety** - Respect parameter type constraints defined in templates
6. **Criteria Checking** - Check template criteria to know what constraints apply
7. **Progress Tracking** - Use matchedRecordingIds for quest completion logic

## Extension Points

The template system can be extended by:

1. **Adding New Quest Types** - Add entries to `questTemplates.json` with new types
2. **Custom Matching Logic** - Extend `recordingMatchesQuestParams()` for new criteria
3. **Custom Parameter Types** - Add type validation in `validateQuestParams()`
4. **New Rendering Strategies** - Add type-specific title rendering in `renderQuestTitle()`

## Future Enhancements

1. Time-based quest matching (currently has placeholder)
2. Composite quests (quests that combine multiple templates)
3. Template versioning for backwards compatibility
4. Quest template inheritance/specialization
5. Dynamic quest generation from user preferences
