const OVERCLOCK_TIER_STYLES = {
  balanced: { color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30' },
  meta: { color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' },
  unhinged: { color: 'text-pink-400', bg: 'bg-pink-500/20', border: 'border-pink-500/30' },
};

function OverclockBadge({ overclock, onReroll }) {
  if (!overclock) return null;

  const tierStyle = OVERCLOCK_TIER_STYLES[overclock.tier] || OVERCLOCK_TIER_STYLES.balanced;

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onReroll();
      }}
      className={`mt-1 px-2 py-1 rounded text-xs font-medium flex items-center gap-1
        ${tierStyle.bg} ${tierStyle.border} border ${tierStyle.color}
        hover:brightness-125 transition-all`}
      title="Click to reroll overclock"
    >
      <span className="uppercase tracking-wide">{overclock.name}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-3 w-3 opacity-60"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
}

function SlotItem({ label, item, onReroll, canReroll = true, overclock = null, onRerollOverclock = null }) {
  const { name, icon } = typeof item === 'object' ? item : { name: item, icon: null };

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={canReroll ? onReroll : undefined}
        disabled={!canReroll}
        className={`flex items-center gap-3 p-3 rounded-lg transition-all text-left min-h-[70px]
          border border-transparent
          ${canReroll
            ? 'hover:bg-white/5 hover:border-drg-orange/30 cursor-pointer active:scale-[0.98] slot-glow'
            : 'opacity-60 cursor-default'
          }`}
        aria-label={canReroll ? `Reroll ${label}` : label}
      >
        {icon && (
          <div className="weapon-icon flex-shrink-0">
            <img
              src={icon}
              alt=""
              className="w-12 h-12 object-contain"
              loading="lazy"
            />
          </div>
        )}
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-[10px] text-drg-orange/70 uppercase tracking-wider font-medium">
            {label}
          </span>
          <span className="text-sm font-medium text-white/90 leading-tight">{name}</span>
          {overclock && onRerollOverclock && (
            <OverclockBadge overclock={overclock} onReroll={onRerollOverclock} />
          )}
        </div>
        {canReroll && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-auto text-gray-600 flex-shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>
    </div>
  );
}

function ArchetypeBadge({ archetype, description, onReroll }) {
  return (
    <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-black/30 to-transparent border-l-2"
         style={{ borderLeftColor: archetype.color }}>
      <div className="flex items-center justify-between mb-1">
        <button
          onClick={onReroll}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <span className="text-lg">{archetype.icon}</span>
          <span
            className="font-drg text-sm tracking-wide"
            style={{ color: archetype.color }}
          >
            {archetype.name}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 text-gray-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      <p className="text-xs text-gray-400 italic leading-relaxed">
        "{description}"
      </p>
    </div>
  );
}

function PlayerCard({ loadout, onRerollSlot, onRerollClass, onRerollArchetype, onRerollOverclock }) {
  const {
    playerName,
    class: classInfo,
    archetype,
    archetypeDescription,
    primary,
    secondary,
    grenade,
    traversalTool,
    primaryOverclock,
    secondaryOverclock
  } = loadout;

  return (
    <div
      className="bg-gradient-to-br from-drg-card to-drg-darker rounded-2xl p-5
                 border-l-4 transition-all card-hover border-glow"
      style={{ borderLeftColor: classInfo.color }}
    >
      {/* Header: Player name + Class */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          {/* Player name badge */}
          <span className="player-badge px-3 py-1 rounded-full text-drg-yellow text-sm font-bold truncate max-w-[100px]">
            {playerName}
          </span>

          {/* Class icon */}
          <img
            src={classInfo.icon}
            alt={classInfo.name}
            className="w-10 h-10 object-contain drop-shadow-lg"
          />

          {/* Class name */}
          <button
            onClick={onRerollClass}
            className="font-drg text-2xl hover:text-drg-orange transition-colors tracking-wide"
            title="Click to reroll class"
            style={{ color: classInfo.color }}
          >
            {classInfo.name}
          </button>
        </div>

        {/* Reroll class button */}
        <button
          onClick={onRerollClass}
          className="reroll-spin text-gray-500 hover:text-drg-orange active:text-drg-yellow
                     transition-colors p-2 rounded-lg hover:bg-white/5"
          aria-label="Reroll class"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Archetype Badge (if enabled) */}
      {archetype && (
        <ArchetypeBadge
          archetype={archetype}
          description={archetypeDescription}
          onReroll={onRerollArchetype}
        />
      )}

      {/* Loadout Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
        <SlotItem
          label="Primary"
          item={primary}
          onReroll={() => onRerollSlot('primary')}
          overclock={primaryOverclock}
          onRerollOverclock={() => onRerollOverclock('primary')}
        />
        <SlotItem
          label="Secondary"
          item={secondary}
          onReroll={() => onRerollSlot('secondary')}
          overclock={secondaryOverclock}
          onRerollOverclock={() => onRerollOverclock('secondary')}
        />
        <SlotItem
          label="Grenade"
          item={grenade}
          onReroll={() => onRerollSlot('grenade')}
        />
        <SlotItem
          label="Traversal"
          item={traversalTool}
          canReroll={false}
        />
      </div>
    </div>
  );
}

export default PlayerCard;
