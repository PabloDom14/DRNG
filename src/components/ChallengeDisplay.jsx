function ChallengeCard({ challenge, onReroll }) {
  const difficultyColors = {
    easy: 'text-green-400 border-green-400/30',
    medium: 'text-yellow-400 border-yellow-400/30',
    hard: 'text-red-400 border-red-400/30'
  };

  return (
    <div className={`bg-drg-card/50 rounded-lg p-4 border-l-2 ${difficultyColors[challenge.difficulty]} flex items-start gap-3`}>
      <span className="text-2xl">{challenge.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-white font-medium">{challenge.text}</p>
        {challenge.assignedPlayer && (
          <p className="text-drg-yellow text-sm mt-1">
            → {challenge.assignedPlayer}
          </p>
        )}
      </div>
      <button
        onClick={onReroll}
        className="text-gray-500 hover:text-drg-orange transition-colors p-1 flex-shrink-0"
        aria-label="Reroll challenge"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}

function ChallengeDisplay({ challenges, onRerollChallenge, onRerollAll }) {
  if (!challenges || challenges.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-5xl mb-8">
      {/* Section header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
        <div className="flex items-center gap-2">
          <h2 className="font-drg text-red-400 text-lg tracking-widest uppercase">
            Challenges
          </h2>
          <button
            onClick={onRerollAll}
            className="text-gray-500 hover:text-red-400 transition-colors p-1"
            aria-label="Reroll all challenges"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
      </div>

      {/* Challenge cards */}
      <div className="flex flex-col gap-3">
        {challenges.map((challenge, index) => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            onReroll={() => onRerollChallenge(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default ChallengeDisplay;
