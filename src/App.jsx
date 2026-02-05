import { useState, useCallback } from 'react';
import PlayerInput from './components/PlayerInput';
import GenerateButton from './components/GenerateButton';
import ResultsDisplay from './components/ResultsDisplay';
import ChallengeDisplay from './components/ChallengeDisplay';
import RerollAnimation from './components/RerollAnimation';
import { generateRun, rerollSlot, rerollClass, rerollArchetype, selectChallenges, rerollChallenges } from './utils/randomizer';

function App() {
  const [playerCount, setPlayerCount] = useState(4);
  const [allowDuplicates, setAllowDuplicates] = useState(false);
  const [useArchetypes, setUseArchetypes] = useState(false);
  const [useChallenges, setUseChallenges] = useState(false);
  const [playerNames, setPlayerNames] = useState(['', '', '', '']);
  const [loadouts, setLoadouts] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const doGenerate = useCallback(() => {
    const names = playerNames.slice(0, playerCount).map(
      (name, i) => name.trim() || `Player ${i + 1}`
    );
    const newLoadouts = generateRun(playerCount, allowDuplicates, names, useArchetypes);
    setLoadouts(newLoadouts);

    // Generate challenges if enabled
    if (useChallenges) {
      const challengeCount = Math.floor(Math.random() * 2) + 1; // 1-2 challenges
      const newChallenges = selectChallenges(challengeCount, newLoadouts);
      setChallenges(newChallenges);
    } else {
      setChallenges([]);
    }
  }, [playerCount, allowDuplicates, playerNames, useArchetypes, useChallenges]);

  const handleGenerate = () => {
    setIsLoading(true);
    setIsFadingOut(false);
    setShowResults(false);
    setLoadouts([]);
    setChallenges([]);

    setTimeout(() => {
      setIsFadingOut(true);

      setTimeout(() => {
        doGenerate();
        setIsLoading(false);
        setShowResults(true);
      }, 300);
    }, 600);
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

  const handleRerollArchetype = (playerId) => {
    setLoadouts((current) =>
      current.map((loadout) =>
        loadout.id === playerId ? rerollArchetype(loadout) : loadout
      )
    );
  };

  const handleRerollChallenge = (index) => {
    const newChallenges = rerollChallenges(1, loadouts, challenges);
    if (newChallenges.length > 0) {
      setChallenges(current => {
        const updated = [...current];
        updated[index] = newChallenges[0];
        return updated;
      });
    }
  };

  const handleRerollAllChallenges = () => {
    const challengeCount = challenges.length || 2;
    const newChallenges = selectChallenges(challengeCount, loadouts);
    setChallenges(newChallenges);
  };

  return (
    <div className="min-h-screen text-white flex flex-col items-center px-4 py-8 sm:py-12">
      {/* Header */}
      <header className="text-center mb-10">
        <h1
          className="font-drg drg-title-main text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-wider mb-1"
          data-text="DEEP ROCK"
        >
          DEEP ROCK
        </h1>
        <h2 className="font-drg drg-title-sub text-xl sm:text-2xl md:text-3xl tracking-[0.3em] mb-4">
          NUMBER GENERATOR
        </h2>
        <p className="font-drg drg-title-sub text-lg sm:text-xl tracking-[0.2em]">
          ROCK AND STONE!
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
            useArchetypes={useArchetypes}
            setUseArchetypes={setUseArchetypes}
            useChallenges={useChallenges}
            setUseChallenges={setUseChallenges}
            playerNames={playerNames}
            setPlayerNames={setPlayerNames}
          />
          <GenerateButton
            onClick={handleGenerate}
            hasResults={loadouts.length > 0}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Loading Animation or Results */}
      {isLoading ? (
        <RerollAnimation fadeOut={isFadingOut} />
      ) : (
        <div className={showResults ? 'animate-fade-in w-full flex flex-col items-center' : 'w-full flex flex-col items-center'}>
          {/* Challenges */}
          <ChallengeDisplay
            challenges={challenges}
            onRerollChallenge={handleRerollChallenge}
            onRerollAll={handleRerollAllChallenges}
          />

          {/* Loadouts */}
          <ResultsDisplay
            loadouts={loadouts}
            onRerollSlot={handleRerollSlot}
            onRerollClass={handleRerollClass}
            onRerollArchetype={handleRerollArchetype}
          />
        </div>
      )}

      {/* Footer hint */}
      {loadouts.length > 0 && !isLoading && (
        <p className={`text-gray-500 text-sm mt-8 text-center ${showResults ? 'animate-fade-in' : ''}`}>
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
