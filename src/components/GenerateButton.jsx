function GenerateButton({ onClick, hasResults, isLoading }) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`relative px-10 py-4 text-drg-darker
                 text-xl sm:text-2xl font-bold rounded-xl transition-all
                 shadow-lg shadow-drg-orange/30
                 border-2 border-drg-yellow/50
                 font-drg tracking-wider
                 ${isLoading
                   ? 'opacity-50 cursor-not-allowed bg-drg-orange'
                   : 'btn-shimmer hover:scale-105 active:scale-95'
                 }`}
    >
      <span className="relative z-10 drop-shadow-md">
        {isLoading ? '⛏ Mining...' : hasResults ? '⟳ Reroll All' : '⚒ Generate Run'}
      </span>
    </button>
  );
}

export default GenerateButton;
