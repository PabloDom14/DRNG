import { useEffect, useRef } from 'react';

function RerollAnimation({ fadeOut }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  return (
    <div
      ref={ref}
      className={`w-full max-w-5xl flex items-center justify-center py-16 transition-opacity duration-300 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
    >
      <img
        src="/rock-and-stone.gif"
        alt="Loading..."
        className="w-24 h-24 sm:w-32 sm:h-32 object-contain rounded-lg"
      />
    </div>
  );
}

export default RerollAnimation;
