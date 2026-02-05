import { useState } from 'react';
import PlayerInput from './components/PlayerInput';
import GenerateButton from './components/GenerateButton';
import ResultsDisplay from './components/ResultsDisplay';
import { generateRun, rerollSlot, rerollClass } from './utils/randomizer';

function App() {
  const [playerCount, setPlayerCount] = useState(4);
  const [allowDuplicates, setAllowDuplicates] = useState(false);
  const [playerNames, setPlayerNames] = useState(['', '', '', '']);
  const [loadouts, setLoadouts] = useState([]);

  const handleGenerate = () => {
    const names = playerNames.slice(0, playerCount).map(
      (name, i) => name.trim() || `Player ${i + 1}`
    );
    const newLoadouts = generateRun(playerCount, allowDuplicates, names);
    setLoadouts(newLoadouts);
  };

  const handleRerollSlot = (playerId, slotType) => {
    setLoadouts((current) =>
      current.map((loadout) =>
        loadout.id === playerId ? rerollSlot(loadout, slotType) : loadout
      )
    );
  };

  const handleRerollClass = (playerId) => {
    setLoadouts((current) =>
      current.map((loadout) =>
        loadout.id === playerId
          ? rerollClass(loadout, current, allowDuplicates)
          : loadout
      )
    );
  };

  return (
    <div className="min-h-screen text-white flex flex-col items-center px-4 py-8 sm:py-12">
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="font-drg text-drg-orange mb-3 tracking-wide text-glow-orange">
          <span className="text-5xl sm:text-6xl md:text-7xl">D</span>
          <span className="text-2xl sm:text-3xl md:text-4xl">eep</span>
          {' '}
          <span className="text-5xl sm:text-6xl md:text-7xl">R</span>
          <span className="text-2xl sm:text-3xl md:text-4xl">andom</span>
          {' '}
          <span className="text-5xl sm:text-6xl md:text-7xl">N</span>
          <span className="text-2xl sm:text-3xl md:text-4xl">umber</span>
          {' '}
          <span className="text-5xl sm:text-6xl md:text-7xl">G</span>
          <span className="text-2xl sm:text-3xl md:text-4xl">enerator</span>
        </h1>
        <p className="font-drg text-drg-yellow text-xl sm:text-2xl tracking-wider text-glow-yellow">
          Rock and Stone!
        </p>
      </header>

      {/* Controls Panel */}
      <div className="w-full max-w-lg bg-drg-card/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border-glow">
        <div className="flex flex-col items-center gap-6">
          <PlayerInput
            playerCount={playerCount}
            setPlayerCount={setPlayerCount}
            allowDuplicates={allowDuplicates}
            setAllowDuplicates={setAllowDuplicates}
            playerNames={playerNames}
            setPlayerNames={setPlayerNames}
          />
          <GenerateButton
            onClick={handleGenerate}
            hasResults={loadouts.length > 0}
          />
        </div>
      </div>

      {/* Results */}
      <ResultsDisplay
        loadouts={loadouts}
        onRerollSlot={handleRerollSlot}
        onRerollClass={handleRerollClass}
      />

      {/* Footer hint */}
      {loadouts.length > 0 && (
        <p className="text-gray-500 text-sm mt-8 text-center">
          Tap any weapon or grenade to reroll just that slot
        </p>
      )}

      {/* Footer */}
      <footer className="mt-auto pt-8 text-gray-600 text-xs text-center">
        <p>For Karl!</p>
      </footer>
    </div>
  );
}

export default App;
