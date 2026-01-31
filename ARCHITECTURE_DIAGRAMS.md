# Quest Template System - Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      QUEST TEMPLATE SYSTEM                      │
└─────────────────────────────────────────────────────────────────┘

DATA LAYER
┌──────────────────┐  ┌──────────────────┐
│  Templates       │  │  Quests          │
│  (Schemas)       │  │  (Instances)     │
├──────────────────┤  ├──────────────────┤
│ 10+ Quest Types  │  │ Quest with ID    │
│ Parameter schema │  │ templateId       │
│ Descriptions     │  │ parameters       │
└────────┬─────────┘  │ state            │
         │            │ reward           │
         └────────────┴──────────────────┘
                 ▲
                 │ Data flows up to business logic

BUSINESS LOGIC LAYER
┌──────────────────────────────────────────────────────────────────┐
│                    Template Utilities                            │
│  (lib/templateUtils.js - 259 lines)                             │
├──────────────────────────────────────────────────────────────────┤
│ ✓ getTemplate()                    ✓ renderTemplateDescription() │
│ ✓ validateQuestParams()            ✓ getTemplateRequiredParams()│
│ ✓ getTemplateMatchCriteria()       ✓ canCreateQuestFromTemplate│
│ ✓ getTemplateDescription()         ✓ groupTemplatesByType()     │
│                                    ✓ getTemplatesRequiringEntities
└──────┬───────────────────────────────────────┬──────────────────┘
       │                                       │
       │  Server                              │  Client
       ▼                                       ▼
   ┌─────────────────────────┐    ┌──────────────────────────┐
   │  Quest Matcher          │    │  Client Functions        │
   │  (questmatcher.js)      │    │  (app.js)                │
   ├─────────────────────────┤    ├──────────────────────────┤
   │ recordingMatchesQuest()  │    │ getTemplateForQuest()    │
   │ getQuestType()          │    │ renderQuestTitle()       │
   │                         │    │ renderQuestProgress()    │
   │ Checks:                 │    │ recordingMatchesQuestParams()
   │ - Artist IDs            │    │ renderTemplateDescription()
   │ - Genre IDs             │    │ getTemplateMatchCriteria()
   │ - Album ID              │    │                          │
   │ - Year Range            │    │                          │
   └───────────┬─────────────┘    └──────────────┬───────────┘
               │                                 │
               └─────────────┬───────────────────┘
                             ▼
                     API & Rendering Layer

SERVER API ENDPOINTS (index.js)
┌──────────────────────────────────────────────────────────────────┐
│ GET  /quest-templates                  │ All templates           │
│ GET  /quest-templates/:id               │ Template + details     │
│ GET  /quest-templates/type/:type        │ Templates by type      │
│ GET  /quests/:id                        │ Quest + template info  │
│ POST /validate-quest-params             │ Validate before create │
└──────────────────────────────────────────────────────────────────┘

CLIENT RENDERING (app.js)
┌──────────────────────────────────────────────────────────────────┐
│ • Quest Titles: renderQuestTitle()                               │
│ • Quest Progress: renderQuestProgress()                          │
│ • Quest Details: showQuest()                                     │
│ • Template Info: rendered in UI dynamically                      │
└──────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│  Step 1: Load Templates                                         │
└─────────────────────────────────────────────────────────────────┘

questTemplates.json
    ▼
index.js: loadDataFile(questTemplatesPath, "quest templates")
    ▼
questTemplates = [...templates...]
    ▼
GET /quest-templates endpoint
    ▼
Client: allQuestTemplates = [...]

┌─────────────────────────────────────────────────────────────────┐
│  Step 2: Create Quest from Template                             │
└─────────────────────────────────────────────────────────────────┘

POST /validate-quest-params
  {
    templateId: "qtpl_0001",
    params: { requiredCount: 50, artistId: "art_0001" }
  }
    ▼
getTemplate("qtpl_0001", questTemplates) → template object
    ▼
validateQuestParams(params, template)
    ▼
    ├─ Check type of each param
    ├─ Verify all constraints
    ▼
