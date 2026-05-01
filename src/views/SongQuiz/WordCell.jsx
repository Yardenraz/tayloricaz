import { useState } from "react";

export const WordCell = ({ word, isVisible = false, losingWord = false, onReveal }) => {
  const [hintLevel, setHintLevel] = useState(0);
  const showHint = !isVisible && !losingWord;

  const handleHintClick = (e) => {
    e.stopPropagation();
    const nextLevel = hintLevel + 1;
    if (nextLevel >= word.length) {
      onReveal?.();
    } else {
      setHintLevel(nextLevel);
    }
  };

  const displayText = !isVisible && hintLevel > 0
    ? word.slice(0, hintLevel) + "_".repeat(Math.max(0, word.length - hintLevel))
    : word;

  return (
    <div className={`${!losingWord ? isVisible && "animate-appear" : "animate-appear-lose"} border color-gree relative group`}>
      <p className={`${isVisible || hintLevel > 0 ? "visible" : "invisible"}`}>
        {displayText}
      </p>
      {showHint && (
        <span
          onClick={handleHintClick}
          className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 cursor-pointer text-sm"
          title={hintLevel + 1 >= word.length ? "Reveal word" : "Reveal next letter"}
        >
          💡
        </span>
      )}
    </div>
  );
};
