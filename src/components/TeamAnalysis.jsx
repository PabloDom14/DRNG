import weaponStats from '../data/weaponStats.json';

function getRating(score, maxPossible) {
  const percentage = score / maxPossible;
  if (percentage >= 0.75) return { label: 'Excellent', color: 'text-green-400', bars: 5 };
  if (percentage >= 0.55) return { label: 'High', color: 'text-emerald-400', bars: 4 };
  if (percentage >= 0.35) return { label: 'Medium', color: 'text-yellow-400', bars: 3 };
  if (percentage >= 0.2) return { label: 'Low', color: 'text-orange-400', bars: 2 };
  return { label: 'Minimal', color: 'text-red-400', bars: 1 };
}

function StatBar({ category, score, maxPossible }) {
  const rating = getRating(score, maxPossible);

  return (
    <div className="flex items-center gap-3">
      <span className="text-lg w-6">{category.icon}</span>
      <span className="text-sm text-gray-400 w-28">{category.name}</span>
      <div className="flex gap-1 flex-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-3 flex-1 rounded-sm transition-all ${
              i <= rating.bars
                ? 'bg-gradient-to-r from-drg-orange to-drg-yellow'
                : 'bg-gray-700'
            }`}
          />
        ))}
      </div>
      <span className={`text-sm font-medium w-20 text-right ${rating.color}`}>
        {rating.label}
      </span>
    </div>
  );
}

function TeamAnalysis({ loadouts }) {
  if (!loadouts || loadouts.length === 0) {
    return null;
  }

  // Calculate team scores
  const scores = {
    swarmClear: 0,
    singleTarget: 0,
    mobility: 0,
    utility: 0
  };

  // Max possible per player: primary(3) + secondary(3) + grenade(3) + traversal(3) = 12
  // So max per category = 12 * playerCount
  const maxPerPlayer = 12;
  const maxPossible = maxPerPlayer * loadouts.length;

  loadouts.forEach(loadout => {
    // Primary weapon
    const primaryStats = weaponStats.weapons[loadout.primary.name] || {};
    scores.swarmClear += primaryStats.swarmClear || 0;
    scores.singleTarget += primaryStats.singleTarget || 0;
    scores.mobility += primaryStats.mobility || 0;
    scores.utility += primaryStats.utility || 0;

    // Secondary weapon
    const secondaryStats = weaponStats.weapons[loadout.secondary.name] || {};
    scores.swarmClear += secondaryStats.swarmClear || 0;
    scores.singleTarget += secondaryStats.singleTarget || 0;
    scores.mobility += secondaryStats.mobility || 0;
    scores.utility += secondaryStats.utility || 0;

    // Grenade
    const grenadeStats = weaponStats.grenades[loadout.grenade.name] || {};
    scores.swarmClear += grenadeStats.swarmClear || 0;
    scores.singleTarget += grenadeStats.singleTarget || 0;
    scores.mobility += grenadeStats.mobility || 0;
    scores.utility += grenadeStats.utility || 0;

    // Traversal tool
    const traversalStats = weaponStats.traversalTools[loadout.traversalTool.name] || {};
    scores.swarmClear += traversalStats.swarmClear || 0;
    scores.singleTarget += traversalStats.singleTarget || 0;
    scores.mobility += traversalStats.mobility || 0;
    scores.utility += traversalStats.utility || 0;
  });

  return (
    <div className="w-full max-w-5xl mb-8">
      {/* Section header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-drg-yellow/30 to-transparent" />
        <h2 className="font-drg text-drg-yellow text-lg tracking-widest uppercase">
          Team Stats
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-drg-yellow/30 to-transparent" />
      </div>

      {/* Stats */}
      <div className="bg-drg-card/50 rounded-xl p-5 border-glow flex flex-col gap-3">
        {weaponStats.categories.map(category => (
          <StatBar
            key={category.id}
            category={category}
            score={scores[category.id]}
            maxPossible={maxPossible}
          />
        ))}
      </div>
    </div>
  );
}

export default TeamAnalysis;
