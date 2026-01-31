# Quest Template Logic Implementation Summary

## Files Created

### 1. `lib/templateUtils.js` (259 lines)
Core template utility library with the following functions:

**Template Lookup:**
- `getTemplate(templateId, templates)` - Find template by ID

**Validation:**
- `validateQuestParams(questParams, template)` - Validate parameters against schema
- `canCreateQuestFromTemplate(questParams, template)` - Check if quest can be created

**Metadata:**
- `getTemplateMatchCriteria(template)` - Get matching constraints
- `getTemplateDescription(template)` - Get template description
- `getTemplateRequiredParams(template)` - Get required parameter names

**Rendering:**
- `renderTemplateDescription(template, questParams, lookupMaps)` - Render with substitutions

**Querying:**
- `groupTemplatesByType(templates)` - Group templates by type
- `getTemplatesRequiringEntities(templates, entityTypes)` - Filter by entity requirements

### 2. `TEMPLATE_SYSTEM.md` (300+ lines)
Comprehensive documentation covering:
- Architecture overview
- All 10 quest template types with examples
- API endpoints for templates
- Server-side and client-side functions
- Recording matching logic
- Usage examples
- Best practices
- Extension points

## Files Modified

### 1. `logic/questmatcher.js`
**Enhanced with:**
- Expanded parameter matching (genre, album)
- Helper function `getQuestType()` for template-aware matching
- Detailed JSDoc comments
- Better type awareness

**Key changes:**
```javascript
// Now supports genre and album matching
if (params.genreId) {
  const recGenreIds = recording.genre_ids || recording.genreIds || [];
  if (!recGenreIds.includes(params.genreId)) return false;
}

if (params.albumId) {
  const recAlbumId = recording.album_id || recording.albumId;
  if (recAlbumId !== params.albumId) return false;
}
```

### 2. `index.js` (Server)
**Added imports:**
```javascript
const {
  getTemplate,
  validateQuestParams,
  getTemplateMatchCriteria,
  renderTemplateDescription,
  getTemplateRequiredParams,
  canCreateQuestFromTemplate,
  groupTemplatesByType,
  getTemplatesRequiringEntities
} = require('./lib/templateUtils');
```

**New endpoints:**
1. `GET /quest-templates/:id` - Get detailed template info
2. `GET /quest-templates/type/:type` - Get templates by type
3. `POST /validate-quest-params` - Validate quest parameters

**Enhanced endpoints:**
- `GET /quests/:id` - Now includes template and validation info

### 3. `public/app.js` (Client)
**New template utility functions:**
- `getTemplateForQuest(quest)` - Get template for a quest
- `renderTemplateDescription(template, questParams)` - Render descriptions
- `getTemplateMatchCriteria(template)` - Get matching criteria

**Enhanced matching:**
- `recordingMatchesQuestParams()` - Now supports genre and album matching
- Added full parameter matching documentation

## Feature Summary

### Template System Capabilities

1. **Template Definition**
   - 10+ predefined quest types
   - Flexible parameter schemas
   - Type-safe parameter validation

2. **Quest Creation**
   - Validate parameters before creation
   - Get required parameters from template
   - Render descriptions with substitutions

3. **Recording Matching**
   - Artist constraints
   - Year ranges
   - Genre filters
   - Album filters
   - (Placeholder for time-based matching)

4. **API Endpoints**
   - Browse all templates
   - Get specific template details
   - Filter templates by type
   - Validate parameters
   - Get quest with template info

5. **Parameter Validation**
   - Type checking (number, string, art_id, gen_id, alb_id, time)
   - Error reporting
   - Schema-based validation

6. **Description Rendering**
   - Template variable substitution
   - Entity name lookups
   - Customizable formatting

## Usage Examples

### Server-Side
```javascript
// Import templates utilities
const { getTemplate, validateQuestParams } = require('./lib/templateUtils');

// Get a template
const template = getTemplate('qtpl_0001', questTemplates);

// Validate parameters
const params = { requiredCount: 50, artistId: 'art_0001' };
const validation = validateQuestParams(params, template);

if (validation.valid) {
  // Create quest with validated parameters
}
```

### Client-Side
```javascript
// Get template for a quest
const template = getTemplateForQuest(quest);

// Render description
const desc = renderTemplateDescription(template, quest.params);

// Get matching criteria
const criteria = getTemplateMatchCriteria(template);
```

### API Calls
```javascript
// Get template details
GET /quest-templates/qtpl_0001

// Validate parameters before creating a quest
POST /validate-quest-params
{
  "templateId": "qtpl_0001",
  "params": { "requiredCount": 50, "artistId": "art_0001" }
}
```

## Integration Points

### Existing Compatibility
- Works with existing quest rendering (`renderQuestTitle()`)
- Compatible with current progress tracking
- Uses existing data structures
- Maintains backward compatibility

### New Capabilities Enabled
- Dynamic quest generation
- Flexible template-based creation
- Parameter validation at creation time
- Rich metadata for UI rendering
- Enhanced matching capabilities

## Testing Recommendations

1. **Unit Tests for Validation**
   ```javascript
   // Test parameter type validation
   validateQuestParams({ artistId: 123 }, template) // should error
   validateQuestParams({ artistId: "art_0001" }, template) // should pass
   ```

2. **Integration Tests**
   - Create quests from templates
   - Validate matching logic
   - Test parameter rendering

3. **API Tests**
   - All new endpoints
   - Parameter validation endpoint
   - Error cases

## Performance Notes

- Template lookups use array.find() - could optimize with Map for large template sets
- Parameter validation is O(n) where n = number of params
- Rendering functions are fast (string replacement)
- No circular dependencies

## Future Enhancements

1. Add time-based matching (currently has placeholder)
2. Quest template versioning
3. Composite quests (combining multiple templates)
4. Template inheritance
5. Dynamic template generation from user preferences
