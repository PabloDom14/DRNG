import classData from '../data/classes.json';
import archetypeData from '../data/archetypes.json';
import challengeData from '../data/challenges.json';
import overclockData from '../data/overclocks.json';

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Pick a random item from an array
 */
function randomPick(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Pick a random item from an array, excluding a specific value (by name)
 */
function randomPickExcluding(array, excludeName) {
  const filtered = array.filter(item => item.name !== excludeName);
  if (filtered.length === 0) return randomPick(array);
  return randomPick(filtered);
}

/**
 * Get an overclock for a weapon based on the mode
 * @param {string} weaponName - Name of the weapon
 * @param {string} mode - 'balanced', 'meta', or 'unhinged'
 * @returns {Object|null} Selected overclock or null if none available
 */
function getOverclock(weaponName, mode) {
  const weaponOverclocks = overclockData.overclocks[weaponName];
  if (!weaponOverclocks) return null;

  let available;
  if (mode === 'unhinged') {
    // Unhinged mode: prefer unhinged, but can pick anything
    const unhingedOCs = weaponOverclocks.filter(oc => oc.tier === 'unhinged');
    available = unhingedOCs.length > 0 ? unhingedOCs : weaponOverclocks;
  } else if (mode === 'meta') {
    // Meta mode: prefer meta, fallback to balanced
    const metaOCs = weaponOverclocks.filter(oc => oc.tier === 'meta');
    const balancedOCs = weaponOverclocks.filter(oc => oc.tier === 'balanced');
    available = metaOCs.length > 0 ? metaOCs : balancedOCs;
  } else {
    // Balanced mode: only balanced overclocks
    const balancedOCs = weaponOverclocks.filter(oc => oc.tier === 'balanced');
    available = balancedOCs.length > 0 ? balancedOCs : weaponOverclocks;
  }

  const selected = randomPick(available);
  return { ...selected, weaponName };
}

/**
 * Get weapons that match an archetype for a class/slot
 */
function getArchetypeWeapons(classId, slotType, archetype, weapons) {
  const weaponMappings = archetypeData.weaponArchetypes[classId]?.[slotType];
  if (!weaponMappings) return weapons;

  const matchingWeapons = weapons.filter(weapon => {
    const archetypes = weaponMappings[weapon.name] || [];
    return archetypes.includes(archetype.id);
  });

  // If no weapons match, return all weapons as fallback
  return matchingWeapons.length > 0 ? matchingWeapons : weapons;
}

/**
 * Generate a loadout for a single class
 */
function generateLoadout(classInfo, archetype = null, overclockMode = null) {
  let primary, secondary, grenade;

  if (archetype) {
    // Filter weapons by archetype
    const primaryWeapons = getArchetypeWeapons(classInfo.id, 'primary', archetype, classInfo.primaryWeapons);
    const secondaryWeapons = getArchetypeWeapons(classInfo.id, 'secondary', archetype, classInfo.secondaryWeapons);
    const grenades = getArchetypeWeapons(classInfo.id, 'grenade', archetype, classInfo.grenades);

    primary = randomPick(primaryWeapons);
    secondary = randomPick(secondaryWeapons);
    grenade = randomPick(grenades);
  } else {
    primary = randomPick(classInfo.primaryWeapons);
    secondary = randomPick(classInfo.secondaryWeapons);
    grenade = randomPick(classInfo.grenades);
  }

  // Add overclocks if mode is specified
  let primaryOverclock = null;
  let secondaryOverclock = null;

  if (overclockMode) {
    primaryOverclock = getOverclock(primary.name, overclockMode);
    secondaryOverclock = getOverclock(secondary.name, overclockMode);
  }

  return {
    class: classInfo,
    archetype: archetype,
    archetypeDescription: archetype
      ? archetypeData.classArchetypeDescriptions[classInfo.id]?.[archetype.id] || archetype.description
      : null,
    primary,
    secondary,
    grenade,
    traversalTool: classInfo.traversalTool,
    primaryOverclock,
    secondaryOverclock,
    overclockMode,
  };
}

/**
 * Generate a full run with loadouts for all players
 * @param {number} playerCount - Number of players (1-4)
 * @param {boolean} allowDuplicates - Whether to allow duplicate classes
 * @param {Array} playerNames - Array of player names
 * @param {boolean} useArchetypes - Whether to assign archetypes
 * @param {string|null} overclockMode - 'balanced', 'meta', 'unhinged', or null
 * @returns {Array} Array of player loadouts
 */
export function generateRun(playerCount, allowDuplicates, playerNames = [], useArchetypes = false, overclockMode = null) {
  const classes = classData.classes;
  const archetypes = archetypeData.archetypes;
  let selectedClasses;

  if (allowDuplicates) {
    selectedClasses = Array.from({ length: playerCount }, () => randomPick(classes));
  } else {
    selectedClasses = shuffle(classes).slice(0, playerCount);
  }

  // Shuffle archetypes for variety
  const shuffledArchetypes = shuffle(archetypes);

  return selectedClasses.map((classInfo, index) => {
    const archetype = useArchetypes ? shuffledArchetypes[index % shuffledArchetypes.length] : null;

    return {
      id: `player-${index}`,
      playerNumber: index + 1,
      playerName: playerNames[index] || `Player ${index + 1}`,
      ...generateLoadout(classInfo, archetype, overclockMode),
    };
  });
}

/**
 * Reroll a specific slot for a player's loadout
 * @param {Object} loadout - The current loadout
 * @param {string} slotType - 'primary', 'secondary', or 'grenade'
 * @returns {Object} Updated loadout with new value for that slot
 */
export function rerollSlot(loadout, slotType) {
  const classInfo = loadout.class;
  const archetype = loadout.archetype;
  const overclockMode = loadout.overclockMode;
  const currentValue = loadout[slotType];

  let weaponPool;
  switch (slotType) {
    case 'primary':
      weaponPool = archetype
        ? getArchetypeWeapons(classInfo.id, 'primary', archetype, classInfo.primaryWeapons)
        : classInfo.primaryWeapons;
      break;
    case 'secondary':
      weaponPool = archetype
        ? getArchetypeWeapons(classInfo.id, 'secondary', archetype, classInfo.secondaryWeapons)
        : classInfo.secondaryWeapons;
      break;
    case 'grenade':
      weaponPool = archetype
        ? getArchetypeWeapons(classInfo.id, 'grenade', archetype, classInfo.grenades)
        : classInfo.grenades;
      break;
    default:
      return loadout;
  }

  const newValue = randomPickExcluding(weaponPool, currentValue.name);

  // Update overclock if applicable
  const result = {
    ...loadout,
    [slotType]: newValue,
  };

  if (overclockMode && (slotType === 'primary' || slotType === 'secondary')) {
    const overclockKey = slotType === 'primary' ? 'primaryOverclock' : 'secondaryOverclock';
    result[overclockKey] = getOverclock(newValue.name, overclockMode);
  }

  return result;
}

/**
 * Reroll just the overclock for a weapon slot
 * @param {Object} loadout - The current loadout
 * @param {string} slotType - 'primary' or 'secondary'
 * @returns {Object} Updated loadout with new overclock
 */
export function rerollOverclock(loadout, slotType) {
  const overclockMode = loadout.overclockMode;
  if (!overclockMode) return loadout;

  const weaponName = slotType === 'primary' ? loadout.primary.name : loadout.secondary.name;
  const overclockKey = slotType === 'primary' ? 'primaryOverclock' : 'secondaryOverclock';
  const currentOC = loadout[overclockKey];

  // Get a different overclock
  const weaponOverclocks = overclockData.overclocks[weaponName] || [];
  let available;

  if (overclockMode === 'unhinged') {
    const unhingedOCs = weaponOverclocks.filter(oc => oc.tier === 'unhinged' && oc.name !== currentOC?.name);
    available = unhingedOCs.length > 0 ? unhingedOCs : weaponOverclocks.filter(oc => oc.name !== currentOC?.name);
  } else if (overclockMode === 'meta') {
    const metaOCs = weaponOverclocks.filter(oc => oc.tier === 'meta' && oc.name !== currentOC?.name);
    available = metaOCs.length > 0 ? metaOCs : weaponOverclocks.filter(oc => oc.name !== currentOC?.name);
  } else {
    const balancedOCs = weaponOverclocks.filter(oc => oc.tier === 'balanced' && oc.name !== currentOC?.name);
    available = balancedOCs.length > 0 ? balancedOCs : weaponOverclocks.filter(oc => oc.name !== currentOC?.name);
  }

  if (available.length === 0) available = weaponOverclocks;

  const newOC = randomPick(available);

  return {
    ...loadout,
    [overclockKey]: { ...newOC, weaponName },
  };
}

/**
 * Reroll the class for a player (keeps same player slot)
 * @param {Object} loadout - The current loadout
 * @param {Array} currentLoadouts - All current loadouts (to check for duplicates)
 * @param {boolean} allowDuplicates - Whether duplicates are allowed
 * @returns {Object} New loadout with different class
 */
export function rerollClass(loadout, currentLoadouts, allowDuplicates) {
  const classes = classData.classes;
  const currentClassId = loadout.class.id;

  let availableClasses;
  if (allowDuplicates) {
    availableClasses = classes.filter(c => c.id !== currentClassId);
  } else {
    const usedClassIds = currentLoadouts
      .filter(l => l.id !== loadout.id)
      .map(l => l.class.id);
    availableClasses = classes.filter(
      c => c.id !== currentClassId && !usedClassIds.includes(c.id)
    );
  }

  if (availableClasses.length === 0) {
    availableClasses = classes.filter(c => c.id !== currentClassId);
  }

  const newClass = randomPick(availableClasses);

  // Keep the same archetype and overclock mode if assigned
  return {
    ...loadout,
    ...generateLoadout(newClass, loadout.archetype, loadout.overclockMode),
  };
}

/**
 * Reroll the archetype for a player
 * @param {Object} loadout - The current loadout
 * @returns {Object} New loadout with different archetype and matching weapons
 */
export function rerollArchetype(loadout) {
  if (!loadout.archetype) return loadout;

  const archetypes = archetypeData.archetypes;
  const currentArchetypeId = loadout.archetype.id;

  const availableArchetypes = archetypes.filter(a => a.id !== currentArchetypeId);
  const newArchetype = randomPick(availableArchetypes);

  return {
    ...loadout,
    ...generateLoadout(loadout.class, newArchetype),
  };
}

/**
 * Select random challenges for the run
 * @param {number} count - Number of challenges to select (1-3)
 * @param {Array} loadouts - Current loadouts to assign player-specific challenges
 * @returns {Array} Array of selected challenges with assigned players if applicable
 */
export function selectChallenges(count = 2, loadouts = []) {
  const challenges = challengeData.challenges;
  const shuffled = shuffle([...challenges]);
  const selected = shuffled.slice(0, count);

  return selected.map(challenge => {
    const result = { ...challenge };

    // Assign a random player for player-specific challenges
    if (challenge.type === 'player' && loadouts.length > 0) {
      const randomPlayer = randomPick(loadouts);
      result.assignedPlayer = randomPlayer.playerName;
    }

    // Check if class-specific challenge applies
    if (challenge.type === 'class' && loadouts.length > 0) {
      const matchingPlayer = loadouts.find(l => l.class.id === challenge.class);
      if (matchingPlayer) {
        result.assignedPlayer = matchingPlayer.playerName;
      } else {
        // Class not in party, skip this challenge type
        result.skipped = true;
      }
    }

    return result;
  }).filter(c => !c.skipped);
}

/**
 * Reroll challenges
 * @param {number} count - Number of challenges to select
 * @param {Array} loadouts - Current loadouts
 * @param {Array} currentChallenges - Current challenges to avoid duplicates
 * @returns {Array} New array of challenges
 */
export function rerollChallenges(count, loadouts, currentChallenges = []) {
  const challenges = challengeData.challenges;
  const currentIds = currentChallenges.map(c => c.id);
  const available = challenges.filter(c => !currentIds.includes(c.id));

  if (available.length < count) {
    // Not enough unique challenges, just get new random ones
    return selectChallenges(count, loadouts);
  }

  const shuffled = shuffle([...available]);
  const selected = shuffled.slice(0, count);

  return selected.map(challenge => {
    const result = { ...challenge };

    if (challenge.type === 'player' && loadouts.length > 0) {
      const randomPlayer = randomPick(loadouts);
      result.assignedPlayer = randomPlayer.playerName;
    }

    if (challenge.type === 'class' && loadouts.length > 0) {
      const matchingPlayer = loadouts.find(l => l.class.id === challenge.class);
      if (matchingPlayer) {
        result.assignedPlayer = matchingPlayer.playerName;
      } else {
        result.skipped = true;
      }
    }

    return result;
  }).filter(c => !c.skipped);
}

export { classData, archetypeData, challengeData, overclockData };
