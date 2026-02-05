import classData from '../data/classes.json';

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
 * Generate a loadout for a single class
 */
function generateLoadout(classInfo) {
  return {
    class: classInfo,
    primary: randomPick(classInfo.primaryWeapons),
    secondary: randomPick(classInfo.secondaryWeapons),
    grenade: randomPick(classInfo.grenades),
    traversalTool: classInfo.traversalTool,
  };
}

/**
 * Generate a full run with loadouts for all players
 * @param {number} playerCount - Number of players (1-4)
 * @param {boolean} allowDuplicates - Whether to allow duplicate classes
 * @param {Array} playerNames - Array of player names
 * @returns {Array} Array of player loadouts
 */
export function generateRun(playerCount, allowDuplicates, playerNames = []) {
  const classes = classData.classes;
  let selectedClasses;

  if (allowDuplicates) {
    // Pick random classes, duplicates allowed
    selectedClasses = Array.from({ length: playerCount }, () => randomPick(classes));
  } else {
    // Shuffle and take first N classes (no duplicates)
    selectedClasses = shuffle(classes).slice(0, playerCount);
  }

  return selectedClasses.map((classInfo, index) => ({
    id: `player-${index}`,
    playerNumber: index + 1,
    playerName: playerNames[index] || `Player ${index + 1}`,
    ...generateLoadout(classInfo),
  }));
}

/**
 * Reroll a specific slot for a player's loadout
 * @param {Object} loadout - The current loadout
 * @param {string} slotType - 'primary', 'secondary', or 'grenade'
 * @returns {Object} Updated loadout with new value for that slot
 */
export function rerollSlot(loadout, slotType) {
  const classInfo = loadout.class;
  const currentValue = loadout[slotType];

  let newValue;
  switch (slotType) {
    case 'primary':
      newValue = randomPickExcluding(classInfo.primaryWeapons, currentValue.name);
      break;
    case 'secondary':
      newValue = randomPickExcluding(classInfo.secondaryWeapons, currentValue.name);
      break;
    case 'grenade':
      newValue = randomPickExcluding(classInfo.grenades, currentValue.name);
      break;
    default:
      return loadout;
  }

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
    // Can pick any class except current one
    availableClasses = classes.filter(c => c.id !== currentClassId);
  } else {
    // Can only pick classes not used by other players
    const usedClassIds = currentLoadouts
      .filter(l => l.id !== loadout.id)
      .map(l => l.class.id);
    availableClasses = classes.filter(
      c => c.id !== currentClassId && !usedClassIds.includes(c.id)
    );
  }

  // If no available classes (e.g., all 4 used), just pick a different one
  if (availableClasses.length === 0) {
    availableClasses = classes.filter(c => c.id !== currentClassId);
  }

  const newClass = randomPick(availableClasses);
  return {
    ...loadout,
    ...generateLoadout(newClass),
  };
}

export { classData };
