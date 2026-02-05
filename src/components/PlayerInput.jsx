function PlayerInput({
  playerCount,
  setPlayerCount,
  allowDuplicates,
  setAllowDuplicates,
  useArchetypes,
  setUseArchetypes,
  playerNames,
  setPlayerNames
}) {
  const handleNameChange = (index, name) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  return (
    <div className="flex flex-col gap-6 items-center w-full">
      {/* Top Row: Player Count */}
      <div className="flex flex-col items-center gap-3">
        <label className="text-drg-yellow text-sm font-medium uppercase tracking-widest">
          Squad Size
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((num) => (
            <button
              key={num}
              onClick={() => setPlayerCount(num)}
              className={`w-14 h-14 text-xl font-bold rounded-lg transition-all active:scale-95
                border-2 font-drg
                ${playerCount === num
                  ? 'bg-drg-orange text-drg-darker border-drg-yellow shadow-lg shadow-drg-orange/40'
                  : 'bg-drg-darker/50 text-gray-400 border-gray-700 hover:border-drg-orange/50 hover:text-white'
                }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* Toggle Row: Duplicates & Archetypes */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full">
        {/* Duplicate Toggle */}
        <div className="flex flex-col items-center gap-2">
          <label className="text-drg-yellow text-xs font-medium uppercase tracking-widest">
            Duplicates
          </label>
          <button
            onClick={() => setAllowDuplicates(!allowDuplicates)}
            className={`px-5 py-3 rounded-lg font-medium transition-all min-w-[110px] active:scale-95
              border-2 uppercase tracking-wide text-sm
              ${allowDuplicates
                ? 'bg-drg-orange text-drg-darker border-drg-yellow shadow-lg shadow-drg-orange/40'
                : 'bg-drg-darker/50 text-gray-400 border-gray-700 hover:border-drg-orange/50 hover:text-white'
              }`}
          >
            {allowDuplicates ? '✓ On' : '✗ Off'}
          </button>
        </div>

        {/* Archetypes Toggle */}
        <div className="flex flex-col items-center gap-2">
          <label className="text-drg-yellow text-xs font-medium uppercase tracking-widest">
            Archetypes
          </label>
          <button
            onClick={() => setUseArchetypes(!useArchetypes)}
            className={`px-5 py-3 rounded-lg font-medium transition-all min-w-[110px] active:scale-95
              border-2 uppercase tracking-wide text-sm
              ${useArchetypes
                ? 'bg-drg-orange text-drg-darker border-drg-yellow shadow-lg shadow-drg-orange/40'
                : 'bg-drg-darker/50 text-gray-400 border-gray-700 hover:border-drg-orange/50 hover:text-white'
              }`}
          >
            {useArchetypes ? '✓ On' : '✗ Off'}
          </button>
        </div>
      </div>

      {/* Player Names */}
      <div className="flex flex-col gap-3 w-full">
        <label className="text-drg-yellow text-sm font-medium text-center uppercase tracking-widest">
          Dwarf Names
        </label>
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: playerCount }).map((_, index) => (
            <div key={index} className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-drg-orange/60 text-sm font-bold">
                {index + 1}.
              </span>
              <input
                type="text"
                value={playerNames[index] || ''}
                onChange={(e) => handleNameChange(index, e.target.value)}
                placeholder={`Player ${index + 1}`}
                className="w-full bg-drg-darker/50 text-white pl-9 pr-4 py-3 rounded-lg
                           placeholder:text-gray-600 outline-none
                           border-2 border-gray-700 focus:border-drg-orange/50
                           transition-all"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PlayerInput;