Response: { valid: true, errors: [], criteria: [...] }
    ▼
Create new quest in quests.json

┌─────────────────────────────────────────────────────────────────┐
│  Step 3: Load Quest and Display                                 │
└─────────────────────────────────────────────────────────────────┘

GET /quests/:id
    ▼
Find quest in quests array
    ▼
getTemplate(quest.templateId, questTemplates)
    ▼
validateQuestParams(quest.params, template)
    ▼
Response: {
  ...quest,
  template: {...},
  validation: { isValid: true, errors: [] }
}
    ▼
Client: renderQuestTitle(quest)
    ▼
    ├─ Get template
    ├─ Get quest type from template
    ├─ Use switch/case to format title
    ├─ Lookup artist/genre/album names
    ▼
"Listen to 50 songs by The Beatles"

┌─────────────────────────────────────────────────────────────────┐
│  Step 4: Check Recording Against Quest                          │
└─────────────────────────────────────────────────────────────────┘

User plays: recording = { song_id, artist_ids, year, genre_ids... }
    ▼
recordingMatchesQuestParams(recording, quest.params)
    ▼
    ├─ Check artist_ids includes quest.artistId?
    ├─ Check year in [startYear, endYear]?
    ├─ Check genre_ids includes quest.genreId?
    ├─ Check album_id matches quest.albumId?
    ▼
True/False response
    ▼
If True:
    applyListenEvent(quest, recording)
      ├─ Add to matchedRecordingIds
      ├─ Check if quest completed
      ├─ Update quest.state.status
      ▼
    Update UI progress
```

## Quest Template Type Hierarchy

```
╔══════════════════════════════════════════════════════════════════╗
║                    QUEST TEMPLATE TYPES                          ║
╠════════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  LISTENING QUESTS                                                ║
║  ├─ listen_count          Listen to N songs (by artist)         ║
║  ├─ listen_minutes        Listen for X minutes (by artist)      ║
║  ├─ listen_by_year        Listen from year range (by artist)    ║
║  ├─ listen_by_genre       Listen to genre (by artist)           ║
║  ├─ listen_between_time   Listen during time window             ║
║  └─ listen_to_album       Listen to N songs from album          ║
║                                                                  ║
║  ENGAGEMENT QUESTS                                               ║
║  ├─ streak_app            Open app for N consecutive days       ║
║  └─ travel_amount         Check in at N locations               ║
║                                                                  ║
║  INTEGRATION QUESTS                                              ║
║  ├─ connect_account       Link external account                 ║
║  └─ location_checkin      Check in at location type             ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

## Parameter Validation Flow

```
Input: questParams = { requiredCount: 50, artistId: "art_0001" }
Template: questTemplates[0] with params schema
    ▼
validateQuestParams(questParams, template)
    ▼
    ├─ templateParams = template.params
    │   { requiredCount: "number", artistId: "art_id" }
    │   ▼
    ├─ For each param in templateParams:
    │   ├─ Get value from questParams
    │   ├─ Check param type:
    │   │   ├─ "number": typeof value === "number"
    │   │   ├─ "string": typeof value === "string"
    │   │   ├─ "art_id": typeof value === "string"
    │   │   ├─ "gen_id": typeof value === "string"
    │   │   ├─ "alb_id": typeof value === "string"
    │   │   └─ "time": /^\d{1,2}:\d{2}(:\d{2})?$/.test(value)
    │   ▼
    │   ├─ Type match? → Continue
    │   └─ Type mismatch? → Add to errors array
    │   ▼
    └─ Return { valid: errors.length === 0, errors: [...] }

Output: { valid: true, errors: [] }  ✓ Valid
    or  { valid: false, errors: [messages] }  ✗ Invalid
```

## Integration Points

