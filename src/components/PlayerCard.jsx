function SlotItem({ label, item, onReroll, canReroll = true }) {
  const { name, icon } = typeof item === 'object' ? item : { name: item, icon: null };

  return (
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
  );
}

function PlayerCard({ loadout, onRerollSlot, onRerollClass }) {
  const { playerName, class: classInfo, primary, secondary, grenade, traversalTool } = loadout;

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

      {/* Loadout Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
        <SlotItem
          label="Primary"
          item={primary}
          onReroll={() => onRerollSlot('primary')}
        />
        <SlotItem
          label="Secondary"
          item={secondary}
          onReroll={() => onRerollSlot('secondary')}
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
