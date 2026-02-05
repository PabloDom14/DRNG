function GenerateButton({ onClick, hasResults }) {
  return (
    <button
      onClick={onClick}
      className="relative px-10 py-4 btn-shimmer text-drg-darker
                 text-xl sm:text-2xl font-bold rounded-xl transition-all
                 hover:scale-105 active:scale-95
                 shadow-lg shadow-drg-orange/30
                 border-2 border-drg-yellow/50
                 font-drg tracking-wider"
    >
      <span className="relative z-10 drop-shadow-md">
        {hasResults ? '⟳ Reroll All' : '⚒ Generate Run'}
      </span>
    </button>
  );
}

export default GenerateButton;