```
┌─────────────────────────────────────────────────────────────────┐
│              EXISTING SYSTEM COMPATIBILITY                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Existing renderQuestTitle()                                     │
│  └─ ✓ Already uses template-based rendering                     │
│     ✓ Works with 10 quest types                                  │
│     ✓ No changes needed                                          │
│                                                                  │
│  Existing quest data in data/quests.json                         │
│  └─ ✓ Compatible with new validation                            │
│     ✓ templateId field matches                                   │
│     ✓ params format consistent                                   │
│                                                                  │
│  Existing quest matching in logic                                │
│  └─ ✓ Enhanced questmatcher.js                                  │
│     ✓ Now supports genre and album                              │
│     ✓ Backward compatible                                        │
│                                                                  │
│  Existing app.js rendering                                       │
│  └─ ✓ New template utility functions added                       │
│     ✓ renderQuestTitle() still works                            │
│     ✓ Progress tracking unchanged                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Function Call Dependency Graph

```
validateQuestParams()
├── Called by: POST /validate-quest-params
├── Called by: Server quest creation
└── Requires: template.params schema

getTemplate()
├── Called by: All template operations
├── Called by: validateQuestParams()
├── Called by: Client-side functions
└── Requires: templates array

recordingMatchesQuestParams()
├── Called by: applyListenEvent()
├── Called by: Client quest UI
└── Requires: params structure

renderTemplateDescription()
├── Called by: API responses
├── Called by: Client rendering
└── Requires: template + params + lookup functions

getTemplateMatchCriteria()
├── Called by: API responses
├── Called by: Client filtering
└── Requires: template object

renderQuestTitle()
├── Called by: loadQuests()
├── Called by: showQuest()
└── Requires: quest + template + artists data
```

## New vs Existing Code

```
NEW CODE (Template Utilities Added)
├─ lib/templateUtils.js              (259 lines, 11 functions)
├─ TEMPLATE_SYSTEM.md                (300+ lines, complete guide)
├─ TEMPLATE_IMPLEMENTATION.md        (200+ lines, implementation guide)
└─ TEMPLATE_QUICK_REFERENCE.md       (Quick reference)

ENHANCED CODE (Existing files modified)
├─ logic/questmatcher.js
│  ├─ Now supports: genre matching, album matching
│  └─ Added: getQuestType() helper
│
├─ index.js (Server)
│  ├─ Added: import templateUtils
│  ├─ Added: 3 new endpoints
│  ├─ Enhanced: /quests/:id endpoint
│  └─ Added: /validate-quest-params endpoint
│
└─ public/app.js (Client)
   ├─ Added: 4 template utility functions
   ├─ Enhanced: recordingMatchesQuestParams()
   └─ Works with: existing renderQuestTitle()

UNCHANGED
├─ data/questTemplates.json          (Already complete)
├─ data/quests.json                  (Now fully validated)
└─ Existing quest rendering logic
```

## Error Handling Flow

```
Validation Error
    ▼
validateQuestParams() detects type mismatch
    ▼
errors.push("Parameter 'X' must be Y, got Z")
    ▼
Return { valid: false, errors: [...] }
    ▼
API returns 400 with error details
    ▼
Client handles:
    ├─ Display error messages
    ├─ Highlight invalid fields
    └─ Don't create quest

Matching Error
    ▼
recordingMatchesQuestParams() returns false
    ▼
Recording doesn't match quest
    ▼
applyListenEvent() doesn't add to matchedRecordingIds
    ▼
Quest progress unchanged
    ▼
User notified (in UI)
```

## Performance Characteristics

```
Operation                          Time Complexity
────────────────────────────────────────────────
getTemplate(id)                    O(n) where n = templates
validateQuestParams()              O(p) where p = params
recordingMatchesQuestParams()      O(1) average case
renderTemplateDescription()        O(s) where s = string length
groupTemplatesByType()             O(n)
getTemplateMatchCriteria()         O(1)
getTemplatesRequiringEntities()    O(n*e) where e = entities

Optimizations in place:
├─ Template lookup could use Map (not critical, small array)
├─ Recording matching uses Set for O(1) lookups
├─ artistsMap/albumsMap for fast entity lookups
└─ Matching is short-circuit evaluated
```
