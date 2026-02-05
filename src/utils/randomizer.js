import classData from '../data/classes.json';
import archetypeData from '../data/archetypes.json';

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
function generateLoadout(classInfo, archetype = null) {
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
  };
}

/**
 * Generate a full run with loadouts for all players
 * @param {number} playerCount - Number of players (1-4)
 * @param {boolean} allowDuplicates - Whether to allow duplicate classes
 * @param {Array} playerNames - Array of player names
 * @param {boolean} useArchetypes - Whether to assign archetypes
 * @returns {Array} Array of player loadouts
 */
export function generateRun(playerCount, allowDuplicates, playerNames = [], useArchetypes = false) {
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
      ...generateLoadout(classInfo, archetype),
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

  return {
    ...loadout,
    [slotType]: newValue,
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

  // Keep the same archetype if one was assigned
  return {
    ...loadout,
    ...generateLoadout(newClass, loadout.archetype),
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

export { classData, archetypeData };
