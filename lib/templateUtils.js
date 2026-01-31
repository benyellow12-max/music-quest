/**
 * Template Utilities - Handles quest template operations and parameter validation
 */

/**
 * Find a template by ID from an array of templates
 * @param {string} templateId - The template ID to find
 * @param {Array} templates - Array of template objects
 * @returns {Object|null} The template or null if not found
 */
function getTemplate(templateId, templates) {
  if (!templates || !Array.isArray(templates)) {
    return null;
  }
  return templates.find(t => t && t.id === templateId) || null;
}

/**
 * Validate that quest parameters match the template schema
 * @param {Object} questParams - The parameters from the quest
 * @param {Object} template - The template defining valid parameters
 * @returns {Object} { valid: boolean, errors: Array<string> }
 */
function validateQuestParams(questParams, template) {
  const errors = [];
  
  if (!template || !template.params) {
    return { valid: false, errors: ["Template definition missing params schema"] };
  }

  const questParams_obj = questParams || {};
  const templateParams = template.params;

  // Check each parameter defined in template
  Object.entries(templateParams).forEach(([paramName, expectedType]) => {
    const value = questParams_obj[paramName];

    // Validate parameter types
    switch (expectedType) {
      case "number":
        if (value !== undefined && typeof value !== "number") {
          errors.push(`Parameter '${paramName}' must be a number, got ${typeof value}`);
        }
        break;
      case "string":
        if (value !== undefined && typeof value !== "string") {
          errors.push(`Parameter '${paramName}' must be a string, got ${typeof value}`);
        }
        break;
      case "art_id":
        if (value !== undefined && typeof value !== "string") {
          errors.push(`Parameter '${paramName}' must be an artist ID, got ${typeof value}`);
        }
        break;
      case "gen_id":
        if (value !== undefined && typeof value !== "string") {
          errors.push(`Parameter '${paramName}' must be a genre ID, got ${typeof value}`);
        }
        break;
      case "alb_id":
        if (value !== undefined && typeof value !== "string") {
          errors.push(`Parameter '${paramName}' must be an album ID, got ${typeof value}`);
        }
        break;
      case "time":
        // Time format validation (HH:MM or HH:MM:SS)
        if (value !== undefined && !/^\d{1,2}:\d{2}(:\d{2})?$/.test(value)) {
          errors.push(`Parameter '${paramName}' must be a valid time format (HH:MM or HH:MM:SS)`);
        }
        break;
      default:
        // Unknown type
        if (value !== undefined) {
          console.warn(`Unknown parameter type for ${paramName}: ${expectedType}`);
        }
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Get the matching criteria for a template type
 * Helps determine what criteria to use when checking if a recording matches
 * @param {Object} template - The template object
 * @returns {Array<string>} Array of criteria names that apply to this template type
 */
function getTemplateMatchCriteria(template) {
  if (!template) return [];

  const criteria = {
    "listen_count": ["artist"],
    "listen_minutes": ["artist"],
    "listen_by_year": ["artist", "year"],
    "listen_by_genre": ["genre", "artist"],
    "listen_between_time": ["artist", "time"],
    "travel_amount": [],
    "listen_to_album": ["album", "artist"],
    "connect_account": [],
    "location_checkin": [],
    "streak_app": []
  };

  return criteria[template.type] || [];
}

/**
 * Get user-friendly description of what a quest template requires
 * @param {Object} template - The template object
 * @returns {string} Description of the template
 */
function getTemplateDescription(template) {
  if (!template || !template.description) {
    return "Complete a quest";
  }
  
  return template.description;
}

/**
 * Render template description with parameters filled in
 * @param {Object} template - The template object
 * @param {Object} questParams - Parameters from the quest
 * @param {Object} lookupMaps - Object with artist, album, genre lookup functions
 *   { getArtist, getAlbum, getGenre }
 * @returns {string} Rendered description
 */
function renderTemplateDescription(template, questParams, lookupMaps = {}) {
  if (!template || !template.description) {
    return "Complete a quest";
  }

  let description = template.description;
  const params = questParams || {};

  // Replace template variables with actual values
  description = description.replace(/{{count}}/g, params.count || params.requiredCount || "1");
  description = description.replace(/{{minutes}}/g, params.minutes || "60");
  description = description.replace(/{{days}}/g, params.days || "1");
  description = description.replace(/{{startYear}}/g, params.startYear || "2000");
  description = description.replace(/{{endYear}}/g, params.endYear || "2024");
  description = description.replace(/{{startTime}}/g, params.startTime || "00:00");
  description = description.replace(/{{endTime}}/g, params.endTime || "23:59");
  description = description.replace(/{{number}}/g, params.number || "1");
  description = description.replace(/{{songs}}/g, params.songs || "1");
  description = description.replace(/{{accountType}}/g, params.accountType || "account");
  description = description.replace(/{{locationtype}}/g, params.locationtype || "location");

  // Replace entity IDs with names using lookup functions
  if (lookupMaps.getArtist && params.artistId) {
    const artist = lookupMaps.getArtist(params.artistId);
    if (artist) {
      description = description.replace(/{{artistId}}/g, artist.name);
    }
  } else {
    description = description.replace(/{{artistId}}/g, params.artistId || "artist");
  }

  if (lookupMaps.getGenre && params.genreId) {
    const genre = lookupMaps.getGenre(params.genreId);
    if (genre) {
      description = description.replace(/{{genreId}}/g, genre.name);
    }
  } else {
    description = description.replace(/{{genreId}}/g, params.genreId || "genre");
  }

  if (lookupMaps.getAlbum && params.albumId) {
    const album = lookupMaps.getAlbum(params.albumId);
    if (album) {
      description = description.replace(/{{albumId}}/g, album.title);
    }
  } else {
    description = description.replace(/{{albumId}}/g, params.albumId || "album");
  }

  return description;
}

/**
 * Get all required parameters for a template
 * @param {Object} template - The template object
 * @returns {Array<string>} Array of required parameter names
 */
function getTemplateRequiredParams(template) {
  if (!template || !template.params) {
    return [];
  }
  return Object.keys(template.params);
}

/**
 * Check if a quest can be created from a template
 * (has all required parameters)
 * @param {Object} questParams - Parameters for the quest
 * @param {Object} template - The template
 * @returns {boolean} True if quest can be created
 */
function canCreateQuestFromTemplate(questParams, template) {
  const validation = validateQuestParams(questParams, template);
  return validation.valid;
}

/**
 * Group templates by type
 * @param {Array} templates - Array of template objects
 * @returns {Object} Object with type as key and array of templates as value
 */
function groupTemplatesByType(templates) {
  const grouped = {};
  
  if (!templates || !Array.isArray(templates)) {
    return grouped;
  }

  templates.forEach(template => {
    if (!template || !template.type) return;
    
    if (!grouped[template.type]) {
      grouped[template.type] = [];
    }
    grouped[template.type].push(template);
  });

  return grouped;
}

/**
 * Get templates that require specific entity types
 * @param {Array} templates - Array of template objects
 * @param {Array<string>} entityTypes - Entity types to filter by (e.g., ["artist", "genre"])
 * @returns {Array} Filtered templates
 */
function getTemplatesRequiringEntities(templates, entityTypes) {
  if (!templates || !Array.isArray(templates)) {
    return [];
  }

  return templates.filter(template => {
    const criteria = getTemplateMatchCriteria(template);
    return entityTypes.some(type => criteria.includes(type));
  });
}

module.exports = {
  getTemplate,
  validateQuestParams,
  getTemplateMatchCriteria,
  getTemplateDescription,
  renderTemplateDescription,
  getTemplateRequiredParams,
  canCreateQuestFromTemplate,
  groupTemplatesByType,
  getTemplatesRequiringEntities
};
