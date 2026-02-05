import PlayerCard from './PlayerCard';

function ResultsDisplay({ loadouts, onRerollSlot, onRerollClass, onRerollArchetype, onRerollOverclock }) {
  if (!loadouts || loadouts.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-5xl">
      {/* Section header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-drg-orange/30 to-transparent" />
        <h2 className="font-drg text-drg-yellow text-lg tracking-widest uppercase text-glow-yellow">
          Your Loadouts
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-drg-orange/30 to-transparent" />
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {loadouts.map((loadout) => (
          <PlayerCard
            key={loadout.id}
            loadout={loadout}
            onRerollSlot={(slotType) => onRerollSlot(loadout.id, slotType)}
            onRerollClass={() => onRerollClass(loadout.id)}
            onRerollArchetype={() => onRerollArchetype(loadout.id)}
            onRerollOverclock={(slotType) => onRerollOverclock(loadout.id, slotType)}
          />
        ))}
      </div>
    </div>
  );
}

export default ResultsDisplay;
